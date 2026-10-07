"use strict";

var _app = require("./app");
var _config = require("./config");
const PORT = _config.config.PORT || 3001;
_app.app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Environment: ${_config.config.NODE_ENV}`);
});