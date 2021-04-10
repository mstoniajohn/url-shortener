const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth');

const User = require('../models/User');

router.get('/', async (req, res) => {
	const articles = await Article.find().sort({ date: 'desc' });

	res.render('articles/index', { title: 'Hi', articles: articles });
});
// @route         POST  api/posts
// @description:  Create a post
// @access        new
router.get('/new', (req, res) => {
	res.render('articles/new', { article: new Article() });
});

router.get('/edit/:id', async (req, res) => {
	const article = await Article.findById(req.params.id);
	res.render('articles/edit', { article: article });
});

router.get('/:id', async (req, res) => {
	const article = await Article.findById(req.params.id);
	if (article == null) {
		res.redirect('/');
	}
	res.render('articles/show', { article: article });
});

// router.post('/', async (req, res) => {
// 	// res.send('hi articles');
// 	// const user = await User.findById(req.user.id).select('-password');
// 	try {
// 		let article = new Article({
// 			title: req.body.title,
// 			// name: user.name,
// 			description: req.body.description,
// 			markdown: req.body.markdown,
// 			// avatar: user.avatar,
// 			// user: req.user.id,
// 		});

// 		article = await article.save();
// 		res.redirect(`/articles/${article.id}`);
// 	} catch (error) {
// 		res.render(`articles/new`, { article: article });
// 	}

// });
router.post(
	'/',
	async (req, res, next) => {
		req.article = new Article();
		next();
	},
	saveArticleAndRedirect('new')
);

router.put(
	'/:id',
	async (req, res, next) => {
		req.article = await Article.findById(req.params.id);
		next();
	},
	saveArticleAndRedirect('edit')
);

// router.put('/:id', async (req, res) => {
// 	let article = new Article({
// 		title: req.body.title,
// 		description: req.body.description,
// 		markdown: req.body.markdown,
// 	});
// 	try {
// 		article = await article.save();
// 		res.redirect(`/articles/${article.id}`);
// 	} catch (error) {
// 		res.render('articles/edit', { article: article });
// 	}
// 	console.log(req.body);
// });
router.delete('/:id', async (req, res) => {
	await Article.findByIdAndDelete(req.params.id);
	res.redirect('/');
});

function saveArticleAndRedirect(path) {
	return async (req, res) => {
		let article = req.article;
		article.title = req.body.title;
		article.description = req.body.description;
		article.markdown = req.body.markdown;
		try {
			article = await article.save();
			res.redirect(`/articles/${article.id}`);
		} catch (e) {
			res.render(`articles/${path}`, { article: article });
		}
	};
}
module.exports = router;
