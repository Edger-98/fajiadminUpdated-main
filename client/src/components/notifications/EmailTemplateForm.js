import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Paper,
  Box,
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
import AdminDetails from "../../components/logs/AdminDetails";
import { AuditLogs } from "../../components/logs/AuditLogs";

const type = [
  {
    value: "approval_decline",
    label: "Event Approval/Decline",
  },
  {
    value: "signup",
    label: "User Signup",
  },
  {
    value: "pass_reset",
    label: "Password Reset",
  },
  {
    value: "ticket_confirmation",
    label: "Ticket Purchase Confirmation",
  },
];
const EmailTemplateForm = () => {
  const { userDetails } = AdminDetails();
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const [template, setTemplate] = useState({
    name: "",
    subject: "",
    body: "",
    type: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  useEffect(() => {
    if (id) {
      console.log(id);
      setIsEditMode(true);
      axios
        .get(`${constant.apiUrl}/email-templates/${id}`)
        .then((response) => {
          setTemplate(response.data);
        })
        .catch((error) => {
          console.error("Error fetching email template data:", error);
          setSnackbarOpen(true);
          setSnackbarMessage("Error fetching email template data!");
          setSnackbarSeverity("error");
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
    try {
      const url = isEditMode
        ? `${constant.apiUrl}/email-templates/${id}` // Correct URL format with ID
        : `${constant.apiUrl}/email-templates/`;

      const response = isEditMode
        ? await axios.put(url, template, {
            headers: { "Content-Type": "application/json" },
          })
        : await axios.post(url, template, {
            headers: { "Content-Type": "application/json" },
          });

      console.log("Email Template operation successful:", response.data);
      setSnackbarOpen(true);
      setSnackbarMessage(
        isEditMode
          ? "Email Template updated successfully!"
          : "Email Template created successfully!"
      );
      setSnackbarSeverity("success");
      await isEditMode ?  await AuditLogs(
        1,
        new Date(),
        "Edit Email Template",
        userDetails.userId,
        userDetails.username,
        {
          
          email: { old: null, new: template.name},
          subject: { old: null, new: template.subject },
        }
      ) : AuditLogs(
        1,
        new Date(),
        "Email Template Added",
        userDetails.userId,
        userDetails.username,
        {
          email: { old: null, new: template.name},
          subject: { old: null, new: template.subject },
        }
      );
      setTimeout(() => {
        navigate("/app-notifications");
      }, 5000);
    
    } catch (error) {
      console.error(
        "Error creating/updating email template:",
        error.response ? error.response.data : error.message
      );
      setSnackbarOpen(true);
      setSnackbarMessage("Error creating/updating email template!");
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
              variant="h4"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                textAlign: "left",
                fontWeight: "500",
              }}
            >
              {isEditMode ? "Update Email Template" : "Create Email Template"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                aria-describedby="name"
                required
                inputProps={{
                  "aria-label": "name",
                }}
                fullWidth
                name="name"
                value={template.name}
                onChange={handleChange}
                type="text"
              />
              <FormHelperText id="name">Template Name</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                aria-describedby="subject"
                required
                inputProps={{
                  "aria-label": "subject",
                }}
                fullWidth
                name="subject"
                value={template.subject}
                onChange={handleChange}
                type="text"
              />
              <FormHelperText id="subject">Template Subject</FormHelperText>
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
                name="type"
                value={template.type}
                onChange={handleChange}
              >
                {type.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                aria-describedby="body"
                required
                inputProps={{
                  "aria-label": "body",
                }}
                fullWidth
                name="body"
                multiline
                rows={4}
                value={template.body}
                onChange={handleChange}
                type="text"
              />
              <FormHelperText id="body">Template Subject</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={12} sx={{ margin: "auto" }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {isEditMode ? "Update Template" : "Create Template"}
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

export default EmailTemplateForm;
