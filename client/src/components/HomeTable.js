import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Link,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import VisibilityIcon from "@mui/icons-material/Visibility";
import constant from "../constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const createData = (title, date, time, seats, location, price, status) => {
  return { title, date, time, seats, location, price, status };
};


const DataTable = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchEvents = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${constant.apiUrl}/events`);
      console.log(response.data);
      const filteredEvents = response.data.filter(
        (event) => event.status === "approved" || event.status === "pending"
      );
      setEvents(filteredEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); 
    }
  };
  useEffect(() => {
    fetchEvents(); 
  }, []);
 
  const handleViewEvent = (eventId) => {
    navigate(`events/update-event/${eventId}`); 
  };
  return (
    <TableContainer component={Paper}>
      <Typography
        variant="h5"
        component="div"
        sx={{ marginTop: "4%", marginBottom: "2%" }}
      >
        Latest Parties
      </Typography>
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Time</TableCell>
            <TableCell align="left">Seats</TableCell>
            <TableCell align="left">Location</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.eventTitle}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {event.eventTitle}
              </TableCell>
              <TableCell align="left">{event.date}</TableCell>
              <TableCell align="left">{event.time}</TableCell>
              <TableCell align="left">{event.seats}</TableCell>
              <TableCell align="left">{event.location}</TableCell>
              <TableCell align="left">{event.price}</TableCell>
              <TableCell align="left">
                {event.status === "approved" ? (
                  <CheckCircleIcon style={{ color: "green" }} />
                ) : (
                  <PendingIcon style={{ color: "orange" }} />
                )}
              </TableCell>
              <TableCell align="left">
               
                  <Button variant="text" size="small" onClick={() => handleViewEvent(event._id)}>
                    <VisibilityIcon />
                  </Button>
                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
