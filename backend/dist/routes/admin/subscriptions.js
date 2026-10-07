"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSubscriptionsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const requireRole_1 = require("../../middleware/requireRole");
exports.adminSubscriptionsRouter = (0, express_1.Router)();
exports.adminSubscriptionsRouter.use(auth_1.authenticate, (0, requireRole_1.requireRole)('ADMIN'));
exports.adminSubscriptionsRouter.get('/', async (req, res, next) => {
    try {
        const { status } = req.query;
        const subscriptions = await prisma_1.prisma.subscription.findMany({
            where: {
                ...(status ? { status: status } : {})
            },
            include: {
                user: { select: { email: true, name: true } },
                plan: { select: { name: true } }
            },
            orderBy: { currentPeriodEnd: 'desc' }
        });
        res.json(subscriptions);
    }
    catch (err) {
        next(err);
    }
});
