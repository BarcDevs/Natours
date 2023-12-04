// eslint-disable-next-line global-require
if (!process.env.MONGODB_CONNECTION_URI) require('dotenv').config({ path: `${__dirname}/../.env` })

const db = require("../db")
const { getToursFromFs } = require('./fs')
const Tour = require('../db/tourModel')

const deleteAllData = async () => {
  try {
    await Tour.deleteMany()
    console.log('data deleted successfully')
  } catch (e) {
    console.error(e)
  }
}

const importData = async () => {
  const data = await getToursFromFs()

  try {
    await Tour.create(data)
    console.log('data imported successfully')
  } catch (e) {
    console.error(e)
  }
}
const script = async () => {
  const arg = process.argv[2]

  if (arg === '--delete') {
    await deleteAllData()
    process.exit()
  }
  if (arg === '--import') {
    await importData()
    process.exit()
  }
}

script()
