const paginate = (query, urlQuery, docs) => {
  const page = Number(urlQuery.page) || 1
  const limit = Number(urlQuery.limit) || 20
  const skip = (page - 1) * limit

  if (docs < skip) throw new Error(`Page ${page} does not exist`)

  return query
    .skip(skip)
    .limit(limit)
}

const filterQuery = (query, urlQuery) => {
  const excludedKeys = ['page', 'sort', 'limit', 'fields', 'filter']
  let filter = Object.fromEntries(
    Object.entries(urlQuery)
      .filter(([key]) => !excludedKeys.includes(key))
  )

  filter = JSON.parse(
    JSON.stringify(filter)
      .replace(/\b(gt|gte|lt|lte)\b/g, arg => `$${arg}`)
  )

  return query.find(filter)
}

module.exports = async (model, urlQuery, findBy = {}) => {
  const query = model.find(findBy)
  paginate(
    filterQuery(query, urlQuery)
      .sort(urlQuery.sort?.replaceAll(',', ' ') || '-createdAt')
      .select(urlQuery.fields?.replaceAll(',', ' ') || '-__v'),
    urlQuery,
    await model.countDocuments()
  )
  return query
}
