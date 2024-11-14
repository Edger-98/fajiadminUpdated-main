const express = require("express");

const router = express.Router();
const upload = require("../uploads");
const blogController = require("../controllers/blog_controller");

router.route("/").get( blogController.getAllBlogs);

router.route("/:id").get( blogController.getSingleBlog);

router.route("/").post(upload.single('image', 10), blogController.createBlog);

router.route("/:id").put( upload.single('image',10), blogController.updatedBlog);

router.route("/:id").delete( blogController.deleteBlog);

module.exports = router;