const Blog = require("../models/blog_model");
const upload = require("../uploads");
const path = require("path");
const logAction = require("../controllers/auditLogs_controller");
// *******************
// Get all blogs
// *******************

exports.getAllBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;
  try {
    const blogs = await Blog.find().skip(skip).limit(limit);
    const totalBlogs = await Blog.countDocuments();
    res.json({ blogs, totalBlogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ***************************
// Get a single blog post by ID
// ****************************

exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// *******************
// Create New Blog
// *******************

exports.createBlog = async (req, res) => {
  const { title, content, short_desc } = req.body;
  if (req.file) {
    imageUrl = `${process.env.SERVER_URL}/Images/${path.basename(
      req.file.path
    )}`;
  } else {
    imageUrl = null; // Handle cases where no file is uploaded
  }
  const newBlog = new Blog({
    title,
    content,
    short_desc,
    image: imageUrl,
  });
  try {
    const savedBlog = await newBlog.save();

    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// *******************
// Update Blog
// *******************

exports.updatedBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const newImage = req.file;

    // Find the blog post
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Handle image update
    if (newImage) {
      const imageUrl = `${process.env.SERVER_URL}/Images/${path.basename(
        newImage.filename
      )}`;
      // Update with new image filename
      blog.image = imageUrl;
    }

    // Update the blog post with the new data
    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.short_desc = req.body.short_desc || blog.short_desc;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// *******************
// Delete Blog
// *******************

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
