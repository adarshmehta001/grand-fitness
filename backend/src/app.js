"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = void 0;
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _helmet = _interopRequireDefault(require("helmet"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _config = require("./config");
var _errorHandler = require("./middleware/errorHandler");
var _morgan = _interopRequireDefault(require("morgan"));
var _auth = require("./routes/auth");
var _me = require("./routes/me");
var _memberships = require("./routes/memberships");
var _programs = require("./routes/programs");
var _trainers = require("./routes/trainers");
var _schedule = require("./routes/schedule");
var _gallery = require("./routes/gallery");
var _enquiries = require("./routes/enquiries");
var _programs2 = require("./routes/admin/programs");
var _trainers2 = require("./routes/admin/trainers");
var _schedule2 = require("./routes/admin/schedule");
var _gallery2 = require("./routes/admin/gallery");
var _memberships2 = require("./routes/admin/memberships");
var _enquiries2 = require("./routes/admin/enquiries");
var _subscriptions = require("./routes/admin/subscriptions");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Route imports

const app = exports.app = (0, _express.default)();
app.use((0, _helmet.default)());
app.use((0, _morgan.default)('tiny'));
app.use((0, _cors.default)({
  origin: function(origin, callback) {
    const allowed = _config.config.ALLOWED_ORIGINS || [_config.config.FRONTEND_URL];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(_express.default.json());
app.use((0, _cookieParser.default)());
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok'
  });
});

// Auth & Self
app.use('/auth', _auth.authRouter);
app.use('/me', _me.meRouter);

// Public Content
app.use('/memberships', _memberships.membershipsRouter);
app.use('/programs', _programs.programsRouter);
app.use('/trainers', _trainers.trainersRouter);
app.use('/schedule', _schedule.scheduleRouter);
app.use('/gallery', _gallery.galleryRouter);
app.use('/enquiries', _enquiries.enquiriesRouter);

// Admin CMS
app.use('/admin/programs', _programs2.adminProgramsRouter);
app.use('/admin/trainers', _trainers2.adminTrainersRouter);
app.use('/admin/schedule', _schedule2.adminScheduleRouter);
app.use('/admin/gallery', _gallery2.adminGalleryRouter);
app.use('/admin/memberships', _memberships2.adminMembershipsRouter);
app.use('/admin/enquiries', _enquiries2.adminEnquiriesRouter);
app.use('/admin/subscriptions', _subscriptions.adminSubscriptionsRouter);

// Error Handling (Must be last)
app.use(_errorHandler.errorHandler);