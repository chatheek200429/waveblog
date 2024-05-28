const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  image: String,
  header: String,
  subHeading: String,
  date: String,
  time: String,
  author: String,
  content: String
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
