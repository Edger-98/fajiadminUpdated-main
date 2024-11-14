const express = require("express");

const router = express.Router();
const Blog = require("../models/blog_model");
router.get('/', async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // @route POST /api/blogs
  // @desc Create a new blog
  router.post('/', async (req, res) => {
    const { title, content, imageUrl } = req.body;
  
    const newBlog = new Blog({
      title,
      content,
      imageUrl
    });
  
    try {
      const savedBlog = await newBlog.save();
      res.status(201).json(savedBlog);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // @route PUT /api/blogs/:id
  // @desc Update a blog
  router.put('/:id', async (req, res) => {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedBlog);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // @route DELETE /api/blogs/:id
  // @desc Delete a blog
  router.delete('/:id', async (req, res) => {
    try {
      await Blog.findByIdAndDelete(req.params.id);
      res.json({ message: 'Blog deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  module.exports = router;
