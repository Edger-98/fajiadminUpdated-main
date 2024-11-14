import React, { useState, useEffect } from "react";
import { Grid, Button, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import constant from "../../constant";
import Image from "../../assets/event.jpg";
const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
const data = [
  { name: "Mon", sales: 4 },
  { name: "Tue", sales: 3 },
  { name: "Wed", sales: 2 },
  { name: "Thu", sales: 2 },
  { name: "Fri", sales: 10 },
  { name: "Sat", sales: 12 },
  { name: "Sun", sales: 15 },
];

const ViewTicket = () => {
  const [getTicket, setGetTicket] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const handleGoBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    axios
      .get(`${constant.apiUrl}/tickets/${id}`)
      .then((response) => {
        const data = response.data;
        data.purchasedDate = formatDate(data.purchasedDate);
        setGetTicket(data);
      })
      .catch((error) => {
        console.error("Error fetching ticket:", {detail:error.message});
      });
  }, [id]);
 
  return (
    <>
      <Grid container sx={{ marginTop: "8%", marginBottom: "2%" }} spacing={2}>
        <Grid item xs={12} sm={12} md={8} sx={{ margin: "auto" }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            Ticket Details
          </Typography>
          <Grid container sx={{ marginTop: "4%" }}>
            <Grid item xs={12} sm={12} md={6}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: "500" }}>Ticket ID:</span> {getTicket.ticketId}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: "500" }}>Event Name:</span>  {getTicket.partyName}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ marginTop: "4%" }}>
            <Grid item xs={12} sm={12} md={6}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: "500" }}>Ticket Owner:</span> {getTicket.userName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: "500" }}>Event Organizer:</span>{" "}
                {getTicket.organizerName}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ marginTop: "4%" }}>
            <Grid item xs={12} sm={12} md={6}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: "500" }}>Purchase Date:</span>{" "}
               {getTicket.purchasedDate}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: "500" }}>Ticket Price:</span> {getTicket.price}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ marginTop: "4%" }}>
            <Grid item xs={12} sm={12} md={6}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  textAlign: "center",
                }}
              >
                <span style={{ fontWeight: "500" }}>Applied PromoCode:</span>{" "}
               {getTicket.promoCode?getTicket.promoCode:"None"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Button variant="contained" onClick={handleGoBack} sx={{ mt: 2 }}>
        Go Back
      </Button>
    </>
  );
};
export default ViewTicket;
