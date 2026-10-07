"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.programsRouter = void 0;
var _express = require("express");
var _prisma = require("../lib/prisma");
const programsRouter = exports.programsRouter = (0, _express.Router)();
programsRouter.get('/', async (req, res, next) => {
  try {
    const {
      category
    } = req.query;
    const programs = await _prisma.prisma.program.findMany({
      where: {
        isActive: true,
        ...(category ? {
          category: String(category)
        } : {})
      }
    });
    res.json(programs);
  } catch (err) {
    next(err);
  }
});
programsRouter.get('/:slug', async (req, res, next) => {
  try {
    const {
      slug
    } = req.params;
    const program = await _prisma.prisma.program.findFirst({
      where: {
        slug,
        isActive: true
      },
      include: {
        trainers: {
          include: {
            trainer: {
              select: {
                id: true,
                name: true,
                specialty: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });
    if (!program) {
      return res.status(404).json({
        error: 'Program not found'
      });
    }
    res.json(program);
  } catch (err) {
    next(err);
  }
});