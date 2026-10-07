"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../lib/prisma");
exports.meRouter = (0, express_1.Router)();
exports.meRouter.use(auth_1.authenticate);
exports.meRouter.get('/', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true, createdAt: true }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (err) {
        next(err);
    }
});
exports.meRouter.get('/subscription', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const subscription = await prisma_1.prisma.subscription.findFirst({
            where: { userId, status: { in: ['ACTIVE', 'TRIALING', 'PAST_DUE'] } },
            include: { plan: { select: { name: true } } },
            orderBy: { currentPeriodEnd: 'desc' }
        });
        if (!subscription) {
            return res.json(null);
        }
        res.json(subscription);
    }
    catch (err) {
        next(err);
    }
});
