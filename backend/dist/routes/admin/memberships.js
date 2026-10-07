"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMembershipsRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const requireRole_1 = require("../../middleware/requireRole");
exports.adminMembershipsRouter = (0, express_1.Router)();
exports.adminMembershipsRouter.use(auth_1.authenticate, (0, requireRole_1.requireRole)('ADMIN'));
const membershipSchema = zod_1.z.object({
    id: zod_1.z.string().min(1), // Slug
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    prices: zod_1.z.record(zod_1.z.enum(['monthly', 'quarterly', 'annual']), zod_1.z.number()),
    inclusions: zod_1.z.array(zod_1.z.string()),
    highlight: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional(),
    stripePriceIdMonthly: zod_1.z.string().nullable().optional(),
    stripePriceIdQuarterly: zod_1.z.string().nullable().optional(),
    stripePriceIdAnnual: zod_1.z.string().nullable().optional()
});
exports.adminMembershipsRouter.get('/', async (req, res, next) => {
    try {
        const memberships = await prisma_1.prisma.membershipPlan.findMany();
        res.json(memberships);
    }
    catch (err) {
        next(err);
    }
});
exports.adminMembershipsRouter.get('/:id', async (req, res, next) => {
    try {
        const membership = await prisma_1.prisma.membershipPlan.findUnique({
            where: { id: req.params.id }
        });
        if (!membership)
            return res.status(404).json({ error: 'Not found' });
        res.json(membership);
    }
    catch (err) {
        next(err);
    }
});
exports.adminMembershipsRouter.post('/', async (req, res, next) => {
    try {
        const data = membershipSchema.parse(req.body);
        const membership = await prisma_1.prisma.membershipPlan.create({ data });
        res.status(201).json(membership);
    }
    catch (err) {
        next(err);
    }
});
exports.adminMembershipsRouter.patch('/:id', async (req, res, next) => {
    try {
        const data = membershipSchema.partial().parse(req.body);
        const membership = await prisma_1.prisma.membershipPlan.update({
            where: { id: req.params.id },
            data
        });
        res.json(membership);
    }
    catch (err) {
        next(err);
    }
});
exports.adminMembershipsRouter.delete('/:id', async (req, res, next) => {
    try {
        await prisma_1.prisma.membershipPlan.update({
            where: { id: req.params.id },
            data: { isActive: false }
        });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});
