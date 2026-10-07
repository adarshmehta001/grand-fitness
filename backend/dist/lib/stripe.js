"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../config");
exports.stripe = new stripe_1.default(config_1.config.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
    appInfo: {
        name: 'Apex Performance',
        version: '1.0.0',
    }
});
