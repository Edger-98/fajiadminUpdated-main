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
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import constant from "../constant";
import axios from "axios";
import AdminDetails from "../components/logs/AdminDetails";
import { AuditLogs } from "../components/logs/AuditLogs";
import { useMediaQuery, useTheme } from "@mui/material";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Events() {
  const { userDetails } = AdminDetails();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  const getVariant = () => {
    if (isXs) return "h5";
    if (isSm) return "h5";
    if (isMd) return "h4";
    if (isLg) return "h4";
    if (isXl) return "h3";
    return "body1"; // Default variant
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("approved");
  const fetchEvents = async (status) => {
    setLoading(true); // Show loading spinner

    try {
      const response = await axios.get(`${constant.apiUrl}/events`, {
        params: { status: status }, // Send status as a query parameter
      });
      setEvents(response.data); // Update state with the fetched data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEvents(statusFilter);
  }, [statusFilter]);

  const handleStatusChange = async (event, eventId) => {
    const newStatus = event.target.value;
    console.log(`Updating event ${eventId} to status: ${newStatus}`);
    try {
      const response = await fetch(
        `${constant.apiUrl}/events/${eventId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedEvent = await response.json();

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, status: newStatus } : event
        )
      );

      setSnackbarMessage("Event Status Updated Successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Failed to update event status");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const [columnDefs] = useState([
    {
      headerName: "Title",
      field: "eventTitle",
      filter: true,
      floatingFilter: true,
    },
    { headerName: "Date", field: "date", filter: true, floatingFilter: true },
    { headerName: "Time", field: "time", filter: true, floatingFilter: true },
   
    {
      headerName: "Status",
      field: "status",
      editable: true,
      cellRenderer: (params) => {
       
        return (
          <select
            value={params.value}
            onChange={(e) => handleStatusChange(e, params.data._id)}
            style={{
              padding: "5px",
              fontSize: "14px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "transparent",
              color: "#333",
            }}
          >
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="pending">Pending</option>
          </select>
        );
      },
    },
    { headerName: "Seats", field: "seats", filter: true, floatingFilter: true },
    {
      headerName: "Location",
      field: "location",
      filter: true,
      floatingFilter: true,
    },
    { headerName: "Price", field: "price", filter: true, floatingFilter: true },
    { headerName: "Platform Expense", field: "platform_expense", filter: true, floatingFilter: true },
    {
      headerName: "Actions",
      field: "actions",
      pinned: "right",
      width: 150,
      cellStyle: { textAlign: "left" },
      cellRenderer: (params) => {
        return (
          <Box>
            <Link
              to={{
                pathname: `/events/view-event/${params.data._id}`,
                state: { selectedItem: params.data },
              }}
              style={{ textDecoration: "none" }}
            >
              <IconButton
                aria-label="view"
                onClick={() => handleView(params.data._id)}
                sx={{ fontSize: "medium" }}
              >
                <VisibilityIcon sx={{ fontSize: 16, color: "#a370f7" }} />
              </IconButton>
            </Link>
            <Link
              to={{
                pathname: `/events/update-event/${params.data._id}`, 
                state: { selectedItem: params.data }, 
              }}
              style={{ textDecoration: "none" }}
            >
              <IconButton
                aria-label="edit"
                onClick={() => handleEdit(params.data_id)}
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
        );
      },
    },
  ]);

  const handleView = (data) => {
    console.log("View", data);
  };

  const handleEdit = (data) => {
    console.log("Edit", data);
  };

  const handleDelete = (eventId) => {
    setEventIdToDelete(eventId);
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleDialogConfirm = async (id) => {
    if (eventIdToDelete === null) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${eventIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Event Deleted Successfully");
        await AuditLogs(
          1,
          new Date(),
          "Delete Event",
          userDetails.userId,
          userDetails.username,
          {
            title: { old: null, new: "delete event" },
            content: { old: null, new: "delete event" },
          }
        );
        setEvents((prevPosts) => {
          const updatedEvents = prevPosts.filter(
            (event) => event._id !== eventIdToDelete
          );
          console.log("Updated events:", updatedEvents); // Log the updated state
          return updatedEvents;
        });
      } else {
        console.error(`Failed to delete event: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setDialogOpen(false); 
      setEventIdToDelete(null);
      setSnackbarMessage("Event Deleted Successfully!");
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

    // Update the status filter based on the selected tab
    if (newValue === "1") {
      setStatusFilter("approved");
    } else if (newValue === "2") {
      setStatusFilter("pending");
    } else if (newValue === "3") {
      setStatusFilter("declined");
    }

    // Fetch events based on the new status filter
    fetchEvents(newValue === "1" ? "approved" : newValue === "2" ? "pending" : "declined");

  };

  return (
    <>
      <Grid
        container
        sx={{ marginTop: { md: "9%", sm: "13%" }, marginBottom: "2%" }}
      >
        <Grid item xs={10} sm={10} md={10}>
          <Typography
            variant={getVariant()}
            style={{
              fontFamily: "Montserrat, sans-serif",
              textAlign: "left",
              fontWeight: "500",
            }}
          >
            Manage Parties
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} sx={{ marginTop: "4%" }}>
          <Box
            sx={{
              width: {
                xs: "100%", // For extra small screens (mobile)
                sm: "100%", // For small screens (tablet)
                md: "100%", // For medium screens (small desktops)
                lg: "100%", // For large screens (desktops)
                xl: "100%", // For extra large screens
              },
              typography: "body1",
            }}
          >
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  variant="scrollable" // Ensure tabs are scrollable on smaller screens
                  scrollButtons="auto"
                >
                  <Tab
                    label="Approved"
                    value="1"
                    sx={{ fontFamily: "Montserrat, sans-serif" }}
                  />
                  <Tab
                    label="Waiting For Information"
                    value="2"
                    sx={{ fontFamily: "Montserrat, sans-serif" }}
                  />
                  <Tab
                    label="Declined Parties"
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
                Approved Parties
              </TabPanel>
              <TabPanel
                value="2"
                sx={{
                  textAlign: "left",
                  fontSize: "24px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Waiting For Information
              </TabPanel>
              <TabPanel
                value="3"
                sx={{
                  textAlign: "left",
                  fontSize: "24px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Declined Parties
              </TabPanel>
              <div
                className="ag-theme-alpine"
                style={{ height: 400, width: "100%" }}
              >
                <AgGridReact
                  rowData={events}
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
            Are you sure you want to delete this event?
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

export default Events;
