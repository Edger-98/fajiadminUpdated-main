import React, { useState, useEffect } from "react";
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
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import AdminDetails from "../../components/logs/AdminDetails";
import { AuditLogs } from "../../components/logs/AuditLogs";

import { useParams, useNavigate } from "react-router-dom";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
const EditPromo = () => {
  const { userDetails } = AdminDetails();
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    expiry_date: "",
    discount_val: "",
    applicable_events: [],
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/promo/${id}`)
      .then((response) => {
        const data = response.data;
        data.expiry_date = formatDate(data.expiry_date);
        setFormData(data);
      })
      .catch((error) => {
        console.error("Error fetching post data:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "applicable_events") {
      const selectedValues =
        typeof value === "string" ? value.split(",") : value;
      setSelectedItems(selectedValues);
      setFormData((prevData) => ({
        ...prevData,
        applicable_events: selectedValues,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const items = ["Party A", "Party B", "Party C", "Party D", "Party E"];
  const handleSubmit = async (e) => {
    e.preventDefault();
    const discountValue = parseFloat(formData.discount_val);

    if (isNaN(discountValue)) {
      setSnackbarOpen(true);
      setSnackbarMessage("Invalid discount value. Please enter a number.");
      setSnackbarSeverity("error");
      return;
    }

    const payload = {
      code: formData.code,
      expiry_date: formData.expiry_date,
      discount_val: discountValue,
      applicable_events: formData.applicable_events,
    };
    try {
      const response = await axios.put(
        `http://localhost:5000/api/promo/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Promocode updated successfully:", response.data);
  
      if (response.status === 200 || response.status === 201) {
        setSnackbarOpen(true);
        setSnackbarMessage("Promocode updated successfully!");
        setSnackbarSeverity("success");
        await AuditLogs(
          1,
          new Date(),
          "Update Promocode",
          userDetails.userId,
          userDetails.username,
          {
            title: { old: null, new: formData.code },
            content: { old: null, new: formData.code },
          }
        );
        setTimeout(() => {
          navigate("/promo");
        }, 5000);
       
      } else {
        setSnackbarOpen(true);
        setSnackbarMessage("An error occurred!");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarOpen(true);
      setSnackbarMessage("Error updating promocode!");
      setSnackbarSeverity("error");
      console.error("Error updating promocode:", error);
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
        width: "100%",
      }}
    >
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                textAlign: "left",
                fontWeight: "500",
              }}
            >
              Update Promocode Details
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                aria-describedby="promocode"
                inputProps={{
                  "aria-label": "promocode",
                }}
                fullWidth
                name="code"
                value={formData.code}
                onChange={handleChange}
                type="text"
              />
              <FormHelperText id="promocode">Promocode</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                aria-describedby="expiry_date"
                inputProps={{
                  "aria-label": "weight",
                }}
                fullWidth
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                type="date"
              />
              <FormHelperText id="expiry_date">Expiry Date</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Select
                labelId="multiple-select-label"
                multiple
                name="applicable_events"
                variant="standard"
                value={formData.applicable_events}
                onChange={handleChange}
                input={<OutlinedInput label="Select Options" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {items.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText id="expiry_date">
                Applied on following events
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                id="discount"
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                aria-describedby="discount"
                inputProps={{
                  "aria-label": "discount",
                }}
                name="discount_val"
                value={formData.discount_val}
                onChange={handleChange}
                fullWidth
                type="number"
              />
              <FormHelperText id="discount">Discount Percentage</FormHelperText>
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

export default EditPromo;
