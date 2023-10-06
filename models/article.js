const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Define the Article model

// Initialize the Article model
const Article = new Schema({
  title: {
    type: String,
    allowNull: false,
    comment: 'Title of the article'
  },
  description: {
    type: String,
    allowNull: false,
    comment: 'Description of the article'
  },
  img_url: {
    type: String,
    allowNull: false,
    comment: 'Cover image URL of the article'
  },
  content: {
    type: Schema.Types.String,
    allowNull: false,
    comment: 'Content of the article'
  },
  seo_keyword: {
    type: String,
    allowNull: false,
    comment: 'SEO keywords of the article'
  },
  status: {
    type: Schema.Types.Number,
    allowNull: true,
    default: 1,
    comment: 'Display status of the article: 0 - hidden, 1 - normal'
  },
  sort_order: {
    type: Schema.Types.Number,
    allowNull: true,
    default: 1,
    comment: 'Sort order number'
  },
  browse: {
    type: Schema.Types.Number,
    allowNull: true,
    default: 0,
    comment: 'Number of times the article has been browsed'
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Article', Article);
