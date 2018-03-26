const { graphql } = require('graphql')
const schema = require('./schema')
const resolvers = require('./resolvers')
const operations = require('./operations')

module.exports = (req, res) => {
  if (!req.query.q) {
    return res.render('search', Object.assign({}, req.context, {
      searchIn: req.params.searchIn,
      query: null
    }))
  }

  let searchOps = []
  if (!req.params.searchIn) {
    searchOps = operations
  } else {
    const searchOp = operations.find((op) => op.name === req.params.searchIn)
    if (!searchOp) {
      return res.status(404).render('404', req.context)
    }
    searchOps = [searchOp]
  }
  Promise.all(searchOps.map(async (searchOp) => {
    const results = await graphql(
      schema,
      searchOp.query,
      resolvers,
      null,
      { filter: req.query.q }
    )
    if (results.errors || !results.data[searchOp.name]) {
      return { searchOp, resultsNum: 0, results: null }
    }
    return {
      searchOp,
      // FIXME: use real pagination
      resultsNum: results.data[searchOp.name].length,
      results: (req.params.searchIn || req.query.json !== undefined)
        ? results.data[searchOp.name] : results.data[searchOp.name].slice(0, 5)
    }
  })).then((searchResults) => {
    if (req.query.json !== undefined) {
      return res.json(searchResults)
    }
    const context = Object.assign({}, req.context, {
      searchIn: req.params.searchIn,
      query: req.query,
      searchResults: searchResults
    })
    res.render('search', context)
  }).catch((reasons) => {
    console.error(reasons)
  })
}
