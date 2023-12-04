const { mongoose } = require('mongoose')

mongoose.connect(process.env.MONGODB_CONNECTION_URI, {
  dbName: 'natours'
})
  .then(() => {
    console.log('mongoDB connected')
  })

module.exports = mongoose
