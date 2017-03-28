import googleStorage from "@google-cloud/storage"

const googleStorageClient = googleStorage()

export default function correctContentTypeForImages (event: Object, callback: Function): any {
  const {data} = event
  const {resourceState} = data
  const isDelete = resourceState === "not_exists"

  if (isDelete) {
    return callback()
  }

  console.log(data)

  return callback()
}
