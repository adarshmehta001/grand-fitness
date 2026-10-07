"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorHandler = void 0;
var _express = require("express");
var _zod = require("zod");
var _client = require("@prisma/client");
var _config = require("../config");
const errorHandler = (err, req, res, next) => {
  if (_config.config.NODE_ENV !== 'test') {
    console.error('Error:', err);
  }

  // Zod Validation Errors
  if (err instanceof _zod.ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors
    });
  }

  // Prisma Unique Constraint Violations
  if (err instanceof _client.Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Conflict: A record with this value already exists.'
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Not Found: The requested record does not exist.'
      });
    }
  }

  // Stripe Signature Errors
  if (err.type === 'StripeSignatureVerificationError') {
    return res.status(400).json({
      error: 'Invalid Stripe signature'
    });
  }

  // Fallback Error
  const statusCode = err.statusCode || 500;
  const message = _config.config.NODE_ENV === 'production' && statusCode === 500 ? 'Internal Server Error' : err.message || 'Internal Server Error';
  res.status(statusCode).json({
    error: message
  });
};
exports.errorHandler = errorHandler;