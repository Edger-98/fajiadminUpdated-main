import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Box,
  Button,
  Typography,
  Input,
  InputAdornment,
  FormControl,
  FormHelperText,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Snackbar,
  Alert,
} from "@mui/material";
import AdminDetails from "../../components/logs/AdminDetails";
import { AuditLogs } from "../../components/logs/AuditLogs";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const status = [
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "declined",
    label: "Declined",
  },
];

const UpdateEvent = () => {
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const { userDetails } = AdminDetails();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventTitle: "",
    date: "",
    event_organizer: "",
    status: "",
    location: "",
    price: "",
    description: "",
  });
  const [originalData, setOriginalData] = useState({
    eventTitle: "",
    date: "",
    event_organizer: "",
    status: "",
    location: "",
    price: "",
    description: "",
  });
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/events/${id}`)
      .then((response) => {
        const data = response.data;
        data.date = formatDate(data.date);
        setFormData(data);
        setOriginalData(data);
      })
      .catch((error) => {
        console.error("Error fetching post data:", error);
      });
  }, [id]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleChange = (e) => {
    const { name, value } = e.target;
    // const numericValue = value.replace(/[^0-9.]/g, "");
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      eventTitle: formData.eventTitle,
      date: formData.date,
      event_organizer: formData.event_organizer,
      status: formData.status,
      location: formData.location,
      price: formData.price,
      description: formData.description,
    };
    const changes = {};
    Object.keys(payload).forEach((key) => {
      if (formData[key] !== originalData[key]) {
        changes[key] = { old: originalData[key], new: formData[key] };
      }
    });
    try {
      const response = await axios.put(
        `http://localhost:5000/api/events/update-event/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Event updated successfully:", response.data);

      if (response.status === 200 || response.status === 201) {
        setSnackbarOpen(true);
        setSnackbarMessage("Event updated successfully!");
        setSnackbarSeverity("success");
        if (Object.keys(changes).length > 0) {
          await AuditLogs(
            1, // Action type or ID
            new Date(), // Current date/time
            "Update Event", // Action description

            userDetails.username, // Username
            changes // Only log the fields that were changed
          );
        }
        setTimeout(() => {
          navigate("/events");
        }, 5000);
      } else {
        setSnackbarOpen(true);
        setSnackbarMessage("An error occurred!");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarOpen(true);
      setSnackbarMessage("Error updating event!");
      setSnackbarSeverity("error");
      console.error("Error updating event", { details: error.message });
    }
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleDialogConfirm = () => {
    console.log("Form data submitted:", formData);
    setSnackbarMessage("Form submitted successfully!");
    setSnackbarSeverity("success");
    setDialogOpen(false);
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        margin: "8% auto 2%",
        width: "80%",
      }}
    >
      <div>
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
              Update Event Details
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                aria-describedby="title"
                inputProps={{
                  "aria-label": "event_title",
                }}
                fullWidth
                name="eventTitle"
                value={formData.eventTitle}
                onChange={handleChange}
                type="text"
              />
              <FormHelperText id="title">Event Title</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                aria-describedby="date"
                inputProps={{
                  "aria-label": "weight",
                }}
                fullWidth
                name="date"
                value={formData.date}
                onChange={handleChange}
                type="date"
              />
              <FormHelperText id="date">Event Date</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                aria-describedby="organizer"
                inputProps={{
                  "aria-label": "weight",
                }}
                fullWidth
                name="event_organizer"
                value={formData.event_organizer}
                onChange={handleChange}
              />
              <FormHelperText id="organizer">Event Organizer</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <TextField
                id="standard-select-status"
                select
                defaultValue="Approved"
                SelectProps={{
                  native: true,
                }}
                helperText="Event Status"
                variant="standard"
                fullWidth
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {status.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                aria-describedby="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
              />
              <FormHelperText id="location">Event Location</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                id="price"
                endAdornment={<InputAdornment position="end">$</InputAdornment>}
                aria-describedby="price"
                inputProps={{
                  "aria-label": "price",
                  type: "text", // Use text to avoid automatic numeric parsing issues
                }}
                name="price"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                type="number"
              />
              <FormHelperText id="price">Ticket Price</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                id="description"
                aria-describedby="description"
                inputProps={{
                  "aria-label": "description",
                }}
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={6}
              />
              <FormHelperText id="description">
                Event Description
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
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
              Changes that are done never get reverted once saved
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDialogConfirm}>Save</Button>
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
      </div>
    </Box>
  );
};

export default UpdateEvent;
