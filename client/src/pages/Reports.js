import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Snackbar,
  Alert,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useMediaQuery, useTheme } from "@mui/material";
import constant from "../constant";
import axios from "axios";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Reports = () => {
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
  const [reports, setReports] = useState([]);
  const [dialogContent, setDialogContent] = useState("");
  const [error, setError] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestedDetails, setRequestedDetails] = useState("");
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reports = await axios.get(`${constant.apiUrl}/reports/`);
        setReports(reports.data);
      } catch (error) {
        setError("Error fetching reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);
  const handleRequestInfoSubmit = async () => {
    console.log("Payload:", { requestedDetails });
    try {
      await axios.put(`${constant.apiUrl}/reports/${reportId}/request-info`, {
        requestedDetails: requestedDetails,
      });
      setSnackbarMessage("Information Requested Successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleClose(); // Close dialog
    } catch (error) {
      setSnackbarMessage("Failed to request information");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const columnDefs = [
    // { headerName: "ID", field: "ID", filter: true, floatingFilter: true },
    {
      headerName: "Timestamp",
      field: "timeStamp",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Report Desc.",
      field: "description",
      filter: true,
      floatingFilter: true,
      editable: true,
    },
    {
      headerName: "Reported By",
      field: "username",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "User ID",
      field: "userId",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Reported Event",
      field: "eventname",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Event ID",
      field: "eventId",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Action",
      field: "status",
      editable: true,
      pinned: "right",
      cellRenderer: (params) => {
        const handleChange = async (event, id) => {
          console.log(id);
          const newValue = event.target.value;
          if (newValue === "req_info") {
            setReportId(id);
            setDialogOpen(true);
          }
          if (newValue === "spam") {
            try {
              const response = await axios.put(
                `${constant.apiUrl}/reports/${id}/spam`
              );
              console.log("Response:", response);
              if (response.status === 200) {
                console.log("Report Marked as Spam!");
                setSnackbarOpen(true);
                setSnackbarMessage("Report Marked as Spam!");
                setSnackbarSeverity("success");
              }
            } catch (error) {
              console.error("Error marking event as spam:", error);

              setSnackbarOpen(true);
              setSnackbarMessage("Failed to Mark Event as Spam!");
              setSnackbarSeverity("error");
            }
          }
          if (newValue === "declined") {
            try {
              const response = await axios.put(
                `${constant.apiUrl}/reports/${id}/decline`
              );
              console.log("Response:", response);
              if (response.status === 200) {
             
                console.log("Report Declined!");
                setSnackbarOpen(true);
                setSnackbarMessage("Report Declined!");
                setSnackbarSeverity("success");

              }
            } catch (error) {
             
              console.error("Error decline report", error);
              setSnackbarOpen(true);
              setSnackbarMessage("Failed to Mark Report delete!");
              setSnackbarSeverity("error");
            }
          }
          params.setValue(newValue); 
        };

        return (
          <select
            value={params.value}
            onChange={(e) => handleChange(e, params.data._id)}
            style={{
              padding: "5px",
              fontSize: "14px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "transparent",
              color: "#333",
            }}
          >
            <option value="spam">Marked as Spam</option>
            <option value="req_info">Request Info.</option>
            <option value="declined">Declined</option>
          </select>
        );
      },
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleClose = () => {
    setDialogOpen(false);
  };
  return (
    <>
      <Grid container spacing={3} sx={{ marginTop: "9%", marginBottom: "2%" }}>
        <Grid item xs={10} sm={10} md={10}>
          <Typography
            variant={getVariant()}
            style={{
              fontFamily: "Montserrat, sans-serif",
              textAlign: "left",
              fontWeight: "500",
            }}
          >
            Escalations & Reports
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <div
            className="ag-theme-alpine"
            style={{ height: "500px", width: "100%" }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={reports}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={6}
              domLayout="autoHeight"
            />
          </div>
        </Grid>
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            handleRequestInfoSubmit();
          },
        }}
      >
        <DialogContent>
          <DialogContentText>
            Provide Details of information required:
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="text"
            label="Enter Details"
            type="text"
            multiline
            rows={4}
            fullWidth
            variant="standard"
            value={requestedDetails}
            onChange={(e) => setRequestedDetails(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Request</Button>
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
export default Reports;
