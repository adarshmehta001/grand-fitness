"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requireRole = void 0;
var _express = require("express");
const requireRole = requiredRole => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    // ADMINs can access MEMBER routes, but MEMBERs cannot access ADMIN routes
    if (requiredRole === 'ADMIN' && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Forbidden: Insufficient role'
      });
    }
    next();
  };
};
exports.requireRole = requireRole;