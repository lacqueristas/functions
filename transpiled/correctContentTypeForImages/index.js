"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = correctContentTypeForImages;

var _storage = require("@google-cloud/storage");

var _storage2 = _interopRequireDefault(_storage);

var _gm = require("gm");

var _gm2 = _interopRequireDefault(_gm);

var _ramda = require("ramda");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var googleStorageClient = (0, _storage2.default)();
var imageMagick = _gm2.default.subClass({ imageMagick: true });

var isDelete = (0, _ramda.propEq)("resourceState", "not_exists");
var isOctetStream = (0, _ramda.propEq)("contentType", "application/octet-stream");

function correctContentTypeForImages(event, callback) {
  var data = event.data;
  var name = data.name;
  var bucket = data.bucket;


  if (isDelete(data)) {
    return callback();
  }

  if (isOctetStream(data)) {
    var from = googleStorageClient.bucket(bucket).file(name).createReadStream();

    return imageMagick(from).identify({ bufferStream: true }, function format(error, information) {
      if (error) {
        return callback();
      }

      console.log({ information: information });

      return callback();
    });
  }

  return callback();
}