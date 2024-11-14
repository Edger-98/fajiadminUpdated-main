// Login.js
import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import constant from "../constant";
const Login = ({ setAuthToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${constant.apiUrl}/auth/login`, {
        username,
        password,
      });
      console.log(response);

      if (response.status === 200 || response.status === 201) {
        const userRole = response.data.userRole;
       
        localStorage.setItem("userId", response.data.userId);
      
        setSnackbarOpen(true);
        setSnackbarMessage("Login Successfull");
        setSnackbarSeverity("success");
        setTimeout(() => {
          if (userRole === 'admin') {
            window.location.href = '/';
          }
        }, 2000);
       
      
      } else {
        setSnackbarOpen(true);
        setSnackbarMessage("Invalid credentials. Please try again");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage("Invalid credentials");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  return (
    <Box className="loginForm" sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          required
          fullWidth
          id="username"
          label="Username"
          margin="normal"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off" 
        />
        <TextField
          required

          fullWidth
          id="password"
          type="password"
          label="Password"
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off" 
     
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Login
        </Button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
