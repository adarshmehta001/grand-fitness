"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticate = void 0;
var _express = require("express");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _config = require("../config");
var _prisma = require("../lib/prisma");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Missing or invalid authorization header'
    });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = _jsonwebtoken.default.verify(token, _config.config.JWT_SECRET);

    // Check if the user is still active in the database
    const user = await _prisma.prisma.user.findUnique({
      where: {
        id: payload.id
      },
      select: {
        isActive: true
      }
    });
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'User account is inactive or deleted'
      });
    }
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid or expired token'
    });
  }
};
exports.authenticate = authenticate;