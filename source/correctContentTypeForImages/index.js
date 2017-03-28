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
    return callback()
  }

  if (isOctetStream(data)) {
    const from = googleStorageClient
      .bucket(bucket)
      .file(name)
      .createReadStream()

    return imageMagick(from)
      .identify({bufferStream: true}, function format (error: any, information: Object): any {
        if (error) {
          return callback()
        }

        console.log({information})

        return callback()
      })
  }

  return callback()
}
