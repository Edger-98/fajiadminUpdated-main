import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Button,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Snackbar,
  Alert,
  Tab,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import constant from "../constant";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Users() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  const getVariant = () => {
    if (isXs) return "h4";
    if (isSm) return "h5";
    if (isMd) return "h4";
    if (isLg) return "h4";
    if (isXl) return "h3";
    return "body1";
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [userRoleFilter, setUserRoleFilter] = useState("admin");
  const fetchAllUsers = async (userRole) => {
    setLoading(true);

    try {
      const users = await axios.get(`${constant.apiUrl}/users`, {
        params: { userRole: userRole }, // Send userRole as a query parameter
      });

      setUsers(users.data);
    } catch (error) {
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllUsers(userRoleFilter);
  }, [userRoleFilter]);
  
  const [columnDefs] = useState([
    // { headerName: "User ID", field: "ID", filter: true, floatingFilter: true },
    {
      headerName: "User Name",
      field: "userName",
      filter: true,
      floatingFilter: true,
    },
    { headerName: "Email", field: "email", filter: true, floatingFilter: true },
    {
      headerName: "User Role",
      field: "userRole",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Registeration Date",
      field: "registrationDate",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Status",
      field: "status",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Tickets Purchased",
      field: "ticketsPurchased",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Actions",
      pinned: "right",
      field: "actions",
      width: 150,
      cellStyle: { textAlign: "left" },
      cellRenderer: (params) => (
        <Box>
          <Link
            to={{
              pathname: `/users/edit-user/${params.data._id}`, // Dynamic route for detail view
              state: { selectedItem: params.data }, // Pass selected item as state
            }}
            style={{ textDecoration: "none" }}
          >
            <IconButton
              aria-label="edit"
              onClick={() => handleEdit(params.data._id)}
              sx={{ fontSize: "medium" }}
            >
              <EditIcon sx={{ fontSize: 16, color: "#479f76" }} />
            </IconButton>
          </Link>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(params.data._id)}
            sx={{ fontSize: "medium" }}
          >
            <DeleteIcon sx={{ fontSize: 16, color: "#dc3545" }} />
          </IconButton>
        </Box>
      ),
    },
  ]);

  const handleEdit = (data) => {
    console.log("Edit", data);
  };

  const handleDelete = (userId) => {
    setUserIdToDelete(userId);
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleDialogConfirm = async (id) => {
    if (userIdToDelete === null) return;

    try {
      const response = await fetch(
        `${constant.apiUrl}/users/${userIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Successfully deleted
        console.log("User Deleted Successfully");

        setUsers((prevPosts) => {
          const updatedUsers = prevPosts.filter(
            (user) => user._id !== userIdToDelete
          );
          console.log("Updated users:", updatedUsers); // Log the updated state
          return updatedUsers;
        });
      } else {
        console.error(`Failed to delete user: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setDialogOpen(false); // Close the dialog after handling
      setUserIdToDelete(null);
      setSnackbarMessage("User Deleted Successfully!");
      setSnackbarSeverity("success");
      setDialogOpen(false);
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  // Tab Data
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === "1") {
      setUserRoleFilter("admin");
    } else if (newValue === "2") {
      setUserRoleFilter("Organizer");
    } else if (newValue === "3") {
      setUserRoleFilter("Attendee");
    }
  };

  return (
    <>
      <Grid container sx={{ marginTop: "9%", marginBottom: "2%" }}>
        <Grid item xs={8} sm={8} md={10}>
          <Typography
            variant={getVariant()}
            style={{
              fontFamily: "Montserrat, sans-serif",
              textAlign: "left",
              fontWeight: "500",
            }}
          >
            Manage Users
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={2} align="right">
          <Button
            component={Link}
            to="/users/add-user"
            variant="outlined"
            color="customColor"
            startIcon={<AddCircleIcon />}
          >
            Add New
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12} sx={{ marginTop: "4%" }}>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  variant="scrollable" // Ensure tabs are scrollable on smaller screens
                  scrollButtons="auto"
                >
                  <Tab
                    label="Admin"
                    value="1"
                    sx={{ fontFamily: "Montserrat, sans-serif" }}
                  />
                  <Tab
                    label="Organizers or Hosts"
                    value="2"
                    sx={{ fontFamily: "Montserrat, sans-serif" }}
                  />
                  <Tab
                    label="Attendees"
                    value="3"
                    sx={{ fontFamily: "Montserrat, sans-serif" }}
                  />
                </TabList>
              </Box>
              <TabPanel
                value="1"
                sx={{
                  textAlign: "left",
                  fontSize: "24px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Admin
              </TabPanel>
              <TabPanel
                value="2"
                sx={{
                  textAlign: "left",
                  fontSize: "24px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Organizers or Hosts
              </TabPanel>
              <TabPanel
                value="3"
                sx={{
                  textAlign: "left",
                  fontSize: "24px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Attendees
              </TabPanel>
              <div
                className="ag-theme-alpine"
                style={{ height: 400, width: "100%" }}
              >
                <AgGridReact
                  rowData={users}
                  columnDefs={columnDefs}
                  pagination={true}
                  paginationPageSize={6}
                  domLayout="autoHeight"
                />
              </div>
            </TabContext>
          </Box>
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
            Are you sure you want to delete this user?
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
}

export default Users;
