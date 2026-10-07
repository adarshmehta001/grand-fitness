"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
exports.programsRouter = (0, express_1.Router)();
exports.programsRouter.get('/', async (req, res, next) => {
    try {
        const { category } = req.query;
        const programs = await prisma_1.prisma.program.findMany({
            where: {
                isActive: true,
                ...(category ? { category: String(category) } : {})
            }
        });
        res.json(programs);
    }
    catch (err) {
        next(err);
    }
});
exports.programsRouter.get('/:slug', async (req, res, next) => {
    try {
        const { slug } = req.params;
        const program = await prisma_1.prisma.program.findFirst({
            where: { slug, isActive: true },
            include: {
                trainers: {
                    include: {
                        trainer: {
                            select: { id: true, name: true, specialty: true, imageUrl: true }
                        }
                    }
                }
            }
        });
        if (!program) {
            return res.status(404).json({ error: 'Program not found' });
        }
        res.json(program);
    }
    catch (err) {
        next(err);
    }
});
