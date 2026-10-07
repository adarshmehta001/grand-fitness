"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminProgramsRouter = void 0;
var _express = require("express");
var _zod = require("zod");
var _prisma = require("../../lib/prisma");
var _auth = require("../../middleware/auth");
var _requireRole = require("../../middleware/requireRole");
const adminProgramsRouter = exports.adminProgramsRouter = (0, _express.Router)();
adminProgramsRouter.use(_auth.authenticate, (0, _requireRole.requireRole)('ADMIN'));
const programSchema = _zod.z.object({
  slug: _zod.z.string().min(1),
  title: _zod.z.string().min(1),
  category: _zod.z.string().min(1),
  description: _zod.z.string().min(1),
  intensity: _zod.z.string().min(1),
  experienceLevel: _zod.z.string().min(1),
  duration: _zod.z.string().min(1),
  imageUrl: _zod.z.string().url(),
  isActive: _zod.z.boolean().optional()
});
adminProgramsRouter.get('/', async (req, res, next) => {
  try {
    const programs = await _prisma.prisma.program.findMany();
    res.json(programs);
  } catch (err) {
    next(err);
  }
});
adminProgramsRouter.get('/:id', async (req, res, next) => {
  try {
    const program = await _prisma.prisma.program.findUnique({
      where: {
        id: req.params.id
      }
    });
    if (!program) return res.status(404).json({
      error: 'Not found'
    });
    res.json(program);
  } catch (err) {
    next(err);
  }
});
adminProgramsRouter.post('/', async (req, res, next) => {
  try {
    const data = programSchema.parse(req.body);
    const program = await _prisma.prisma.program.create({
      data
    });
    res.status(201).json(program);
  } catch (err) {
    next(err);
  }
});
adminProgramsRouter.patch('/:id', async (req, res, next) => {
  try {
    const data = programSchema.partial().parse(req.body);
    const program = await _prisma.prisma.program.update({
      where: {
        id: req.params.id
      },
      data
    });
    res.json(program);
  } catch (err) {
    next(err);
  }
});
adminProgramsRouter.delete('/:id', async (req, res, next) => {
  try {
    // Soft delete
    await _prisma.prisma.program.update({
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