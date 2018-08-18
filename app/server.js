import path from 'path';
import express from 'express';
import expressVue from 'express-vue';
import subdomain from 'express-subdomain';
import mainRouter from './routes/main';
import apiRouter from './routes/api';
import config from './config';

// Start the engine
const app = express();

// Use express-vue to render vue template and components
const vueOptions = {
  rootPath: path.join(__dirname, 'views')
}

const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);

// Setup mongoose connection

// Routing
app.use('/', mainRouter);
app.use(subdomain('api', apiRouter));

// Listening
app.listen(config.port, ()=> {
  console.log('App start listening on port ' + config.port)
});

module.exports = app;
