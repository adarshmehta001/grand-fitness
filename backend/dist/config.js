"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url(),
    DATABASE_URL_TEST: zod_1.z.string().url().optional(),
    JWT_SECRET: zod_1.z.string().min(32),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32),
    STRIPE_SECRET_KEY: zod_1.z.string().startsWith('sk_'),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().startsWith('whsec_'),
    FRONTEND_URL: zod_1.z.string().url(),
    PORT: zod_1.z.string().regex(/^\d+$/).default('3001').transform(Number),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development')
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.format());
    process.exit(1);
}
exports.config = parsedEnv.data;
