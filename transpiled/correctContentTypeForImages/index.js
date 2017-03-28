"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = correctContentTypeForImages;

var _storage = require("@google-cloud/storage");

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var googleStorageClient = (0, _storage2.default)();

function correctContentTypeForImages(event, callback) {
  var data = event.data;
  var name = event.name;
  var resourceState = data.resourceState;

  var isDelete = resourceState === "not_exists";

  if (isDelete) {
    return callback();
  }

  console.log(data);

  return callback();
}