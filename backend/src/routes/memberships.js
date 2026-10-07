"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.membershipsRouter = void 0;
var _express = require("express");
var _prisma = require("../lib/prisma");
const membershipsRouter = exports.membershipsRouter = (0, _express.Router)();
membershipsRouter.get('/', async (req, res, next) => {
  try {
    const plans = await _prisma.prisma.membershipPlan.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        prices: true,
        inclusions: true,
        highlight: true
        // Intentionally excluding stripePriceId* fields from public payload
      }
    });
    res.json(plans);
  } catch (err) {
    next(err);
  }
});