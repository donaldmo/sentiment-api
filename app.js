const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const https = require('https')
const cron = require('node-cron')
const axios = require('axios')
const Sentiment = require('./models/sentiment.model')

require('dotenv').config();

const { verifyAccessToken } = require('./helpers/jwt_helper');
const SentimentRouter = require('./routes/sentiment.route');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(cookieParser());

app.use(express.static('public'));
app.use('/uploads', express.static('public'));
app.use('/images', express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
})

// 3nh2V9ZFkXS1P2vU
// new-user_31

/// mongodb+srv://new-user_31:3nh2V9ZFkXS1P2vU@cluster0.yjoup.gcp.mongodb.net/sentiment_db

const uri = `mongodb+srv://new-user_31:3nh2V9ZFkXS1P2vU@cluster0.yjoup.gcp.mongodb.net/sentiment_db`;

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}

mongoose.connect(uri, connectionParams).then(() => {
  console.log('Connected to database on production...ls')
})
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  })

const mongoDBStore = new MongoDBStore({
  uri: uri,
  collection: 'session',
  ttl: parseInt(process.env.SESSION_LIFETIME) / 1000
})

// app.use(session({
//   name: process.env.SESSION_NAME,
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: mongoDBStore,

//   cookie: {
//     maxAge: parseInt(process.env.SESSION_LIFETIME),
//     sameSite: false, // this may need to be false is you are accessing from another React app
//     httpOnly: false, // this must be false if you want to access the cookie
//     secure: process.env.NODE_ENV === "production"
//   }
// }));

// cron job 
cron.schedule('*/1 * * * *', async () => {
  console.log('running a task every 1m')
  let session = ''

  // Make an HTTP GET request using axios
  const resp = await axios({
    method: "GET",
    url: `https://www.myfxbook.com/api/login.json?email=domotswiri@gmail.com&password=donald120`,
  });

  // Retrieve just the data from the response
  const login = resp.data
  if (!login.error) session = login.session
  console.log('session: ', session)

  let response = await axios({
    method: 'GET',
    url: `https://www.myfxbook.com/api/get-community-outlook.json?session=${session}`
  })

  let { data, general } = response

  const sentiment = new Sentiment({ 
    symbols: data.symbols,
    general: data.general 
  });

  const saveSentiment = await sentiment.save()
  console.log('saveSentiment: ', saveSentiment)

});

app.get('/', async (req, res, next) => {
  console.log(req.payload);
  res.send('Hello from Sentiment');
});

app.use('/sentiment', SentimentRouter);

app.use(async (req, res, next) => {
  // const error = new Error('Not found');
  // error.status = 404;
  // next(error);

  const error = createError.NotFound('404 page not found zzz')
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log('server listenting on port: ', PORT)
});