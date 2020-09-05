import fs from 'fs'

/**
 * Write some data into file.
 *
 * @param {any} data
 * @param {string} path
 */
export default function storeData (data, path) {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error(err)
  }
}
