const express = require('express');
const app = express();
const cors = require("cors"); 
const path = require("path");
const flash = require("express-flash"); 
const superadmin = require('./routes/superadmin');
const orgadmin = require('./routes/orgadmin');
const users = require('./routes/regularusers');

//middleware

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/v1/superadmin', superadmin);
app.use('/api/v1/orgadmin', orgadmin);
app.use('/api/v1/users', users);

app.use(express.static(path.join(__dirname, 'frontend/build')));

if(process.env.NODE_ENV === 'production') {
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
  })
}

app.use(flash());


//error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500500).json({
        message:err.message,
        error:req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;