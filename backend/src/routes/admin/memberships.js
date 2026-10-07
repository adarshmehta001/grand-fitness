"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminMembershipsRouter = void 0;
var _express = require("express");
var _zod = require("zod");
var _prisma = require("../../lib/prisma");
var _auth = require("../../middleware/auth");
var _requireRole = require("../../middleware/requireRole");
const adminMembershipsRouter = exports.adminMembershipsRouter = (0, _express.Router)();
adminMembershipsRouter.use(_auth.authenticate, (0, _requireRole.requireRole)('ADMIN'));
const membershipSchema = _zod.z.object({
  id: _zod.z.string().min(1),
  // Slug
  name: _zod.z.string().min(1),
  description: _zod.z.string().min(1),
  prices: _zod.z.record(_zod.z.enum(['monthly', 'quarterly', 'annual']), _zod.z.number()),
  inclusions: _zod.z.array(_zod.z.string()),
  highlight: _zod.z.boolean().optional(),
  isActive: _zod.z.boolean().optional(),
  stripePriceIdMonthly: _zod.z.string().nullable().optional(),
  stripePriceIdQuarterly: _zod.z.string().nullable().optional(),
  stripePriceIdAnnual: _zod.z.string().nullable().optional()
});
adminMembershipsRouter.get('/', async (req, res, next) => {
  try {
    const memberships = await _prisma.prisma.membershipPlan.findMany();
    res.json(memberships);
  } catch (err) {
    next(err);
  }
});
adminMembershipsRouter.get('/:id', async (req, res, next) => {
  try {
    const membership = await _prisma.prisma.membershipPlan.findUnique({
      where: {
        id: req.params.id
      }
    });
    if (!membership) return res.status(404).json({
      error: 'Not found'
    });
    res.json(membership);
  } catch (err) {
    next(err);
  }
});
adminMembershipsRouter.post('/', async (req, res, next) => {
  try {
    const data = membershipSchema.parse(req.body);
    const membership = await _prisma.prisma.membershipPlan.create({
      data
    });
    res.status(201).json(membership);
  } catch (err) {
    next(err);
  }
});
adminMembershipsRouter.patch('/:id', async (req, res, next) => {
  try {
    const data = membershipSchema.partial().parse(req.body);
    const membership = await _prisma.prisma.membershipPlan.update({
      where: {
        id: req.params.id
      },
      data
    });
    res.json(membership);
  } catch (err) {
    next(err);
  }
});
adminMembershipsRouter.delete('/:id', async (req, res, next) => {
  try {
    await _prisma.prisma.membershipPlan.update({
      where: {
        id: req.params.id
      },
      data: {
        isActive: false
      }
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});