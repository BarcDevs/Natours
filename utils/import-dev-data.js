if (!process.env.MONGODB_CONNECTION_URI) {
// eslint-disable-next-line global-require
  require('dotenv')
    .config({ path: `${__dirname}/../.env` })
}

const db = require('../db')
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

const moveStartLocationToLocations = data => data.map(tour => {
  const { startLocation } = tour
  startLocation.day = 0
  tour.locations.push(startLocation)
  tour.startLocation = undefined
  return tour
})

const importData = async () => {
  let data = await getToursFromFs()
  if (Object.keys(data[0])
    .includes('startLocation')) {
    data = moveStartLocationToLocations(data)
  }

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
