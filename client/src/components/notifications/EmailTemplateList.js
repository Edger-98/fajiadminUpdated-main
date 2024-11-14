import React, { useEffect, useState } from "react";
import axios from "axios";
import constant from "../../constant";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import AdminDetails from "../../components/logs/AdminDetails";
import { AuditLogs } from "../../components/logs/AuditLogs";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const EmailTemplateList = () => {
  const { userDetails } = AdminDetails();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailTemplate, setEmailTemplate] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [emailTemplateToDelete, setEmailTemplateToDelete] = useState(null);
  useEffect(() => {
    const fetchEmailTemplates = async () => {
      try {
        const emailTemplates = await axios.get(
          `${constant.apiUrl}/email-templates/`
        );
        console.log(emailTemplates.data);
        setEmailTemplate(emailTemplates.data);
      } catch (error) {
        setError("Error fetching blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchEmailTemplates();
  }, []);
  const handleEdit = (id) => {
    navigate(`/email-templates/edit/${id}`);
  };

  const handleDelete = (id) => {
    setEmailTemplateToDelete(id);
    setDialogOpen(true);
    console.log("Delete template with ID:", id);
  };

  const handleCreate = () => {
    navigate("/email-templates/create");
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleDialogConfirm = async (id) => {
    if (emailTemplateToDelete === null) return;

    try {
      const response = await fetch(
        `${constant.apiUrl}/email-templates/${emailTemplateToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Successfully deleted
        console.log("Email Template Deleted Successfully");
        await AuditLogs(
          1,
          new Date(),
          "Email Template Deleted",
          userDetails.userId,
          userDetails.username,
          {
            action: { old: null, new: "Email Template Deleted" },
          }
        );
        setEmailTemplate((prevPosts) => {
          const updatedEmailTemplate = prevPosts.filter(
            (email) => email._id !== emailTemplateToDelete
          );
          console.log("Updated email template:", updatedEmailTemplate); // Log the updated state
          return updatedEmailTemplate;
        });
      } else {
        console.error(
          `Failed to delete email template: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setDialogOpen(false); // Close the dialog after handling
      setEmailTemplateToDelete(null);
      setSnackbarMessage("Email Template Deleted Successfully!");
      setSnackbarSeverity("success");
      setDialogOpen(false);
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <>
      <Grid container sx={{ marginTop: "8%", marginBottom: "2%" }}>
        <Grid item xs={8} sm={8} md={10}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textAlign: "left",
              fontWeight: "500",
            }}
          >
            Email Templates
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={2} align="right">
          <Button
            onClick={handleCreate}
            variant="outlined"
            color="customColor"
            startIcon={<AddCircleIcon />}
          >
            Add New
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{ marginTop: "4%", marginBottom: "2%" }}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Subject</TableCell>
                  {/* <TableCell>Send Email</TableCell> */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emailTemplate.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{template.subject}</TableCell>
                    {/* <TableCell>
                                <SendIcon onClick={() => handleEdit(template.id)} sx={{fontSize: 24, color: "#FF4343"}}>
                                    <EditIcon />
                                </SendIcon>
                            </TableCell> */}
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(template._id)}
                        sx={{ fontSize: 16, color: "#a370f7" }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(template._id)}
                        sx={{ fontSize: 16, color: "#dc3545" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
            Are you sure you want to delete this template?
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

export default EmailTemplateList;
