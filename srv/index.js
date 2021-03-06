import express from 'express';
import createError from 'http-errors';
import path from 'path';
import routes from 'express-namespace-routes';
import multer from 'multer';
import cors from 'cors';
import { isEmpty, get } from 'lodash';
const fs = require('fs');

export default (app, http) => {
  app.use(express.json());
  app.use(cors());

  let fileCount = 0;

  // File Upload
  const storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, './public/uploads');
    },
    filename: function(req, file, callback) {
      callback(null, fileCount + ".mp3");
      fileCount++;
    }
  });

  const upload = multer({storage: storage}).single("userFile");

  // Initialization
  let sockets = [];
  const clients = [];
  let responses = []; // Initial empty quiz responses array to local state
  let currentQuizzes = [];

  //explicitly serve file using endpoint
  app.get('/uploads/:file', (req,res) => {
    res.sendFile(path.join(__dirname, path.join("../public/uploads/", req.params.file)), {}, (err) => {
      if(err) {
        console.log(err.message)
      } else {
        console.log('Sent!')
      }
    });
  })

  // Routes
  // https://github.com/WebStyle/express-namespace-routes
  routes.prefix('/api', (api) => {
    api.get('/', (req, res) => {
      res.json({ success: "Welcome to API v. 1.0" });
    });

    api.get('/sockets', (req, res) => {
      res.json({
        sockets
      });

      try{
        const token = req.query.token;
        const client = clients.find(c => c.token === token);
        if (client) {
          client.time = new Date();
          client.connected = true;
          client.sockets = sockets.filter((socket) => {
            const audience = socket.request.audience;
            const isRoomSection = audience.roomSection ? audience.roomSection == client.roomSection : true;
            const isRandomQuestion = audience.randomQuestion ? audience.randomQuestion == client.randomQuestion : true;
            const isTeam = audience.team ? audience.team == client.team : true;
            return isRoomSection && isRandomQuestion && isTeam;
          });
        }
      } catch(err) {
        console.log(err);
      }
    });

    api.post('/sockets', (req, res) => {
      const socket = req.body;

      const token = Math.random().toString(36).substr(2, 9); // Generate random key
      const time = new Date();
      const requestSocket = { ...socket, token, time };
      if (socket.message === 'quizAsk') {
        requestSocket.request.time = time;
        requestSocket.request.token = token;
      }
      sockets.push({ ...socket, token, time });
      res.json(requestSocket);
      console.log(`New ${socket.message} socket created`);
      console.log(requestSocket);

      const isAudience = (s, socket) => {
        const audience = s.request.audience;
        const isRoomSection = audience.roomSection ? audience.roomSection == socket.request.audience.roomSection : true;
        const isRandomQuestion = audience.randomQuestion ? audience.randomQuestion == socket.request.audience.randomQuestion : true;
        const isTeam = audience.team ? audience.team == socket.request.audience.team : true;
        return isRoomSection && isRandomQuestion && isTeam;
      }

      // Handle specific cases

      try{
        if (socket.message === 'kill') {
          console.log("Clearing old play, update, and kill sockets...");
          sockets = sockets.filter((s) => {
            const isTypeToRemove = s.message === 'play' || s.message === 'update' || s.message === 'kill';
            return !isAudience(s, socket) || !isTypeToRemove || s.token === token;
          });
        }
      } catch(err) {
        console.log(err);
      }

      try{
        if (socket.message === 'unDeepFry') {
          console.log("Clearing old deepFry and unDeepFry sockets");
          sockets = sockets.filter((s) => {
            const isTypeToRemove = s.message === 'deepFry' || s.message === 'unDeepFry';
            return isAudience(s, socket) || !isTypeToRemove || s.token === token;
          });
        }
      } catch(err) {
        console.log(err);
      }

      if (socket.message === 'quizAsk') {
        console.log('Quiz started (quizAsk)');
        console.log(`Time remaining: ${socket.request.duration}`);

        // Listen for survey responses
        currentQuizzes = [...currentQuizzes, socket.request]

        setTimeout(() => {
          // Once quiz finished, notify clients of results
          console.log("Clearing old quizAsk and quizComplete sockets...");
          try {
            sockets = sockets.filter((s) => {
              const isTypeToRemove = s.message === 'quizAsk' || s.message === 'quizComplete';
              return !isAudience(s, socket) || !isTypeToRemove;
            });
          } catch(err) {
            console.log(err);
          }

          const relevantResponses = responses.filter(response => response.token === socket.request.token)
          const responseValues = relevantResponses.map(response => response.value);
          const completionToken = Math.random().toString(36).substr(2, 9); // Generate random key
          const completionSocket = { ...socket, token: completionToken, time: new Date(), message: "quizComplete", responses: relevantResponses, responseValues };
          sockets.push(completionSocket);
          console.log('Quiz ended and results sent (QuizComplete): ' + JSON.stringify(responseValues));
          console.log(completionSocket);
          responses = responses.filter(response => response.token !== socket.request.token) // Get out of quiz mode
          currentQuizzes = currentQuizzes.filter(q => q.token !== socket.request.token);
        }, socket.request.duration);
      }
    });

    api.get('/quiz-responses', (req, res) => {
      const currentResponses = currentQuizzes.map(currentQuiz => {
        const relatedResponses = responses.filter(response => response.token === currentQuiz.token);
        const { id, audience, token } = currentQuiz;
        return {
          running: true,
          responses: relatedResponses.map(response => response.value),
          quizID: id,
          audience,
          token
        };
      });

      const quizCompleteSockets = sockets.filter(socket => socket.message === "quizComplete");
      const pastResponses = quizCompleteSockets.map(socket => {
        const { id, token, audience } = socket.request;
        return {
          running: false,
          responses: socket.responses.map(response => response.value),
          quizID: id,
          token,
          audience
        }
      });
      res.json({  quizResponses: [...currentResponses, ...pastResponses]  });
    });

    api.post('/quiz-responses', (req, res) => {
      // Collect all responses
      if (!isEmpty(currentQuizzes)) {
        console.log('Quiz response received: ' + JSON.stringify(req.body));
        const time = new Date();
        const { value, quizID, clientID, token } = req.body;
        const socket = {
          message: 'quizResponse',
          quiz: req.body.quiz,
          response: req.body,
          token,
          time,
          responses
        }
        responses = [...responses, { quizID: quizID, token, value, clientID }]
        res.json({ socket });
      } else {
        console.log('Unauthorized quiz response urgh');
        res.status(401);
      }
    });

    api.post('/clients', (req, res) => {
      const client = req.body;
      console.log('New client request:');
      const time = new Date();
      if (!clients.find(c => c.token === client.token)) {
        console.log(client);
        clients.push({ ...client, time, connected: true, sockets: [] });
        console.log(`New ${client.token} client created`);
        res.json({ client, time, connected: true });
      } else {
        console.log(`Client ${client.token} was reconnected`);
        res.json({ message: "Client already exists...Reconnected!" });
      }
    });

    api.get('/clients', (req, res) => {
      res.json(clients);
    })

    api.post('/file-upload', function(req, res) {
      upload(req, res, (err) => {
        if(err) {
            return res.status(400).json({
                errors: [err.message]
            })
        } else {
          console.log(req.file.path + " uploaded");
          res.status(200).json({file: req.file.path});
        }
      })
    })

    api.get('/files', (req, res) => {
      let arr = [];
      fs.readdirSync("./public/uploads").forEach(file => {
        arr.push(file);
      });
      res.status(200).json({files: arr});
    })
  });

  app.use(routes);

  setInterval(() => {
    const currentTime = new Date();
    const checkTime = new Date(currentTime - 10000);

    clients.forEach((client) => {
      if (client.time < checkTime && client.connected) {
        client.connected = false;
        console.log(`Client ${client.token} was disconnected`);
      }
    });
  }, 10000);

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
