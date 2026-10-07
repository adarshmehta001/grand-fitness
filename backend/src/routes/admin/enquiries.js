"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminEnquiriesRouter = void 0;
var _express = require("express");
var _prisma = require("../../lib/prisma");
var _auth = require("../../middleware/auth");
var _requireRole = require("../../middleware/requireRole");
var _client = require("@prisma/client");
const adminEnquiriesRouter = exports.adminEnquiriesRouter = (0, _express.Router)();
adminEnquiriesRouter.use(_auth.authenticate, (0, _requireRole.requireRole)('ADMIN'));
adminEnquiriesRouter.get('/', async (req, res, next) => {
  try {
    const {
      interestType,
      handled
    } = req.query;
    const enquiries = await _prisma.prisma.enquiry.findMany({
      where: {
        ...(interestType ? {
          interestType: interestType
        } : {}),
        ...(handled === 'true' ? {
          handledAt: {
            not: null
          }
        } : {}),
        ...(handled === 'false' ? {
          handledAt: null
        } : {})
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(enquiries);
  } catch (err) {
    next(err);
  }
});
adminEnquiriesRouter.patch('/:id', async (req, res, next) => {
  try {
    const enquiry = await _prisma.prisma.enquiry.update({
      where: {
        id: req.params.id
      },
      data: {
        handledAt: new Date()
      }
    });
    res.json(enquiry);
  } catch (err) {
    next(err);
  }
});