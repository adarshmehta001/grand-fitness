"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const config_1 = require("../config");
const rateLimiter_1 = require("../middleware/rateLimiter");
exports.authRouter = (0, express_1.Router)();
const generateTokens = (userId, role) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: userId, role }, config_1.config.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = crypto_1.default.randomBytes(40).toString('hex');
    return { accessToken, refreshToken };
};
const setRefreshCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: config_1.config.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().optional()
});
exports.authRouter.post('/register', rateLimiter_1.authLimiter, async (req, res, next) => {
    try {
        const { email, password, name } = registerSchema.parse(req.body);
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }
        const passwordHash = await argon2_1.default.hash(password);
        const user = await prisma_1.prisma.user.create({
            data: { email, passwordHash, name, role: 'MEMBER' }
        });
        const { accessToken, refreshToken } = generateTokens(user.id, user.role);
        const refreshTokenHash = await argon2_1.default.hash(refreshToken);
        await prisma_1.prisma.refreshToken.create({
            data: {
                tokenHash: refreshTokenHash,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });
        setRefreshCookie(res, refreshToken);
        res.status(201).json({ accessToken });
    }
    catch (err) {
        next(err);
    }
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.authRouter.post('/login', rateLimiter_1.authLimiter, async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Invalid credentials or inactive account' });
        }
        const isValidPassword = await argon2_1.default.verify(user.passwordHash, password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = generateTokens(user.id, user.role);
        const refreshTokenHash = await argon2_1.default.hash(refreshToken);
        await prisma_1.prisma.refreshToken.create({
            data: {
                tokenHash: refreshTokenHash,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });
        setRefreshCookie(res, refreshToken);
        res.json({ accessToken });
    }
    catch (err) {
        next(err);
    }
});
exports.authRouter.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ error: 'No refresh token provided' });
        }
        // Find valid refresh token
        const storedTokens = await prisma_1.prisma.refreshToken.findMany({
            where: {
                revokedAt: null,
                expiresAt: { gt: new Date() }
            },
            include: { user: true }
        });
        let validTokenRecord = null;
        for (const record of storedTokens) {
            if (await argon2_1.default.verify(record.tokenHash, refreshToken)) {
                validTokenRecord = record;
                break;
            }
        }
        if (!validTokenRecord || !validTokenRecord.user.isActive) {
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }
        // Revoke old token
        await prisma_1.prisma.refreshToken.update({
            where: { id: validTokenRecord.id },
            data: { revokedAt: new Date() }
        });
        // Issue new tokens
        const newTokens = generateTokens(validTokenRecord.user.id, validTokenRecord.user.role);
        const newRefreshTokenHash = await argon2_1.default.hash(newTokens.refreshToken);
        await prisma_1.prisma.refreshToken.create({
            data: {
                tokenHash: newRefreshTokenHash,
                userId: validTokenRecord.user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });
        setRefreshCookie(res, newTokens.refreshToken);
        res.json({ accessToken: newTokens.accessToken });
    }
    catch (err) {
        next(err);
    }
});
exports.authRouter.post('/logout', async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            const storedTokens = await prisma_1.prisma.refreshToken.findMany({
                where: { revokedAt: null }
            });
            for (const record of storedTokens) {
                if (await argon2_1.default.verify(record.tokenHash, refreshToken)) {
                    await prisma_1.prisma.refreshToken.update({
                        where: { id: record.id },
                        data: { revokedAt: new Date() }
                    });
                    break;
                }
            }
        }
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: config_1.config.NODE_ENV === 'production'
        });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});
