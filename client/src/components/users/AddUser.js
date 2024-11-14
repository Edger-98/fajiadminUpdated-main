import React, { useState } from "react";
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
  Snackbar,
  Alert,
  MenuItem,
  Chip,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import constant from "../../constant";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import AdminDetails from "../../components/logs/AdminDetails";
import { AuditLogs } from "../../components/logs/AuditLogs";
import { v4 as uuidv4 } from 'uuid';

const role = [
  {
    value: "organizer",
    label: "Organizer",
  },
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "attendee",
    label: "Attendee",
  },
];
const status = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "InActive",
  },
];
const AddUser = () => {
  const { userDetails } = AdminDetails();
  const navigate = useNavigate();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  const getVariant = () => {
    if (isXs) return "h6";
    if (isSm) return "h5";
    if (isMd) return "h4";
    if (isLg) return "h3";
    if (isXl) return "h2";
    return "body1";
  };

  const [selectedItems, setSelectedItems] = useState([]);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    email: "",
    status: "",
    userRole: "",
    userId: uuidv4(),
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userId: formData.userId, 
      userName: formData.userName,
      password: formData.password,
      email: formData.email,
      status: formData.status || 'active',
      userRole: formData.userRole || 'Organizer',
    };

    try {
      const response = await axios.post(
        `${constant.apiUrl}/users/add-user`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Response:", response.data);
      if (response.status === 200 || response.status === 201) {
        setSnackbarOpen(true);
        setSnackbarMessage("Form submitted successfully!");
        setSnackbarSeverity("success");
        await AuditLogs(
          1,
          new Date(),
          "Add User",
          userDetails.userId,
          userDetails.username,
          {
            username: { old: null, new: formData.userName },
            email: { old: null, new: formData.email },
          }
        );
        navigate("/users");
        console.log("Form data submitted:", formData);
      } else {
        setSnackbarOpen(true);
        setSnackbarMessage("An error occurred!");
        setSnackbarSeverity("error");
      }
    } catch (error) {
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
              variant={getVariant()}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                textAlign: "left",
                fontWeight: "500",
              }}
            >
              Add New User
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                aria-describedby="username"
                required
                inputProps={{
                  "aria-label": "username",
                }}
                fullWidth
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                type="text"
              />
              <FormHelperText id="username">User Name</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                aria-describedby="password"
                required
                inputProps={{
                  "aria-label": "password",
                }}
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="text"
              />
              <FormHelperText id="password">Enter Password</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                aria-describedby="email"
                inputProps={{
                  "aria-label": "email",
                }}
                fullWidth
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
              <FormHelperText id="expiry_date">User Email</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <TextField
                id="role"
                select
                SelectProps={{
                  native: true,
                }}
                helpertext="User Role"
                variant="standard"
                fullWidth
                name="userRole"
                value={formData.userRole}
                onChange={handleChange}
              >
                {role.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <TextField
                id="status"
                select
                SelectProps={{
                  native: true,
                }}
                helpertext="User Status"
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
          <Grid item xs={12} sm={12} md={12} sx={{ margin: "auto" }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
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

export default AddUser;
