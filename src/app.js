const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
//
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc'); // npm i swagger-jsdoc@6.1.0 for common js imports to work
//
const { requireAuth, checkUser } = require('./middleware/auth');
//
const authRoutes = require('./routes/authRoutes');
const comicsRoutes = require('./routes/comicsRouts');
const characterRoutes = require('./routes/characterRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const publisherRoutes = require('./routes/publisherRoutes');

const app = express();
// to enable CORS for all origins
app.use(cors());
app.use(express.json({ extended: true }));
app.use(cookieParser());
// to allow brosers to request data from this folder
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(morgan('dev'));

// swagger configuration // start
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Comics API',
      version: '1.0.0',
      description: 'A simple Express Comics API',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  // path must be from the root of an application
  apis: ['src/routes/*.js'],
};

const specs = swaggerJsDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// swagger configuration // end

app.get('/set-cookie', (req, res) => {
  res.cookie('jwt', 'lalala');

  res.send('You got a cookie');
});

app.use('/auth', authRoutes);
app.use('/comics', comicsRoutes);
app.use('/character', characterRoutes);
app.use('/publisher', publisherRoutes);
// app.use('/review', reviewRoutes);
// app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// blobal error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ message: error.message });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT);
  } catch (e) {
    console.log('Server Error: ', e.message);
    process.exit(1);
  }
}

start();
