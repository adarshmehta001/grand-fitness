"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scheduleRouter = void 0;
var _express = require("express");
var _prisma = require("../lib/prisma");
var _client = require("@prisma/client");
const scheduleRouter = exports.scheduleRouter = (0, _express.Router)();
scheduleRouter.get('/', async (req, res, next) => {
  try {
    const {
      day,
      category
    } = req.query;
    const classes = await _prisma.prisma.scheduleClass.findMany({
      where: {
        ...(day ? {
          day: day
        } : {}),
        ...(category ? {
          category: category
        } : {})
      },
      include: {
        trainer: {
          select: {
            name: true
          }
        }
      }
    });

    // Format to match frontend structure, hoisting trainer name
    const formattedClasses = classes.map(c => ({
      ...c,
      trainer: c.trainer.name
    }));
    res.json(formattedClasses);
  } catch (err) {
    next(err);
  }
});