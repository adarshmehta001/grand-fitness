"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminTrainersRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const requireRole_1 = require("../../middleware/requireRole");
exports.adminTrainersRouter = (0, express_1.Router)();
exports.adminTrainersRouter.use(auth_1.authenticate, (0, requireRole_1.requireRole)('ADMIN'));
const trainerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    specialty: zod_1.z.string().min(1),
    bio: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().url(),
    isActive: zod_1.z.boolean().optional(),
    programs: zod_1.z.array(zod_1.z.string()).optional() // Array of program IDs
});
exports.adminTrainersRouter.get('/', async (req, res, next) => {
    try {
        const trainers = await prisma_1.prisma.trainer.findMany({
            include: { programs: { select: { programId: true } } }
        });
        res.json(trainers.map(t => ({
            ...t,
            programs: t.programs.map(p => p.programId)
        })));
    }
    catch (err) {
        next(err);
    }
});
exports.adminTrainersRouter.get('/:id', async (req, res, next) => {
    try {
        const trainer = await prisma_1.prisma.trainer.findUnique({
            where: { id: req.params.id },
            include: { programs: { select: { programId: true } } }
        });
        if (!trainer)
            return res.status(404).json({ error: 'Not found' });
        res.json({
            ...trainer,
            programs: trainer.programs.map(p => p.programId)
        });
    }
    catch (err) {
        next(err);
    }
});
exports.adminTrainersRouter.post('/', async (req, res, next) => {
    try {
        const { programs, ...data } = trainerSchema.parse(req.body);
        const trainer = await prisma_1.prisma.trainer.create({
            data: {
                ...data,
                programs: {
                    create: programs?.map(programId => ({ programId })) || []
                }
            },
            include: { programs: true }
        });
        res.status(201).json(trainer);
    }
    catch (err) {
        next(err);
    }
});
exports.adminTrainersRouter.patch('/:id', async (req, res, next) => {
    try {
        const { programs, ...data } = trainerSchema.partial().parse(req.body);
        const trainerId = req.params.id;
        // Use a transaction to reconcile the TrainerProgram join table if programs are provided
        const trainer = await prisma_1.prisma.$transaction(async (tx) => {
            if (programs !== undefined) {
                // Delete all existing programs for this trainer
                await tx.trainerProgram.deleteMany({
                    where: { trainerId }
                });
                // Re-add the specified programs
                if (programs.length > 0) {
                    await tx.trainerProgram.createMany({
                        data: programs.map(programId => ({ trainerId, programId }))
                    });
                }
            }
            return tx.trainer.update({
                where: { id: trainerId },
                data,
                include: { programs: { select: { programId: true } } }
            });
        });
        res.json({
            ...trainer,
            programs: trainer.programs.map(p => p.programId)
        });
    }
    catch (err) {
        next(err);
    }
});
exports.adminTrainersRouter.delete('/:id', async (req, res, next) => {
    try {
        await prisma_1.prisma.trainer.update({
            where: { id: req.params.id },
            data: { isActive: false }
        });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});
