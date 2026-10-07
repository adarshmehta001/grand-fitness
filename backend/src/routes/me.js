"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.meRouter = void 0;
var _express = require("express");
var _zod = require("zod");
var _argon = _interopRequireDefault(require("argon2"));
var _auth = require("../middleware/auth");
var _prisma = require("../lib/prisma");

function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }

const meRouter = exports.meRouter = (0, _express.Router)();
meRouter.use(_auth.authenticate);

meRouter.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await _prisma.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

const updateProfileSchema = _zod.z.object({
  name: _zod.z.string().optional(),
  phone: _zod.z.string().optional()
});

meRouter.patch('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = updateProfileSchema.parse(req.body);
    const user = await _prisma.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

const changePasswordSchema = _zod.z.object({
  currentPassword: _zod.z.string(),
  newPassword: _zod.z.string().min(8)
});

meRouter.post('/change-password', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    
    const user = await _prisma.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const isValid = await _argon.default.verify(user.passwordHash, currentPassword);
    if (!isValid) return res.status(401).json({ error: 'Incorrect current password' });
    
    const passwordHash = await _argon.default.hash(newPassword);
    await _prisma.prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
});

meRouter.get('/favorites', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const favorites = await _prisma.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    const programIds = favorites.filter(f => f.itemType === 'program').map(f => f.itemId);
    const classIds = favorites.filter(f => f.itemType === 'class').map(f => f.itemId);
    
    const [programs, classes] = await Promise.all([
      _prisma.prisma.program.findMany({ where: { id: { in: programIds } } }),
      _prisma.prisma.scheduleClass.findMany({ 
        where: { id: { in: classIds } },
        include: { trainer: { select: { id: true, name: true, imageUrl: true } } }
      })
    ]);
    
    const programMap = new Map(programs.map(p => [p.id, p]));
    const classMap = new Map(classes.map(c => [c.id, c]));
    
    const populated = favorites.map(f => ({
      ...f,
      program: f.itemType === 'program' ? programMap.get(f.itemId) : undefined,
      class: f.itemType === 'class' ? classMap.get(f.itemId) : undefined
    })).filter(f => f.program || f.class); // Filter out if the referenced item was deleted
    
    res.json(populated);
  } catch (err) {
    next(err);
  }
});

const addFavoriteSchema = _zod.z.object({
  itemType: _zod.z.enum(['program', 'class']),
  itemId: _zod.z.string()
});

meRouter.post('/favorites', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemType, itemId } = addFavoriteSchema.parse(req.body);
    
    try {
      const favorite = await _prisma.prisma.favorite.create({
        data: { userId, itemType, itemId }
      });
      res.status(201).json(favorite);
    } catch (e) {
      if (e.code === 'P2002') { // Unique constraint violation
        return res.status(409).json({ error: 'Item already favorited' });
      }
      throw e;
    }
  } catch (err) {
    next(err);
  }
});

meRouter.delete('/favorites/:id', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const favoriteId = req.params.id;
    
    const favorite = await _prisma.prisma.favorite.findUnique({ where: { id: favoriteId } });
    if (!favorite) return res.status(404).json({ error: 'Favorite not found' });
    if (favorite.userId !== userId) return res.status(403).json({ error: 'Forbidden' });
    
    await _prisma.prisma.favorite.delete({ where: { id: favoriteId } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

meRouter.get('/enquiries', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const enquiries = await _prisma.prisma.enquiry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(enquiries);
  } catch (err) {
    next(err);
  }
});

meRouter.get('/subscription', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const subscription = await _prisma.prisma.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['ACTIVE', 'TRIALING', 'PAST_DUE']
        }
      },
      include: {
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
    if (!subscription) {
      return res.json(null);
    }
    res.json(subscription);
  } catch (err) {
    next(err);
  }
});