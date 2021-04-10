const express = require('express');
const router = express.Router();
const ShortUrl = require('../models/shortUrl');

// @route     GET /api/url/
// @desc      View all short URLs
router.get('/', async (req, res) => {
	const urls = await ShortUrl.find().sort({ createdAt: 'desc' });
	res.render('shortUrls/index', { urls: urls });
});

// @route     POST /api/url/shorten
// @desc      Create short URL
router.post('/', async (req, res) => {
	await ShortUrl.create({ full: req.body.fullUrl });
	// await url.save()
	res.redirect('/shortUrls');
});

// @route     GET /:code
// @desc      Redirect to long/original URL
router.get('/:shortUrl', async (req, res) => {
	try {
		const url = await ShortUrl.findOne({ short: req.params.shortUrl });
		if (!url) return res.status(404).json('No url found');
		url.clicks++;
		url.save();
		console.log(url);
		return res.redirect(url.full);
	} catch (err) {
		console.error(err);
		res.status(500).json('Server error');
	}
});

// @route     DELETE /api/url/:id
// @desc      Create short URL
router.delete('/:id', async (req, res) => {
	await ShortUrl.findByIdAndDelete(req.params.id);
	res.redirect('/shortUrls');
});

// router.delete('/:id', async (res, req) => {
// 	await ShortUrl.findByIdAndDelete(req.params.id);
// 	res.redirect('/shortUrls');
// });
module.exports = router;
