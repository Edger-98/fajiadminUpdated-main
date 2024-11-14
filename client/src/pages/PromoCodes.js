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
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import constant from '../constant';
import AdminDetails from "../components/logs/AdminDetails";
import { AuditLogs } from "../components/logs/AuditLogs";
import axios from 'axios';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function PromoCode() {
  const { userDetails } = AdminDetails();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));
  useEffect(() => {
    const fetchPromocode = async () => {
      try {
        const promocodes = await axios.get(`${constant.apiUrl}/promo`);
        if (Array.isArray(promocodes.data)) {
          setPromocode(promocodes.data);
        } else {
          console.error("API response is not an array:", promocodes.data);
        }
      } catch (error) {
        setError("Error fetching blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchPromocode();
  }, []);
  const getVariant = () => {
    if (isXs) return "h5";
    if (isSm) return "h5";
    if (isMd) return "h4";
    if (isLg) return "h4";
    if (isXl) return "h3";
    return "body1"; // Default variant
  };

  const [promocode, setPromocode] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [promoIdToDelete, setPromoIdToDelete] = useState(null);
  console.log(promocode);
  const [columnDefs] = useState([
    {
      headerName: "Promo Code",
      field: "code",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Applicable Events",
      field: "applicable_events",
      filter: true,
      floatingFilter: true,
      flex: 5,
    },
    {
      headerName: "Expiry Date",
      field: "expiry_date",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Discount Value",
      field: "discount_val",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 150,
      cellStyle: { textAlign: "left" },
      cellRenderer: (params) => {
        console.log("Cell Renderer Params:", params.data._id);
        return (
          <Box>
            <Link
              to={`/promo/edit-promo/${params.data._id}`} // Check if _id is correct
              style={{ textDecoration: "none" }}
            >
              <IconButton aria-label="edit" sx={{ fontSize: "medium" }}>
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

  const handleDelete = async(promoId) => {
    setPromoIdToDelete(promoId);
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setPromoIdToDelete(null);
  };
  const handleDialogConfirm =async(id) => {
    if (promoIdToDelete === null) return;
 
    try {
      const response = await fetch(`${constant.apiUrl}/promo/${promoIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        
        console.log('Promo deleted successfully');
        await AuditLogs(
          1,
          new Date(),
          "Delete Promocode",
          userDetails.userId,
          userDetails.username,
          {
            title: { old: null, new: promocode.code },
            content: { old: null, new: promocode.code },
          }
        );
        console.log('Current promocodes:', promocode);
        // Update the state to remove the deleted post
        setPromocode((prevPosts) => {
          const updatedPromocode = prevPosts.filter((post) => post._id !== promoIdToDelete);
          console.log('Updated posts:', updatedPromocode); // Log the updated state
          return updatedPromocode;
        });
      } else {
        console.error(`Failed to delete post: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setDialogOpen(false); // Close the dialog after handling
      setPromoIdToDelete(null);
    }

 
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
            Manage Promocodes
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4} md={2} align="right">
          <Button
            component={Link}
            to="/promo/add-promo"
            variant="outlined"
            color="customColor"
            startIcon={<AddCircleIcon />}
          >
            Add New
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12} sx={{ marginTop: "4%" }}>
          <div
            className="ag-theme-alpine"
            style={{ height: 400, width: "100%" }}
          >
            <AgGridReact
              rowData={promocode}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={6}
              domLayout="autoHeight"
            />
          </div>
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
            Are you sure you want to delete this promocode?
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

export default PromoCode;
