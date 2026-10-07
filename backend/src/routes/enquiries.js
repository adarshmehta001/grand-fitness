"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enquiriesRouter = void 0;
var _express = require("express");
var _zod = require("zod");
var _prisma = require("../lib/prisma");
var _rateLimiter = require("../middleware/rateLimiter");
var _client = require("@prisma/client");
const enquiriesRouter = exports.enquiriesRouter = (0, _express.Router)();
const enquirySchema = _zod.z.object({
  name: _zod.z.string().min(1, 'Name is required'),
  email: _zod.z.string().email('Invalid email'),
  phone: _zod.z.string().optional(),
  interestType: _zod.z.nativeEnum(_client.EnquiryInterestType),
  interestRefId: _zod.z.string().optional(),
  message: _zod.z.string().min(1, 'Message is required')
});
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _config = require("../config");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }

enquiriesRouter.post('/', _rateLimiter.enquiryLimiter, async (req, res, next) => {
  try {
    const data = enquirySchema.parse(req.body);
    let userId = null;
    
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = _jsonwebtoken.default.verify(token, _config.config.JWT_SECRET);
        const user = await _prisma.prisma.user.findUnique({
          where: { id: payload.id },
          select: { isActive: true }
        });
        if (user && user.isActive) {
          userId = payload.id;
        }
      } catch (e) {
        // Ignore invalid token, just leave userId as null
      }
    }

    await _prisma.prisma.enquiry.create({
      data: { ...data, userId }
    });

    if (process.env.RESEND_API_KEY) {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        // Resend free tier only allows sending to the email you signed up with
        // until you verify a custom domain on their dashboard.
        to: 'ankuraniladarsh@gmail.com', 
        subject: `New Enquiry from ${data.name} (${data.interestType})`,
        text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nInterest: ${data.interestType}\n\nMessage:\n${data.message}`,
      }).catch(err => console.error("[Resend API Error]:", err));
    }

    res.status(201).json({
      message: 'Enquiry submitted successfully'
    });
  } catch (err) {
    next(err);
  }
});