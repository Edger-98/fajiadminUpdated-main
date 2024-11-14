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
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from "@mui/material";
import constant from "../../constant";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminDetails from "../../components/logs/AdminDetails";
import { AuditLogs } from "../../components/logs/AuditLogs";

const EditPromo = () => {
  const { userDetails } = AdminDetails();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  const [formData, setFormData] = useState({
    promocode: "",
    expiry_date: "",
    discount: "",
    applicable_events: [],
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name + ":" + value);
    if (name === "applicable_events") {
      setSelectedItems(
        typeof value === "string" ? value.split(",") : value
      );
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(d.getDate()).padStart(2, "0");

    return `${month}-${day}-${year}`;
  };
  
  const items = ["Party A", "Party B", "Party C", "Party D", "Party E"];
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      code: formData.promocode,
      expiry_date: formatDate(formData.expiry_date),
      discount_val: formData.discount,
      applicable_events: selectedItems,
    };
   
    try {
        const url = `${constant.apiUrl}/promo/`;
        
        const response = await axios.post(url, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        console.log("Response:", response.data);
    
        if (response.status === 200 || response.status === 201) {
          setSnackbarOpen(true);
          setSnackbarMessage("Form submitted successfully!");
          setSnackbarSeverity("success");
          await AuditLogs(
            1,
            new Date(),
            "Add Promocode",
            userDetails.userId,
            userDetails.username,
            {
              
              title: { old: null, new: formData.promocode },
              content: { old: null, new: formData.promocode},
            }
          );
          setTimeout(() => {
            navigate("/promo");
          }, 5000);
         
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
              variant="h4"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                textAlign: "left",
                fontWeight: "500",
              }}
            >
              Add New Promocode
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "100%" }}>
              <Input
                aria-describedby="promocode"
                required
                inputProps={{
                  "aria-label": "promocode",
                }}
                fullWidth
                name="promocode"
                value={formData.promocode}
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
                required
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
                required
                value={selectedItems}
                onChange={handleChange}
                input={<OutlinedInput label="Applicable Events" />}
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
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                fullWidth
                type="number"
                required
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
