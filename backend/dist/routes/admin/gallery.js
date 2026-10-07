"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGalleryRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const requireRole_1 = require("../../middleware/requireRole");
exports.adminGalleryRouter = (0, express_1.Router)();
exports.adminGalleryRouter.use(auth_1.authenticate, (0, requireRole_1.requireRole)('ADMIN'));
const gallerySchema = zod_1.z.object({
    src: zod_1.z.string().url(),
    alt: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    caption: zod_1.z.string().optional(),
    sortOrder: zod_1.z.number().int().default(0),
    isActive: zod_1.z.boolean().optional()
});
const reorderSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string(),
    sortOrder: zod_1.z.number().int()
}));
exports.adminGalleryRouter.get('/', async (req, res, next) => {
    try {
        const images = await prisma_1.prisma.galleryImage.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        res.json(images);
    }
    catch (err) {
        next(err);
    }
});
exports.adminGalleryRouter.get('/:id', async (req, res, next) => {
    try {
        const image = await prisma_1.prisma.galleryImage.findUnique({
            where: { id: req.params.id }
        });
        if (!image)
            return res.status(404).json({ error: 'Not found' });
        res.json(image);
    }
    catch (err) {
        next(err);
    }
});
exports.adminGalleryRouter.post('/', async (req, res, next) => {
    try {
        const data = gallerySchema.parse(req.body);
        const image = await prisma_1.prisma.galleryImage.create({ data });
        res.status(201).json(image);
    }
    catch (err) {
        next(err);
    }
});
exports.adminGalleryRouter.patch('/reorder', async (req, res, next) => {
    try {
        const items = reorderSchema.parse(req.body);
        await prisma_1.prisma.$transaction(items.map(item => prisma_1.prisma.galleryImage.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder }
        })));
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
exports.adminGalleryRouter.patch('/:id', async (req, res, next) => {
    try {
        const data = gallerySchema.partial().parse(req.body);
        const image = await prisma_1.prisma.galleryImage.update({
            where: { id: req.params.id },
            data
        });
        res.json(image);
    }
    catch (err) {
        next(err);
    }
});
exports.adminGalleryRouter.delete('/:id', async (req, res, next) => {
    try {
        await prisma_1.prisma.galleryImage.update({
            where: { id: req.params.id },
            data: { isActive: false }
        });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});
