const data = require('./sentiment.json')

let array2 = [
  'EURUSD',
  'GBPUSD',
  'USDJPY',
  'GBPJPY',
  'USDCAD',
  'EURAUD',
  'EURJPY',
  'AUDCAD',
  'AUDJPY',
  'AUDNZD',
  'AUDUSD',
  'CADJPY',
  'EURCAD',
  'EURCHF',
  'EURGBP',
  'EURNZD',
  'GBPCAD',
  'GBPCHF',
  'NZDJPY',
  'NZDUSD',
  'USDCHF',
  'USDZAR',
  'GBPNZD',
  'GBPAUD',
  'CHFJPY',
  'XAUUSD',
  'MXNUSD',
]

let filteredArray1 = data.symbols.filter(el => array2.includes(el.name))
console.log(filteredArray1)