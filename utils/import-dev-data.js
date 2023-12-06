if (!process.env.MONGODB_CONNECTION_URI) {
// eslint-disable-next-line global-require
  require('dotenv')
    .config({ path: `${__dirname}/../.env` })
}

const db = require('../db')
const { getDataFromFs } = require('./fs')
const Tour = require('../db/tourModel')
const User = require('../db/userModel')
const Review = require('../db/reviewModel')

const deleteAllData = async () => {
  try {
    await Tour.deleteMany()
    await User.deleteMany({email: /^(?!bar)/})
    await Review.deleteMany()
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
  const users = await getDataFromFs('users.json')
  const reviews = await getDataFromFs('reviews.json')
  let tours = await getDataFromFs('tours.json')

  if (Object.keys(tours[0])
    .includes('startLocation')) {
    tours = moveStartLocationToLocations(tours)
  }

  try {
    await User.create(users, {runValidators: false, validateBeforeSave: false})
    await Tour.create(tours)
    await Review.create(reviews)
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
