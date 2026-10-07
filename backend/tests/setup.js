"use strict";

var _vitest = require("vitest");
var _vitestMockExtended = require("vitest-mock-extended");
var _client = require("@prisma/client");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Mock the prisma instance
_vitest.vi.mock('../src/lib/prisma', () => ({
  prisma: (0, _vitestMockExtended.mockDeep)()
}));
(0, _vitest.beforeEach)(() => {
  // @ts-ignore
  Promise.resolve().then(() => _interopRequireWildcard(require('../src/lib/prisma'))).then(({
    prisma
  }) => {
    (0, _vitestMockExtended.mockReset)(prisma);
  });
});