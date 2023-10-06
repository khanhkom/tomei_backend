const express = require('express');
const router = express.Router();

// Bring in Models & Utils
const Article = require('../../models/article');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');
const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/articles');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}--${file.originalname}`);
  }
});
const upload = multer({ storage });

router.post(
  '/add',
  auth,
  role.check(ROLES.Admin),
  upload.single('image'),
  async (req, res) => {
    try {
      const image = req.file;
      const title = req.body.title;
      const description = req.body.description;
      const img_url = image.path;
      const content = req.body.content;
      const seo_keyword = req.body.seo_keyword;
      const status = req.body.status;
      const sort_order = req.body.sort_order;
      const browse = req.body.browse;

      if (!description || !title || !content) {
        return res
          .status(400)
          .json({ error: 'You must provide all required fields.' });
      }

      const article = new Article({
        title,
        description,
        img_url,
        content,
        seo_keyword,
        status,
        sort_order,
        browse
      });

      const articleDoc = await article.save();

      res.status(200).json({
        success: true,
        message: `Article has been added successfully!`,
        article: articleDoc
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.get('/list', async (req, res) => {
  try {
    console.log('articles');
    const articles = await Article.find({});
    res.status(200).json({
      articles
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const articleId = req.params.id;

    const articleDoc = await Article.findOne({ _id: articleId }).populate(
      '_id'
    );

    if (!articleDoc) {
      return res.status(404).json({
        message: `Cannot find article with the id: ${articleId}.`
      });
    }

    res.status(200).json({
      article: articleDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.post(
  '/add',
  auth,
  role.check(ROLES.Admin),
  upload.single('image'),
  async (req, res) => {
    try {
      const image = req.file;
      const img_url = image.path;

      res.status(200).json({
        success: true,
        message: `Image has been added successfully!`,
        image: img_url
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.put('/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const articleId = req.params.id;
    const update = req.body.article;
    const query = { _id: articleId };
    const foundArticle = await Article.findOne({
      _id: articleId
    });

    if (foundArticle && foundArticle._id.toString() !== articleId) {
      return res
        .status(400)
        .json({ error: 'Title or SEO keyword is already in use.' });
    }

    await Article.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
      success: true,
      message: 'Article has been updated successfully!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});
router.put('/view/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    const query = { _id: articleId };
    const foundArticle = await Article.findOne({
      _id: articleId
    });
    const update = { browse: foundArticle.browse + 1 }; // Update the title field
    await Article.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).json({
      success: true,
      message: 'Article has been updated successfully!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});
router.delete(
  '/delete/:id',
  auth,
  role.check(ROLES.Admin),
  async (req, res) => {
    try {
      const articleId = req.params.id;
      const article = await Article.deleteOne({ _id: articleId });

      res.status(200).json({
        success: true,
        message: `article has been deleted successfully!`,
        article
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

module.exports = router;
