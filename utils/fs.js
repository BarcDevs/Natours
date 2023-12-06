const fs = require('fs')

const getDataFromFs = path => JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/${path}`, 'utf-8'))

const tours = getDataFromFs('tours.json')

exports.getDataFromFs = getDataFromFs

exports.tours = tours

exports.findTour = async (id) => new Promise((resolve) => {
  const res = tours.find((tour) => tour.id === id)
  resolve(res)
})

exports.updateToursInFs = (data) => {
  let returnValue
  // eslint-disable-next-line no-return-assign
  fs.writeFile(`${__dirname}/../dev-data/data/tours.json`, JSON.stringify(data), (err) => returnValue = err || null)
  return returnValue
}
