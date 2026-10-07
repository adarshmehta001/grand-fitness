"use strict";

var _vitest = require("vitest");
var _supertest = _interopRequireDefault(require("supertest"));
var _app = require("../src/app");
var _prisma = require("../src/lib/prisma");
var _argon = _interopRequireDefault(require("argon2"));
var _stripe = require("../src/lib/stripe");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// We import stripe to mock its verify function
_vitest.vi.mock('../src/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: _vitest.vi.fn()
    },
    subscriptions: {
      retrieve: _vitest.vi.fn()
    }
  }
}));
(0, _vitest.describe)('API Integration Tests', () => {
  (0, _vitest.beforeEach)(() => {
    _vitest.vi.clearAllMocks();
  });
  (0, _vitest.describe)('Auth Routes', () => {
    (0, _vitest.it)('should register a new user', async () => {
      // @ts-ignore
      _prisma.prisma.user.findUnique.mockResolvedValue(null);
      // @ts-ignore
      _prisma.prisma.user.create.mockResolvedValue({
        id: 'u1',
        email: 'test@example.com',
        role: 'MEMBER'
      });
      const res = await (0, _supertest.default)(_app.app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123'
      });
      (0, _vitest.expect)(res.status).toBe(201);
      (0, _vitest.expect)(res.body.accessToken).toBeDefined();
    });
    (0, _vitest.it)('should prevent duplicate registration', async () => {
      // @ts-ignore
      _prisma.prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'test@example.com'
      });
      const res = await (0, _supertest.default)(_app.app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123'
      });
      (0, _vitest.expect)(res.status).toBe(409);
    });
    (0, _vitest.it)('should login a valid user', async () => {
      const hash = await _argon.default.hash('password123');
      // @ts-ignore
      _prisma.prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'test@example.com',
        passwordHash: hash,
        isActive: true,
        role: 'MEMBER'
      });
      const res = await (0, _supertest.default)(_app.app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
      });
      (0, _vitest.expect)(res.status).toBe(200);
      (0, _vitest.expect)(res.body.accessToken).toBeDefined();
    });
  });
  (0, _vitest.describe)('RBAC (Role Based Access Control)', () => {
    (0, _vitest.it)('should reject unauthenticated requests to admin routes', async () => {
      const res = await (0, _supertest.default)(_app.app).get('/admin/programs');
      (0, _vitest.expect)(res.status).toBe(401);
    });

    // Additional tests could verify token injection and role failure
  });
  (0, _vitest.describe)('Webhooks', () => {
    (0, _vitest.it)('should verify signature and process webhook idempotently', async () => {
      // Mock stripe event construction
      const mockEvent = {
        id: 'evt_123',
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub_123',
            status: 'canceled'
          }
        }
      };
      // @ts-ignore
      _stripe.stripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      // First run: Event does not exist
      // @ts-ignore
      _prisma.prisma.paymentEvent.findUnique.mockResolvedValue(null);
      const res1 = await (0, _supertest.default)(_app.app).post('/webhooks/stripe').set('stripe-signature', 'valid-sig').send(JSON.stringify(mockEvent));
      (0, _vitest.expect)(res1.status).toBe(200);
      (0, _vitest.expect)(res1.body).toEqual({
        received: true
      });
      (0, _vitest.expect)(_prisma.prisma.paymentEvent.create).toHaveBeenCalledTimes(1);

      // Second run: Event already processed (idempotency check)
      // @ts-ignore
      _prisma.prisma.paymentEvent.findUnique.mockResolvedValue({
        id: 'pe_1',
        stripeEventId: 'evt_123'
      });
      const res2 = await (0, _supertest.default)(_app.app).post('/webhooks/stripe').set('stripe-signature', 'valid-sig').send(JSON.stringify(mockEvent));
      (0, _vitest.expect)(res2.status).toBe(200);
      (0, _vitest.expect)(res2.body.skipped).toBe(true);
      // create should not be called again
      (0, _vitest.expect)(_prisma.prisma.paymentEvent.create).toHaveBeenCalledTimes(1);
    });
  });
});