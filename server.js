const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.disable('x-powered-by');
app.use(helmet());

const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : false,
  })
);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb', parameterLimit: 100 }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
});
app.use('/api', apiLimiter);

app.use(routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
});

let server;

const start = async () => {
  await sequelize.sync({ force: false });
  server = app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
};

const shutdown = async (signal) => {
  console.log(`\n${signal} received, shutting down...`);
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await sequelize.close();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch((err) => {
  console.error('Startup failed:', err);
  process.exit(1);
});
