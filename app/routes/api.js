import express from 'express';

const apiRouter = express.Router();

// Testing route
apiRouter.get('/hello', function(request, response) {
  response.send('Hello, My name is API');
})

//// API Backend
// Get parameter from form action and then generate random string
// store original url and random string in database and response shorten link to client
apiRouter.post('/create', (request, response) => {
  const data = {
    outputUrl: request.body.inputUrl,
    message: "OK"
  }
  response.json(data);
});

module.exports = apiRouter;
