"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const errorHandler_1 = require("./middleware/errorHandler");
// Route imports
const webhooks_1 = require("./routes/webhooks");
const auth_1 = require("./routes/auth");
const me_1 = require("./routes/me");
const checkout_1 = require("./routes/checkout");
const memberships_1 = require("./routes/memberships");
const programs_1 = require("./routes/programs");
const trainers_1 = require("./routes/trainers");
const schedule_1 = require("./routes/schedule");
const gallery_1 = require("./routes/gallery");
const enquiries_1 = require("./routes/enquiries");
const programs_2 = require("./routes/admin/programs");
const trainers_2 = require("./routes/admin/trainers");
const schedule_2 = require("./routes/admin/schedule");
const gallery_2 = require("./routes/admin/gallery");
const memberships_2 = require("./routes/admin/memberships");
const enquiries_2 = require("./routes/admin/enquiries");
const subscriptions_1 = require("./routes/admin/subscriptions");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: config_1.config.FRONTEND_URL,
    credentials: true
}));
// MUST be before express.json() so stripe can verify the raw signature
exports.app.use('/webhooks', express_1.default.raw({ type: 'application/json' }), webhooks_1.webhooksRouter);
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
// Auth & Self
exports.app.use('/auth', auth_1.authRouter);
exports.app.use('/me', me_1.meRouter);
exports.app.use('/checkout', checkout_1.checkoutRouter);
// Public Content
exports.app.use('/memberships', memberships_1.membershipsRouter);
exports.app.use('/programs', programs_1.programsRouter);
exports.app.use('/trainers', trainers_1.trainersRouter);
exports.app.use('/schedule', schedule_1.scheduleRouter);
exports.app.use('/gallery', gallery_1.galleryRouter);
exports.app.use('/enquiries', enquiries_1.enquiriesRouter);
// Admin CMS
exports.app.use('/admin/programs', programs_2.adminProgramsRouter);
exports.app.use('/admin/trainers', trainers_2.adminTrainersRouter);
exports.app.use('/admin/schedule', schedule_2.adminScheduleRouter);
exports.app.use('/admin/gallery', gallery_2.adminGalleryRouter);
exports.app.use('/admin/memberships', memberships_2.adminMembershipsRouter);
exports.app.use('/admin/enquiries', enquiries_2.adminEnquiriesRouter);
exports.app.use('/admin/subscriptions', subscriptions_1.adminSubscriptionsRouter);
// Error Handling (Must be last)
exports.app.use(errorHandler_1.errorHandler);
