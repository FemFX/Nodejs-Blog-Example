const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
//Routes
const indexRoutes = require('./routes');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

dotenv.config();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());

// setup passport
require('./config/passport')(app);

// custom middeware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.use('/', indexRoutes);
app.use('/post', postRoutes);
app.use('/post/:id/comments', commentRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
