"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProgramsRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const requireRole_1 = require("../../middleware/requireRole");
exports.adminProgramsRouter = (0, express_1.Router)();
exports.adminProgramsRouter.use(auth_1.authenticate, (0, requireRole_1.requireRole)('ADMIN'));
const programSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    intensity: zod_1.z.string().min(1),
    experienceLevel: zod_1.z.string().min(1),
    duration: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().url(),
    isActive: zod_1.z.boolean().optional()
});
exports.adminProgramsRouter.get('/', async (req, res, next) => {
    try {
        const programs = await prisma_1.prisma.program.findMany();
        res.json(programs);
    }
    catch (err) {
        next(err);
    }
});
exports.adminProgramsRouter.get('/:id', async (req, res, next) => {
    try {
        const program = await prisma_1.prisma.program.findUnique({
            where: { id: req.params.id }
        });
        if (!program)
            return res.status(404).json({ error: 'Not found' });
        res.json(program);
    }
    catch (err) {
        next(err);
    }
});
exports.adminProgramsRouter.post('/', async (req, res, next) => {
    try {
        const data = programSchema.parse(req.body);
        const program = await prisma_1.prisma.program.create({ data });
        res.status(201).json(program);
    }
    catch (err) {
        next(err);
    }
});
exports.adminProgramsRouter.patch('/:id', async (req, res, next) => {
    try {
        const data = programSchema.partial().parse(req.body);
        const program = await prisma_1.prisma.program.update({
            where: { id: req.params.id },
            data
        });
        res.json(program);
    }
    catch (err) {
        next(err);
    }
});
exports.adminProgramsRouter.delete('/:id', async (req, res, next) => {
    try {
        // Soft delete
        await prisma_1.prisma.program.update({
            where: { id: req.params.id },
            data: { isActive: false }
        });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});
