"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
var _zod = require("zod");
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
_dotenv.default.config();
const envSchema = _zod.z.object({
  DATABASE_URL: _zod.z.string().url(),
  DATABASE_URL_TEST: _zod.z.string().url().optional(),
  JWT_SECRET: _zod.z.string().min(32),
  JWT_REFRESH_SECRET: _zod.z.string().min(32),
  STRIPE_SECRET_KEY: _zod.z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: _zod.z.string().startsWith('whsec_'),
  FRONTEND_URL: _zod.z.string().url(),
  ALLOWED_ORIGINS: _zod.z.string().optional().transform((val, ctx) => {
    if (!val) return undefined;
    return val.split(',').map(v => v.trim()).filter(Boolean);
  }),
  PORT: _zod.z.string().regex(/^\d+$/).default('3001').transform(Number),
  NODE_ENV: _zod.z.enum(['development', 'production', 'test']).default('development')
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}
const config = exports.config = parsedEnv.data;