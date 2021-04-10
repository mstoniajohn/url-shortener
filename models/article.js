const mongoose = require('mongoose');

const marked = require('marked');
const slugify = require('slugify');

const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const ArticleSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	title: {
		type: String,
		required: true,
	},
	name: {
		type: String,
	},
	avatar: {
		type: String,
	},
	description: {
		type: String,
	},
	markdown: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	slug: {
		type: String,
		// required: true,
		unique: true,
	},
	sanitizedHtml: {
		type: String,
		required: true,
	},
});

ArticleSchema.pre('validate', function (next) {
	if (this.title) {
		this.slug = slugify(this.title, { lower: true, strict: true });
	}

	if (this.markdown) {
		this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
	}

	next();
});
module.exports = Article = mongoose.model('article', ArticleSchema);
