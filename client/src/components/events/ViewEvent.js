import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import constant from "../../constant";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Image from "../../assets/event.jpg";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";



const ViewEvent = () => {
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'short' }; // This will get the full day name
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [viewEvent, setViewEvent] = useState([]);
  const [error, setError] = useState(null);
  const [ticketSold, setTicketSold] = useState([]);
  useEffect(() => {
    const fetchTicketSold = async () => {
      try {
        if (viewEvent._id) {
          const response = await axios.get(
            `${constant.apiUrl}/tickets/totalTicketsSold/${viewEvent._id}`
          );
          console.log(response.data.ticketSalesByDate);
          const fetchedData = response.data.ticketSalesByDate.map((item) => ({
            name: getDayName(item._id), // Assuming _id is the date
            sales: item.ticketsSold,
          }));
          console.log(fetchedData.name);
          setTicketSold(fetchedData);
        }
      } catch (err) {
        setError("Error fetching sold tickets");
        console.error(err);
      }
    };

    fetchTicketSold();
  }, [viewEvent]);
  console.log(ticketSold);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${constant.apiUrl}/events/${id}`);
        const data = response.data;
        setViewEvent(data);
console.log(data);
        // Fetch user data after event data is set
        const userResponse = await axios.get(
          `${constant.apiUrl}/tickets/usersByEvent/${data._id}`
        );
        const users = userResponse.data;
        users.forEach(user => {
          user.registrationDate = formatDate(user.registrationDate);
        });
        setUser(users);
      } catch (err) {
        setError("Error fetching event or user.");
        console.error(err);
      }
    };

    fetchEvent();
  }, [id]);
  console.log(viewEvent._id);
  console.log(user);
  const totalSales = ticketSold.reduce((acc, item) => acc + item.sales, 0);
  const [columnDefs] = useState([
    // {
    //   headerName: "User ID",
    //   field: "ID",
    //   filter: true,
    //   floatingFilter: true,
    // },
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
  ]);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Grid container sx={{ marginTop: "8%", marginBottom: "2%" }} spacing={3}>
        <Grid item xs={12} sm={12} md={8}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textAlign: "left",
              fontWeight: "500",
            }}
          >
            Event Details
          </Typography>

          <Grid container sx={{ marginTop: "4%" }}>
            <Grid item xs={12} sm={6} md={6}>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Montserrat, sans-serif", textAlign: "left" }}
              >
                <span style={{ fontWeight: "500" }}>Event Title:</span>{" "}
                {viewEvent.eventTitle}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Montserrat, sans-serif", textAlign: "left" }}
              >
                <span style={{ fontWeight: "500" }}>Event Time:</span>{" "}
                {viewEvent.time}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ marginTop: "2%" }}>
            <Grid item xs={12} sm={6} md={6}>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Montserrat, sans-serif", textAlign: "left" }}
              >
                <span style={{ fontWeight: "500" }}>Event Organizer:</span>
                <span style={{ fontWeight: "500" }}>
                  {viewEvent.event_organizer}
                </span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Montserrat, sans-serif", textAlign: "left" }}
              >
                <span style={{ fontWeight: "500" }}>Status:</span>{" "}
                <span style={{ color: "green" }}>{viewEvent.status}</span>
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ marginTop: "2%" }}>
            <Grid item xs={12} sm={12} md={12} sx={{ textAlign: "left" }}>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <span style={{ fontWeight: "500" }}>Event Description</span>
              </Typography>
              <Typography
                variant="p"
                sx={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {viewEvent.description}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ marginTop: "2%" }}>
            <Grid item xs={12} sm={6} md={6}>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Montserrat, sans-serif", textAlign: "left" }}
              >
                <span style={{ fontWeight: "500" }}>Event Location:</span>{" "}
                {viewEvent.location}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Montserrat, sans-serif", textAlign: "left" }}
              >
                <span style={{ fontWeight: "500" }}>Ticket Price:</span>{" "}
                {viewEvent.price}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: "2%" }}>
            <Grid item xs={12} sm={12} md={12}>
              <Typography
                variant="h6"
                sx={{ fontFamily: "Montserrat, sans-serif", textAlign: "left" }}
              >
                <span style={{ fontWeight: "500" }}>Event Images</span>
              </Typography>
            </Grid>
            {viewEvent.images && viewEvent.images.length > 0 ? (
              viewEvent.images.map((imageUrl, index) => (
                <Grid item xs={12} sm={4} md={4} key={index}>
                  <img
                    src={imageUrl}
                    alt={`Event image ${index + 1}`}
                    style={{ width: "100%" }}
                  />
                </Grid>
              ))
            ) : (
              <p>No images available</p>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Card
            className="view_event_ticket"
            sx={{
              background: "#1F1F1F",
              color: "#FFF",
              width: "80%",
              float: "right",
            }}
          >
            <CardContent>
              <Typography
                variant="h4"
                sx={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Total Seats
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {viewEvent.seats}
              </Typography>
              <Typography
                variant="p"
                sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "13px" }}
              >
                Seats added by an organizer
              </Typography>
            </CardContent>
          </Card>
          <Card
            className="view_event_ticket"
            sx={{
              background: "#FFF",
              color: "#1F1F1F",
              width: "80%",
              float: "right",
              marginTop: "4%",
            }}
          >
            <CardContent>
              <Typography
                variant="h4"
                sx={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Tickets Sold
              </Typography>

              <Typography
                variant="h3"
                sx={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {totalSales}
              </Typography>

              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ticketSold}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#FD99C9" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} sx={{ marginBottom: "2%" }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textAlign: "left",
              fontWeight: "500",
              marginBottom: "1%",
            }}
          >
            Ticket Purchased by following users
          </Typography>
          <div
            className="ag-theme-alpine"
            style={{ height: 400, width: "100%" }}
          >
            <AgGridReact
              rowData={user}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={6}
              domLayout="autoHeight"
            />
          </div>
        </Grid>
      </Grid>
      <Button variant="contained" onClick={handleGoBack} sx={{ mt: 2 }}>
        Go Back
      </Button>
    </>
  );
};
export default ViewEvent;
