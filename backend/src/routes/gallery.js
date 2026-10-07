"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.galleryRouter = void 0;
var _express = require("express");
var _prisma = require("../lib/prisma");
const galleryRouter = exports.galleryRouter = (0, _express.Router)();
galleryRouter.get('/', async (req, res, next) => {
  try {
    const {
      category
    } = req.query;
    const images = await _prisma.prisma.galleryImage.findMany({
      where: {
        isActive: true,
        ...(category && category !== 'All' ? {
          category: String(category)
        } : {})
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });
    res.json(images);
  } catch (err) {
    next(err);
  }
});