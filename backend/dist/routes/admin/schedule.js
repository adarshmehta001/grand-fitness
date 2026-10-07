"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminScheduleRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const requireRole_1 = require("../../middleware/requireRole");
const client_1 = require("@prisma/client");
exports.adminScheduleRouter = (0, express_1.Router)();
exports.adminScheduleRouter.use(auth_1.authenticate, (0, requireRole_1.requireRole)('ADMIN'));
const scheduleSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    day: zod_1.z.nativeEnum(client_1.Day),
    startTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/),
    durationMins: zod_1.z.number().positive(),
    trainerId: zod_1.z.string().min(1),
    category: zod_1.z.nativeEnum(client_1.ClassCategory),
    intensity: zod_1.z.nativeEnum(client_1.ClassIntensity)
});
exports.adminScheduleRouter.get('/', async (req, res, next) => {
    try {
        const classes = await prisma_1.prisma.scheduleClass.findMany();
        res.json(classes);
    }
    catch (err) {
        next(err);
    }
});
exports.adminScheduleRouter.get('/:id', async (req, res, next) => {
    try {
        const scheduleClass = await prisma_1.prisma.scheduleClass.findUnique({
            where: { id: req.params.id }
        });
        if (!scheduleClass)
            return res.status(404).json({ error: 'Not found' });
        res.json(scheduleClass);
    }
    catch (err) {
        next(err);
    }
});
exports.adminScheduleRouter.post('/', async (req, res, next) => {
    try {
        const data = scheduleSchema.parse(req.body);
        const scheduleClass = await prisma_1.prisma.scheduleClass.create({ data });
        res.status(201).json(scheduleClass);
    }
    catch (err) {
        next(err);
    }
});
exports.adminScheduleRouter.patch('/:id', async (req, res, next) => {
    try {
        const data = scheduleSchema.partial().parse(req.body);
        const scheduleClass = await prisma_1.prisma.scheduleClass.update({
            where: { id: req.params.id },
            data
        });
        res.json(scheduleClass);
    }
    catch (err) {
        next(err);
    }
});
exports.adminScheduleRouter.delete('/:id', async (req, res, next) => {
    try {
        // Hard delete for schedule items (no isActive flag)
        await prisma_1.prisma.scheduleClass.delete({
            where: { id: req.params.id }
        });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});
