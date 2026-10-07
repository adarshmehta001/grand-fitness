"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authRouter = void 0;
var _express = require("express");
var _argon = _interopRequireDefault(require("argon2"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _crypto = _interopRequireDefault(require("crypto"));
var _zod = require("zod");
var _prisma = require("../lib/prisma");
var _config = require("../config");
var _rateLimiter = require("../middleware/rateLimiter");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const authRouter = exports.authRouter = (0, _express.Router)();
const generateTokens = (userId, role) => {
  const accessToken = _jsonwebtoken.default.sign({
    id: userId,
    role
  }, _config.config.JWT_SECRET, {
    expiresIn: '15m'
  });
  const refreshToken = _crypto.default.randomBytes(40).toString('hex');
  return {
    accessToken,
    refreshToken
  };
};
const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: _config.config.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};
const registerSchema = _zod.z.object({
  email: _zod.z.string().email(),
  password: _zod.z.string().min(8),
  name: _zod.z.string().optional()
});
authRouter.post('/register', _rateLimiter.authLimiter, async (req, res, next) => {
  try {
    const {
      email,
      password,
      name
    } = registerSchema.parse(req.body);
    const existingUser = await _prisma.prisma.user.findUnique({
      where: {
        email
      }
    });
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already in use'
      });
    }
    const passwordHash = await _argon.default.hash(password);
    const user = await _prisma.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'MEMBER'
      }
    });
    const {
      accessToken,
      refreshToken
    } = generateTokens(user.id, user.role);
    const refreshTokenHash = await _argon.default.hash(refreshToken);
    await _prisma.prisma.refreshToken.create({
      data: {
        tokenHash: refreshTokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    setRefreshCookie(res, refreshToken);
    res.status(201).json({
      accessToken
    });
  } catch (err) {
    next(err);
  }
});
const loginSchema = _zod.z.object({
  email: _zod.z.string().email(),
  password: _zod.z.string()
});
authRouter.post('/login', _rateLimiter.authLimiter, async (req, res, next) => {
  try {
    const {
      email,
      password
    } = loginSchema.parse(req.body);
    const user = await _prisma.prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Invalid credentials or inactive account'
      });
    }
    const isValidPassword = await _argon.default.verify(user.passwordHash, password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }
    const {
      accessToken,
      refreshToken
    } = generateTokens(user.id, user.role);
    const refreshTokenHash = await _argon.default.hash(refreshToken);
    await _prisma.prisma.refreshToken.create({
      data: {
        tokenHash: refreshTokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    setRefreshCookie(res, refreshToken);
    res.json({
      accessToken
    });
  } catch (err) {
    next(err);
  }
});
authRouter.post('/refresh', async (req, res, next) => {
  try {
    const {
      refreshToken
    } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({
        error: 'No refresh token provided'
      });
    }

    // Find valid refresh token
    const storedTokens = await _prisma.prisma.refreshToken.findMany({
      where: {
        revokedAt: null,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });
    let validTokenRecord = null;
    for (const record of storedTokens) {
      if (await _argon.default.verify(record.tokenHash, refreshToken)) {
        validTokenRecord = record;
        break;
      }
    }
    if (!validTokenRecord || !validTokenRecord.user.isActive) {
      return res.status(401).json({
        error: 'Invalid or expired refresh token'
      });
    }

    // Revoke old token
    await _prisma.prisma.refreshToken.update({
      where: {
        id: validTokenRecord.id
      },
      data: {
        revokedAt: new Date()
      }
    });

    // Issue new tokens
    const newTokens = generateTokens(validTokenRecord.user.id, validTokenRecord.user.role);
    const newRefreshTokenHash = await _argon.default.hash(newTokens.refreshToken);
    await _prisma.prisma.refreshToken.create({
      data: {
        tokenHash: newRefreshTokenHash,
        userId: validTokenRecord.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    setRefreshCookie(res, newTokens.refreshToken);
    res.json({
      accessToken: newTokens.accessToken
    });
  } catch (err) {
    next(err);
  }
});
authRouter.post('/logout', async (req, res, next) => {
  try {
    const {
      refreshToken
    } = req.cookies;
    if (refreshToken) {
      const storedTokens = await _prisma.prisma.refreshToken.findMany({
        where: {
          revokedAt: null
        }
      });
      for (const record of storedTokens) {
        if (await _argon.default.verify(record.tokenHash, refreshToken)) {
          await _prisma.prisma.refreshToken.update({
            where: {
              id: record.id
            },
            data: {
              revokedAt: new Date()
            }
          });
          break;
        }
      }
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: _config.config.NODE_ENV === 'production'
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

const forgotPasswordSchema = _zod.z.object({
  email: _zod.z.string().email()
});

authRouter.post('/forgot-password', _rateLimiter.authLimiter, async (req, res, next) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await _prisma.prisma.user.findUnique({
      where: { email }
    });

    console.log(`[DEBUG ForgotPassword] User found: ${!!user} (isActive: ${user?.isActive})`);

    if (user && user.isActive) {
      const token = _crypto.default.randomBytes(32).toString('hex');
      const tokenHash = await _argon.default.hash(token);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      const createdToken = await _prisma.prisma.passwordResetToken.create({
        data: {
          tokenHash,
          userId: user.id,
          expiresAt
        }
      });
      console.log(`[DEBUG ForgotPassword] PasswordResetToken created: ${createdToken.id}`);

      if (process.env.RESEND_API_KEY) {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const resetLink = `${_config.config.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

        console.log(`[DEBUG ForgotPassword] Sending email to: ${email}`);
        const resendResponse = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email, // Resend free tier only allows sending to verified email
          subject: 'Reset Your Password - The Grand Fitness',
          html: `<p>Hello,</p><p>Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p><p>This link will expire in 1 hour.</p>`
        });

        console.log(`[DEBUG ForgotPassword] Resend API Response:`, JSON.stringify(resendResponse));
        if (resendResponse.error) {
          console.error("[Resend API Error]:", resendResponse.error);
        }
      } else {
        console.log(`[Forgot Password] Token for ${email}: ${token}`);
      }
    }

    // Always return success to prevent email enumeration
    res.json({ message: 'If an account with that email exists, we have sent a password reset link.' });
  } catch (err) {
    next(err);
  }
});

const resetPasswordSchema = _zod.z.object({
  token: _zod.z.string(),
  newPassword: _zod.z.string().min(8)
});

authRouter.post('/reset-password', _rateLimiter.authLimiter, async (req, res, next) => {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);

    const tokens = await _prisma.prisma.passwordResetToken.findMany({
      where: {
        expiresAt: { gt: new Date() }
      },
      include: { user: true }
    });

    let validTokenRecord = null;
    for (const record of tokens) {
      if (await _argon.default.verify(record.tokenHash, token)) {
        validTokenRecord = record;
        break;
      }
    }

    if (!validTokenRecord || !validTokenRecord.user.isActive) {
      return res.status(400).json({ error: 'Invalid or expired password reset token' });
    }

    const passwordHash = await _argon.default.hash(newPassword);

    await _prisma.prisma.user.update({
      where: { id: validTokenRecord.user.id },
      data: { passwordHash }
    });

    // Delete the used reset token
    await _prisma.prisma.passwordResetToken.delete({
      where: { id: validTokenRecord.id }
    });

    // Force logout existing sessions (delete refresh tokens)
    await _prisma.prisma.refreshToken.deleteMany({
      where: { userId: validTokenRecord.user.id }
    });

    res.json({ message: 'Password has been successfully reset. Please log in with your new password.' });
  } catch (err) {
    next(err);
  }
});