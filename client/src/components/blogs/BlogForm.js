import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  Input,
  FormControl,
  FormHelperText,
  Grid,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import constant from "../../constant";
import { AddAPhoto, Delete } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminDetails from "../../components/logs/AdminDetails";
import { AuditLogs } from "../../components/logs/AuditLogs";
const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userDetails } = AdminDetails();

  const [template, setTemplate] = useState({
    title: "",
    content: " ",
    short_desc: "",
    image: "",
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [previewImage, setPreviewImage] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  const handleDeleteImage = () => {
    setImage(null);
    setPreviewImage("");
  };
  useEffect(() => {
    if (id) {
      axios
        .get(`${constant.apiUrl}/blogs/${id}`)
        .then((response) => {
          setTemplate(response.data);
          console.log(response.data);
          setPreviewImage(response.data.image);
          setIsEditMode(true);
        })
        .catch((error) => {
          console.error("Error fetching post data:", error);
        });
    } else {
      setIsEditMode(false);
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", template.title);
    formData.append("content", template.content);
    formData.append("short_desc", template.short_desc);
    if (image) {
      formData.append("image", image);
    }
    console.log("Submitting payload:", formData);
    const userId = userDetails.userId;
    const userName = userDetails.username;
    try {
      const url = isEditMode
        ? `${constant.apiUrl}/blogs/${id}`
        : `${constant.apiUrl}/blogs/`;

      const method = isEditMode ? "put" : "post";

      const response = await axios({
        method,
        url,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      // console.log("Response:", response.data);

      if (response.status === 200 || response.status === 201) {
        setSnackbarOpen(true);

        setSnackbarMessage(
          isEditMode
            ? "Post Edited successfully!"
            : "Post Created successfully!"
        );
        setSnackbarSeverity("success");
        (await isEditMode)
          ? AuditLogs(1, new Date(), "Edit Blog", userId, userName, {
              title: { old: null, new: template.title },
              content: { old: null, new: template.content },
            })
          : AuditLogs(1, new Date(), "Create Blog", userId, userName, {
              title: { old: null, new: template.title },
              content: { old: null, new: template.content },
            });
        setTimeout(() => {
          navigate("/blogs");
        }, 5000);
      } else {
        setSnackbarOpen(true);
        setSnackbarMessage("An error occurred!");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbarOpen(true);
      setSnackbarMessage("An error occurred!");
      setSnackbarSeverity("error");
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexWrap: "wrap", margin: "8% auto 2%" }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textAlign: "left",
              fontWeight: "500",
            }}
          >
            {isEditMode ? "Update Post" : "Create New Post"}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          border: "1px solid #eee",
          borderRadius: "10px",
          marginTop: "4%",
          padding: "2%",
        }}
        spacing={1}
      >
        <Grid item xs={12} sm={12} md={12}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textAlign: "left",
              fontWeight: "400",
            }}
          >
            Basic Details
          </Typography>
          <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "90%" }}>
            <Input
              aria-describedby="title"
              required
              inputProps={{
                "aria-label": "title",
              }}
              fullWidth
              name="title"
              value={template.title}
              onChange={handleChange}
              type="text"
            />
            <FormHelperText id="title">Post Title</FormHelperText>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "90%" }}>
            <Input
              aria-describedby="short_desc"
              required
              inputProps={{
                "aria-label": "short_desc",
              }}
              fullWidth
              name="short_desc"
              value={template.short_desc}
              onChange={handleChange}
              type="text"
            />
            <FormHelperText id="short_desc">Short Description</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          border: "1px solid #eee",
          borderRadius: "10px",
          marginTop: "4%",
          padding: "2%",
        }}
        spacing={1}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Montserrat, sans-serif",
            textAlign: "left",
            fontWeight: "400",
          }}
        >
          Cover Image
        </Typography>
        {(previewImage || isEditMode) && (
          <Grid item xs={12}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 200,
                marginBottom: "20px",
              }}
            >
              <Box
                component="img"
                sx={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
                src={previewImage || template.image}
                alt="uploaded preview"
              />
              <IconButton
                color="secondary"
                aria-label="delete image"
                onClick={handleDeleteImage}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                }}
              >
                <Delete />
              </IconButton>
            </Box>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={12}>
          <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "90%" }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="upload-image"
              type="file"
              name="image"
              onChange={handleImageChange}
            />
            <label htmlFor="upload-image">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <AddAPhoto />
              </IconButton>
            </label>
          </FormControl>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          border: "1px solid #eee",
          borderRadius: "10px",
          marginTop: "4%",
          padding: "2%",
        }}
        spacing={1}
      >
        <Grid item xs={12} sm={12} md={12}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textAlign: "left",
              fontWeight: "400",
            }}
          >
            Post Description
          </Typography>
          <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
            <Input
              aria-describedby="description"
              required
              inputProps={{
                "aria-label": "description",
              }}
              fullWidth
              name="content"
              multiline
              rows={4}
              value={template.content}
              onChange={handleChange}
              type="text"
            />
            <FormHelperText id="description">Description</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container sx={{ marginTop: "4%" }} spacing={1}>
        <Grid item xs={12} sm={12} md={12} sx={{ margin: "auto" }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {isEditMode ? "Update Post" : "Create Post"}
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
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
    </Box>
  );
};

export default BlogForm;
