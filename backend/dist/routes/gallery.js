"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
exports.galleryRouter = (0, express_1.Router)();
exports.galleryRouter.get('/', async (req, res, next) => {
    try {
        const { category } = req.query;
        const images = await prisma_1.prisma.galleryImage.findMany({
            where: {
                isActive: true,
                ...(category && category !== 'All' ? { category: String(category) } : {})
            },
            orderBy: { sortOrder: 'asc' }
        });
        res.json(images);
    }
    catch (err) {
        next(err);
    }
});
