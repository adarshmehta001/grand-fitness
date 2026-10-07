"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const errorHandler = (err, req, res, next) => {
    if (config_1.config.NODE_ENV !== 'test') {
        console.error('Error:', err);
    }
    // Zod Validation Errors
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.errors
        });
    }
    // Prisma Unique Constraint Violations
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Conflict: A record with this value already exists.' });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Not Found: The requested record does not exist.' });
        }
    }
    // Stripe Signature Errors
    if (err.type === 'StripeSignatureVerificationError') {
        return res.status(400).json({ error: 'Invalid Stripe signature' });
    }
    // Fallback Error
    const statusCode = err.statusCode || 500;
    const message = config_1.config.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal Server Error'
        : (err.message || 'Internal Server Error');
    res.status(statusCode).json({ error: message });
};
exports.errorHandler = errorHandler;
