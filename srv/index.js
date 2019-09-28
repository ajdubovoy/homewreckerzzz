import express from 'express';
import createError from 'http-errors';
import path from 'path';
import routes from 'express-namespace-routes';
import socketIO from "socket.io";
import multer from 'multer';

export default (app, http) => {
  app.use(express.json());
  let fileCount = 0;

  // File Upload
  const storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, 'public/uploads');
    },
    filename: function(req, file, callback) {
      callback(null, fileCount + ".mp3");
      fileCount++;
    }
  });

  const upload = multer({storage: storage});

  // Routes
  // https://github.com/WebStyle/express-namespace-routes
  routes.prefix('/api', (api) => {
    api.get('/', (req, res) => {
      res.json({ success: "Welcome to API v. 1.0" });
    });

    api.post('/file-upload', upload.single('userFile'), function(req, res) {
      console.log('File uploaded');
      var path = req.file.path.slice(6);
      console.log(path);
      app.io.emit('load', {file: path});
      res.sendStatus(200);
    })
  });

  app.use(routes);

  // Sockets
  let responses = []; // Initial empty quiz responses array to local state
  let currentQuiz = null;

  const io = socketIO(http);
  app.io = io;
  io.on("connection", client => {
    console.log('New socket connection');

    // Socket routes
    // The 'puppet' prefix is used to refer to events sent from the 'puppeteer' dashboard that are then relayed to clients
    // The 'client' prefix goes the other way around
    client.on('puppetPlay', function(options = {}) {
      io.emit('play', options);
      console.log('Play command sent');
    });

    client.on('clientPlay', function(payload = {}) {
      // Mainly for visualization
      io.emit('clientWasPlayed', payload);
      console.log('Client was played');
    });

    client.on('puppetUpdate', function(options = {}) {
      io.emit('update', options);
      console.log('Update command sent');
    });

    client.on('clientUpdate', function(payload = {}) {
      // Mainly for visualization
      io.emit('clientWasUpdated', payload);
      console.log('Client was updated');
    });

    client.on('puppetKill', function(options = {}) {
      io.emit('kill', options);
      console.log('Kill command sent');
    });

    client.on('clientKill', function(payload = {}) {
      // Mainly for visualization
      io.emit('clientWasKilled', payload);
      console.log('Client was killed');
    });

    client.on('puppetDeepFry', function(options = {}) {
      io.emit('deepFry', options);
      console.log('Deep fry command sent');
    });

    client.on('puppetUnDeepFry', function(options = {}) {
      io.emit('unDeepFry', options);
      console.log('Undo deep fry command sent');
    });

    // Quizzes
    client.on('quizResponse', function(response) {
      // Collect all responses
      if (currentQuiz) {
        console.log('Quiz response received: ' + JSON.stringify(response));
        responses.push(response);
        io.emit('quizTally', {
          quiz: currentQuiz,
          responses,
          response
        })
      } else {
        console.log('Unauthorized quiz response urgh');
      }
    });

    client.on('puppetQuiz', function(options = { duration: '30000' }) {
      console.log('Quiz started');
      responses = []; // Clear any remnants

      // Listen for survey responses
      currentQuiz = options;
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
        currentQuiz = null;
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
