"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiriesRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const rateLimiter_1 = require("../middleware/rateLimiter");
const client_1 = require("@prisma/client");
exports.enquiriesRouter = (0, express_1.Router)();
const enquirySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email'),
    phone: zod_1.z.string().optional(),
    interestType: zod_1.z.nativeEnum(client_1.EnquiryInterestType),
    interestRefId: zod_1.z.string().optional(),
    message: zod_1.z.string().min(1, 'Message is required')
});
exports.enquiriesRouter.post('/', rateLimiter_1.enquiryLimiter, async (req, res, next) => {
    try {
        const data = enquirySchema.parse(req.body);
        await prisma_1.prisma.enquiry.create({ data });
        res.status(201).json({ message: 'Enquiry submitted successfully' });
    }
    catch (err) {
        next(err);
    }
});
