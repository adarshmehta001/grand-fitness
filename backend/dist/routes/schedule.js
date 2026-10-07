"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
exports.scheduleRouter = (0, express_1.Router)();
exports.scheduleRouter.get('/', async (req, res, next) => {
    try {
        const { day, category } = req.query;
        const classes = await prisma_1.prisma.scheduleClass.findMany({
            where: {
                ...(day ? { day: day } : {}),
                ...(category ? { category: category } : {})
            },
            include: {
                trainer: { select: { name: true } }
            }
        });
        // Format to match frontend structure, hoisting trainer name
        const formattedClasses = classes.map(c => ({
            ...c,
            trainer: c.trainer.name
        }));
        res.json(formattedClasses);
    }
    catch (err) {
        next(err);
    }
});
