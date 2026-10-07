"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.membershipsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
exports.membershipsRouter = (0, express_1.Router)();
exports.membershipsRouter.get('/', async (req, res, next) => {
    try {
        const plans = await prisma_1.prisma.membershipPlan.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                description: true,
                prices: true,
                inclusions: true,
                highlight: true
                // Intentionally excluding stripePriceId* fields from public payload
            }
        });
        res.json(plans);
    }
    catch (err) {
        next(err);
    }
});
