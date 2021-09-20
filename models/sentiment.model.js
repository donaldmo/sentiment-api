const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  symbols: [],
  general: []
},
  { timestamps: true }
)

const Sentiment = mongoose.model('Sentiment', schema)
module.exports = Sentiment