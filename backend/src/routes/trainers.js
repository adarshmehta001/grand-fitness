"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trainersRouter = void 0;
var _express = require("express");
var _prisma = require("../lib/prisma");
const trainersRouter = exports.trainersRouter = (0, _express.Router)();
trainersRouter.get('/', async (req, res, next) => {
  try {
    const trainers = await _prisma.prisma.trainer.findMany({
      where: {
        isActive: true
      },
      include: {
        programs: {
          select: {
            programId: true
          }
        }
      }
    });

    // Transform to match the frontend shape (programs as array of ids)
    const formattedTrainers = trainers.map(t => ({
      ...t,
      programs: t.programs.map(tp => tp.programId)
    }));
    res.json(formattedTrainers);
  } catch (err) {
    next(err);
  }
});
trainersRouter.get('/:id', async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const trainer = await _prisma.prisma.trainer.findFirst({
      where: {
        id,
        isActive: true
      },
      include: {
        programs: {
          include: {
            program: {
              select: {
                slug: true,
                title: true
              }
            }
          }
        }
      }
    });
    if (!trainer) {
      return res.status(404).json({
        error: 'Trainer not found'
      });
    }
    res.json(trainer);
  } catch (err) {
    next(err);
  }
});