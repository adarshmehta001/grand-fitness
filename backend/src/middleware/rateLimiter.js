"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generalLimiter = exports.enquiryLimiter = exports.authLimiter = void 0;
var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Global limit for standard API routes (200 requests per minute)
const generalLimiter = exports.generalLimiter = (0, _expressRateLimit.default)({
  windowMs: 1 * 60 * 1000,
  // 1 minute
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.'
  }
});

// Stricter limit for auth routes (10 requests per 15 minutes)
const authLimiter = exports.authLimiter = (0, _expressRateLimit.default)({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

// Stricter limit for public enquiry/contact forms (5 requests per 15 minutes)
const enquiryLimiter = exports.enquiryLimiter = (0, _expressRateLimit.default)({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many enquiries submitted, please try again later.'
  }
});