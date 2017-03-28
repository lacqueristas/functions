import googleStorage from "@google-cloud/storage"
import magick from "gm"
import {propEq} from "ramda"

const googleStorageClient = googleStorage()
const imageMagick = magick.subClass({imageMagick: true})

const isDelete = propEq("resourceState", "not_exists")
const isOctetStream = propEq("contentType", "application/octet-stream")

export default function correctContentTypeForImages (event: Object, callback: Function): any {
  const {data} = event
  const {name} = data
  const {bucket} = data

  if (isDelete(data)) {
    return callback({
      type: "error",
      message: "is delete",
    })
  }

  if (!isOctetStream(data)) {
    return callback({
      type: "error",
      message: "not application/octet-stream",
    })
  }

  const from = googleStorageClient
    .bucket(bucket)
    .file(name)

  return imageMagick(from.createReadStream())
    .identify(function format (error: any, information: Object): any {
      if (error) {
        return callback({
          type: "error",
          message: error,
        })
      }

      const contentType = information["Mime type"]

      return from.setMetadata({contentType}, callback)
    })
}
