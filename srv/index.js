import express from 'express';
import createError from 'http-errors';
import path from 'path';
import routes from 'express-namespace-routes';
import socketIO from "socket.io";

export default (app, http) => {
  app.use(express.json());
  

  // Routes
  // https://github.com/WebStyle/express-namespace-routes
  routes.prefix('/api', (api) => {
    api.get('/', (req, res) => {
      res.json({ success: "Welcome to API v. 1.0" });
    });
  });

  app.use(routes);

  // Sockets
  let responses = []; // Initial empty quiz responses array to local state
  let quizActive = false;

  const io = socketIO(http);
  io.on("connection", client => {
    console.log('New socket connection');

    // Socket routes
    // The 'puppet' prefix is used to refer to events sent from the 'puppeteer' dashboard that are then relayed to clients
    client.on('puppetPlay', function(options = {}) {
      io.emit('play', options);
      console.log('Play command sent');
    });

    client.on('puppetKill', function(options = {}) {
      io.emit('kill', options);
      console.log('Kill command sent');
    });

    // Quizzes
    client.on('quizResponse', function(response) {
      // Collect all responses
      if (quizActive) {
        console.log('Quiz response received: ' + JSON.stringify(response));
        responses.push(response);
      } else {
        console.log('Unauthorized quiz response urgh');
      }
    });

    client.on('puppetQuiz', function(options = { duration: '30000' }) {
      console.log('Quiz started');
      responses = []; // Clear any remnants

      // Listen for survey responses
      quizActive = true;
      io.emit('quizAsk', options); // Ask clients to respond

      setTimeout(() => {
        // Once quiz finished, notify clients of results
        const responseValues = responses.map(response => response.value);
        io.emit('quizCompletion', {
          quiz: options,
          responses: responseValues
        });
        console.log('Quiz ended and results sent: ' + JSON.stringify(responseValues));
        responses = []; // Get out of quiz mode
        quizActive = false;
      }, options.duration)
    });
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({err: err})
  });
}
