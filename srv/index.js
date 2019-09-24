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
  const io = socketIO(http);
  io.on("connection", client => {
    console.log('New socket connection');
    client.on('puppetPlay', function() {
      io.emit('play');
      console.log('Play command sent');
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
