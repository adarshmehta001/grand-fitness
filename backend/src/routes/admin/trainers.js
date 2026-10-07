"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminTrainersRouter = void 0;
var _express = require("express");
var _zod = require("zod");
var _prisma = require("../../lib/prisma");
var _auth = require("../../middleware/auth");
var _requireRole = require("../../middleware/requireRole");
const adminTrainersRouter = exports.adminTrainersRouter = (0, _express.Router)();
adminTrainersRouter.use(_auth.authenticate, (0, _requireRole.requireRole)('ADMIN'));
const trainerSchema = _zod.z.object({
  name: _zod.z.string().min(1),
  specialty: _zod.z.string().min(1),
  bio: _zod.z.string().min(1),
  imageUrl: _zod.z.string().url(),
  isActive: _zod.z.boolean().optional(),
  programs: _zod.z.array(_zod.z.string()).optional() // Array of program IDs
});
adminTrainersRouter.get('/', async (req, res, next) => {
  try {
    const trainers = await _prisma.prisma.trainer.findMany({
      include: {
        programs: {
          select: {
            programId: true
          }
        }
      }
    });
    res.json(trainers.map(t => ({
      ...t,
      programs: t.programs.map(p => p.programId)
    })));
  } catch (err) {
    next(err);
  }
});
adminTrainersRouter.get('/:id', async (req, res, next) => {
  try {
    const trainer = await _prisma.prisma.trainer.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        programs: {
          select: {
            programId: true
          }
        }
      }
    });
    if (!trainer) return res.status(404).json({
      error: 'Not found'
    });
    res.json({
      ...trainer,
      programs: trainer.programs.map(p => p.programId)
    });
  } catch (err) {
    next(err);
  }
});
adminTrainersRouter.post('/', async (req, res, next) => {
  try {
    const {
      programs,
      ...data
    } = trainerSchema.parse(req.body);
    const trainer = await _prisma.prisma.trainer.create({
      data: {
        ...data,
        programs: {
          create: programs?.map(programId => ({
            programId
          })) || []
        }
      },
      include: {
        programs: true
      }
    });
    res.status(201).json(trainer);
  } catch (err) {
    next(err);
  }
});
adminTrainersRouter.patch('/:id', async (req, res, next) => {
  try {
    const {
      programs,
      ...data
    } = trainerSchema.partial().parse(req.body);
    const trainerId = req.params.id;

    // Use a transaction to reconcile the TrainerProgram join table if programs are provided
    const trainer = await _prisma.prisma.$transaction(async tx => {
      if (programs !== undefined) {
        // Delete all existing programs for this trainer
        await tx.trainerProgram.deleteMany({
          where: {
            trainerId
          }
        });

        // Re-add the specified programs
        if (programs.length > 0) {
          await tx.trainerProgram.createMany({
            data: programs.map(programId => ({
              trainerId,
              programId
            }))
          });
        }
      }
      return tx.trainer.update({
        where: {
          id: trainerId
        },
        data,
        include: {
          programs: {
            select: {
              programId: true
            }
          }
        }
      });
    });
    res.json({
      ...trainer,
      programs: trainer.programs.map(p => p.programId)
    });
  } catch (err) {
    next(err);
  }
});
adminTrainersRouter.delete('/:id', async (req, res, next) => {
  try {
    await _prisma.prisma.trainer.update({
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