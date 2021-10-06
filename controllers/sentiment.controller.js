const createError = require('http-errors')
const Sentiment = require('../models/sentiment.model')
const moment = require('moment')

exports.getSentiment = async (req, res, next) => {
  try {
    // console.log('query: ', req.query);
    let { page, size } = req.query
    if (!page || page === '' || page === undefined) page = 1
    if (!size || size === '' || size === undefined) size = 3

    const limit = parseInt(size);
    const skip = (parseInt(page) - 1) * parseInt(size)
    // console.log('limit: ', limit, 'skip: ', skip)

    const sentiment = await Sentiment.find()
      // .limit(limit).skip(skip)

    //.limit(limit).skip(skip)
    console.log(sentiment)

    if (!sentiment) throw createError.NotFound()
    // console.log('sentiment: ', sentiment);
    // sentiment.map(item => console.log('id: ',item._id, 'usage: ', item.usage))

    res.send(sentiment)
  }
  catch (error) {
    // console.log(error)
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}