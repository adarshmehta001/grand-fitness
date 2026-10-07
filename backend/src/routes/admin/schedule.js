"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminScheduleRouter = void 0;
var _express = require("express");
var _zod = require("zod");
var _prisma = require("../../lib/prisma");
var _auth = require("../../middleware/auth");
var _requireRole = require("../../middleware/requireRole");
var _client = require("@prisma/client");
const adminScheduleRouter = exports.adminScheduleRouter = (0, _express.Router)();
adminScheduleRouter.use(_auth.authenticate, (0, _requireRole.requireRole)('ADMIN'));
const scheduleSchema = _zod.z.object({
  title: _zod.z.string().min(1),
  day: _zod.z.nativeEnum(_client.Day),
  startTime: _zod.z.string().regex(/^\d{2}:\d{2}$/),
  durationMins: _zod.z.number().positive(),
  trainerId: _zod.z.string().min(1),
  category: _zod.z.nativeEnum(_client.ClassCategory),
  intensity: _zod.z.nativeEnum(_client.ClassIntensity)
});
adminScheduleRouter.get('/', async (req, res, next) => {
  try {
    const classes = await _prisma.prisma.scheduleClass.findMany();
    res.json(classes);
  } catch (err) {
    next(err);
  }
});
adminScheduleRouter.get('/:id', async (req, res, next) => {
  try {
    const scheduleClass = await _prisma.prisma.scheduleClass.findUnique({
      where: {
        id: req.params.id
      }
    });
    if (!scheduleClass) return res.status(404).json({
      error: 'Not found'
    });
    res.json(scheduleClass);
  } catch (err) {
    next(err);
  }
});
adminScheduleRouter.post('/', async (req, res, next) => {
  try {
    const data = scheduleSchema.parse(req.body);
    const scheduleClass = await _prisma.prisma.scheduleClass.create({
      data
    });
    res.status(201).json(scheduleClass);
  } catch (err) {
    next(err);
  }
});
adminScheduleRouter.patch('/:id', async (req, res, next) => {
  try {
    const data = scheduleSchema.partial().parse(req.body);
    const scheduleClass = await _prisma.prisma.scheduleClass.update({
      where: {
        id: req.params.id
      },
      data
    });
    res.json(scheduleClass);
  } catch (err) {
    next(err);
  }
});
adminScheduleRouter.delete('/:id', async (req, res, next) => {
  try {
    // Hard delete for schedule items (no isActive flag)
    await _prisma.prisma.scheduleClass.delete({
      where: {
        id: req.params.id
      }
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});