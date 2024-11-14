import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import Image from "../assets/event.jpg";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminDetails from "../components/logs/AdminDetails";
import { AuditLogs } from "../components/logs/AuditLogs";
import constant from "../constant";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Blogs = () => {
  const { userDetails } = AdminDetails();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  const fetchBlogs = async (page) => {
    try {
      const response = await axios.get(`${constant.apiUrl}/blogs/`, {
        params: { page: page, limit: 6 },
      });
      const newBlogs = response.data.blogs;

    if (newBlogs.length > 0) {
      setBlogs(newBlogs);
    }

    // Determine if there's more data to load
    setHasMore(newBlogs.length === 6);
    } catch (error) {
      setError("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);
  const loadMore = async () => {
    if (!hasMore) {
     
      return;
    }
  
    // If there are more blogs, increase the page number to load the next set of blogs
    setPage((prevPage) => prevPage + 1);
  };
  const getVariant = () => {
    if (isXs) return "h5";
    if (isSm) return "h5";
    if (isMd) return "h4";
    if (isLg) return "h4";
    if (isXl) return "h3";
    return "body1"; // Default variant
  };
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const handleCreate = () => {
    navigate("/blogs/blog-form/create");
  };

  const handleDelete = async (postId) => {
    setPostIdToDelete(postId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setPostIdToDelete(null);
  };
  const handleDialogConfirm = async () => {
    if (postIdToDelete === null) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/blogs/${postIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Post deleted successfully");

        await AuditLogs(
          1,
          new Date(),
          "Delete Blog",
          userDetails.userId,
          userDetails.username,
          {
            action: { old: null, new: "Blog Deleted" },
          }
        );

        setBlogs((prevPosts) => {
          const updatedPosts = prevPosts.filter(
            (post) => post._id !== postIdToDelete
          );
          console.log("Updated posts:", updatedPosts); // Log the updated state
          return updatedPosts;
        });
      } else {
        console.error(`Failed to delete post: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setDialogOpen(false);
      setPostIdToDelete(null);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          marginTop: "9%",
          marginBottom: "4%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Grid item xs={6} sm={6} md={8} lg={8}>
          <Typography
            variant={getVariant()}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textAlign: "left",
              fontWeight: "500",
            }}
          >
            Manage Blogs
          </Typography>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: { xs: "flex" },
            gap: { xs: "4%", sm: "20%", lg: "15%" },
          }}
          sm={6}
          md={2}
          lg={4}
          align="right"
        >
          <Button
            variant="outlined"
            color="customColor"
            sx={{ fontSize: "10px" }}
            onClick={handleCreate}
            startIcon={<AddCircleIcon />}
          >
            Add New
          </Button>
         
            <Button
              size="small"
              sx={{ fontSize: "10px" }}
              variant="outlined"
              color="customColor"
              onClick={loadMore}
            >
              <HourglassEmptyIcon
                sx={{ fontSize: "14px", marginRight: "5px" }}
              />
              Load More
            </Button>
        
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        {blogs.map((blog) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <Card sx={{ maxWidth: "100%" }}>
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="140"
                  image={blog.image}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {blog.content}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    size="small"
                    onClick={() => handleDelete(blog._id)}
                    variant="outlined"
                    color="customColor"
                  >
                    <DeleteIcon
                      sx={{ fontSize: "14px", marginRight: "10px" }}
                    />
                    Delete
                  </Button>
                  <Link to={`/blogs/blog-form/edit/${blog._id}`}>
                    <Button size="small" variant="outlined" color="customColor">
                      <EditIcon
                        sx={{ fontSize: "14px", marginRight: "10px" }}
                      />
                      Edit
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ textAlign: "center" }}>Are you Sure ?</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            sx={{ textAlign: "center" }}
          >
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
export default Blogs;
