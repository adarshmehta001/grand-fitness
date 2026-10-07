"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminSubscriptionsRouter = void 0;
var _express = require("express");
var _prisma = require("../../lib/prisma");
var _auth = require("../../middleware/auth");
var _requireRole = require("../../middleware/requireRole");
var _client = require("@prisma/client");
const adminSubscriptionsRouter = exports.adminSubscriptionsRouter = (0, _express.Router)();
adminSubscriptionsRouter.use(_auth.authenticate, (0, _requireRole.requireRole)('ADMIN'));
adminSubscriptionsRouter.get('/', async (req, res, next) => {
  try {
    const {
      status
    } = req.query;
    const subscriptions = await _prisma.prisma.subscription.findMany({
      where: {
        ...(status ? {
          status: status
        } : {})
      },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        },
        plan: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        currentPeriodEnd: 'desc'
      }
    });
    res.json(subscriptions);
  } catch (err) {
    next(err);
  }
});