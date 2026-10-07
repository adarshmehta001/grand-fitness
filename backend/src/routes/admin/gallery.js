"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminGalleryRouter = void 0;
var _express = require("express");
var _zod = require("zod");
var _prisma = require("../../lib/prisma");
var _auth = require("../../middleware/auth");
var _requireRole = require("../../middleware/requireRole");
const adminGalleryRouter = exports.adminGalleryRouter = (0, _express.Router)();
adminGalleryRouter.use(_auth.authenticate, (0, _requireRole.requireRole)('ADMIN'));
const gallerySchema = _zod.z.object({
  src: _zod.z.string().url(),
  alt: _zod.z.string().min(1),
  category: _zod.z.string().min(1),
  caption: _zod.z.string().optional(),
  sortOrder: _zod.z.number().int().default(0),
  isActive: _zod.z.boolean().optional()
});
const reorderSchema = _zod.z.array(_zod.z.object({
  id: _zod.z.string(),
  sortOrder: _zod.z.number().int()
}));
adminGalleryRouter.get('/', async (req, res, next) => {
  try {
    const images = await _prisma.prisma.galleryImage.findMany({
      orderBy: {
        sortOrder: 'asc'
      }
    });
    res.json(images);
  } catch (err) {
    next(err);
  }
});
adminGalleryRouter.get('/:id', async (req, res, next) => {
  try {
    const image = await _prisma.prisma.galleryImage.findUnique({
      where: {
        id: req.params.id
      }
    });
    if (!image) return res.status(404).json({
      error: 'Not found'
    });
    res.json(image);
  } catch (err) {
    next(err);
  }
});
adminGalleryRouter.post('/', async (req, res, next) => {
  try {
    const data = gallerySchema.parse(req.body);
    const image = await _prisma.prisma.galleryImage.create({
      data
    });
    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
});
adminGalleryRouter.patch('/reorder', async (req, res, next) => {
  try {
    const items = reorderSchema.parse(req.body);
    await _prisma.prisma.$transaction(items.map(item => _prisma.prisma.galleryImage.update({
      where: {
        id: item.id
      },
      data: {
        sortOrder: item.sortOrder
      }
    })));
    res.json({
      success: true
    });
  } catch (err) {
    next(err);
  }
});
adminGalleryRouter.patch('/:id', async (req, res, next) => {
  try {
    const data = gallerySchema.partial().parse(req.body);
    const image = await _prisma.prisma.galleryImage.update({
      where: {
        id: req.params.id
      },
      data
    });
    res.json(image);
  } catch (err) {
    next(err);
  }
});
adminGalleryRouter.delete('/:id', async (req, res, next) => {
  try {
    await _prisma.prisma.galleryImage.update({
      where: {
        id: req.params.id
      },
      data: {
        isActive: false
      }
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});