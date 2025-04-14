console.info("Starting server...")

// Imports
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const createError = require('http-errors');
const path = require('path');
const ejs = require('ejs');

// Server configuration
const app = express();
const port = process.env.PORT || 3001;

// Security middleware configuration
app.use(helmet({contentSecurityPolicy: false}));
app.disable('x-powered-by');

// Logger middleware configuration
app.use(logger('dev'));

// Body parser middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine configuration
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// Routes
// GET
app.use('/', require('./routes/index'));
// POST
app.post('/api/v1/:option', require('./routes/api'));
// Public 
app.use(express.static(path.join(__dirname, 'public')));

// 404 error forwarding to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {status: err.status || 500};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });



process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Start the server
app.listen(port, () => {
    console.info(`Server running at http://localhost:${port}/`);
});

module.exports = app;