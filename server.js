const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
// const ShortUrl = require('./models/shortUrl');
const methodOverride = require('method-override');
// const ignoreFavicon = require('./middleware/ignoreFavicon');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5001;
const app = express();

const Article = require('./models/Article.js');
const articleRouter = require('./routes/articles.js');
const urlRouter = require('./routes/urls.js');

const connectDB = require('./config/db');

// const favicon = require('serve-favicon');

// mongodb+srv://admin:${process.env.DB_CONNECTION}@cluster0.oys2g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// mongoose.connect(`${process.env.DATABASE}`, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// 	useCreateIndex: true,
// });

connectDB();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.json({ extended: false }));

app.use(express.static('public'));
// app.use(ignoreFavicon);

// app.use(express.static(path.join(__dirname, 'static')));
// middleware

app.get('/', async (req, res) => {
	const articles = await Article.find().sort({ date: 'desc' });

	res.render('articles/index', { title: 'Hi', articles: articles });
});
app.use('/articles', articleRouter);
app.use('/shortUrls', urlRouter);
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/user'));

// app.get('/shortUrls', async (req, res) => {
// 	const urls = await ShortUrl.find();
// 	res.render('urls', { urls: urls });
// });

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
