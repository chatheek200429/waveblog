const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const BlogPost = require('./models/blogPost');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', async (req, res) => {
  const posts = await BlogPost.find();
  res.render('blog', { posts });
});

app.get('/admin', async (req, res) => {
  const posts = await BlogPost.find();
  res.render('admin/index', { posts });
});

app.get('/admin/add', (req, res) => {
  res.render('admin/add');
});

app.get('/post/:id', async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('post', { post });
  });
  

app.post('/admin/add', upload.single('image'), async (req, res) => {
  const { header, subHeading, date, time, author, content } = req.body;
  const newPost = new BlogPost({
    image: '/public/uploads/' + req.file.filename,
    header,
    subHeading,
    date,
    time,
    author,
    content
  });
  await newPost.save();
  res.redirect('/admin');
});

app.get('/admin/edit/:id', async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  res.render('admin/edit', { post });
});

app.post('/admin/edit/:id', upload.single('image'), async (req, res) => {
  const { header, subHeading, date, time, author, content } = req.body;
  const updatedPost = {
    header,
    subHeading,
    date,
    time,
    author,
    content
  };
  if (req.file) {
    updatedPost.image = '/public/uploads/' + req.file.filename;
  }
  await BlogPost.findByIdAndUpdate(req.params.id, updatedPost);
  res.redirect('/admin');
});

app.post('/admin/delete/:id', async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
