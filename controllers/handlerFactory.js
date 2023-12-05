const { catchAsync } = require('./errorController')
const {
  returnSuccess,
  returnNotFound
} = require('../utils/responses')
const queryBuilder = require('../db/query')

exports.getMany = (Model) => catchAsync(async (req, res, next) => {
  const query = queryBuilder(Model, req.query, req.body)
  const docs = await query

  returnSuccess(res, { docs }, 200, { results: docs.length })
})

exports.getById = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findById(req.params.id)

  if (!doc) {
    return returnNotFound(next, req.params.id)
  }

  returnSuccess(res, { doc })
})

exports.createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body)

  returnSuccess(res, { doc }, 201)
})

exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const newChanges = req.body
  const { id } = req.params

  const doc = await Model.findByIdAndUpdate(id, newChanges, {
    new: true,
    runValidators: true
  })

  if (!doc) {
    return returnNotFound(next, req.params.id)
  }

  returnSuccess(res, { tour: doc }, 202)
})

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id)

  if (!doc) {
    return returnNotFound(next, req.params.id)
  }

  returnSuccess(res, {}, 204)
})
