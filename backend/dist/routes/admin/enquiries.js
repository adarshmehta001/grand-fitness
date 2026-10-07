"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminEnquiriesRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const requireRole_1 = require("../../middleware/requireRole");
exports.adminEnquiriesRouter = (0, express_1.Router)();
exports.adminEnquiriesRouter.use(auth_1.authenticate, (0, requireRole_1.requireRole)('ADMIN'));
exports.adminEnquiriesRouter.get('/', async (req, res, next) => {
    try {
        const { interestType, handled } = req.query;
        const enquiries = await prisma_1.prisma.enquiry.findMany({
            where: {
                ...(interestType ? { interestType: interestType } : {}),
                ...(handled === 'true' ? { handledAt: { not: null } } : {}),
                ...(handled === 'false' ? { handledAt: null } : {})
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(enquiries);
    }
    catch (err) {
        next(err);
    }
});
exports.adminEnquiriesRouter.patch('/:id', async (req, res, next) => {
    try {
        const enquiry = await prisma_1.prisma.enquiry.update({
            where: { id: req.params.id },
            data: { handledAt: new Date() }
        });
        res.json(enquiry);
    }
    catch (err) {
        next(err);
    }
});
