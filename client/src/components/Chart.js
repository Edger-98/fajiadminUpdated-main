import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import constant from "../constant";

const ChartCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    axios
      .get(`${constant.apiUrl}/lastWeekEvents`)
      .then((response) => {
        const events = response.data;

        // Count the number of events for each day of the last week
        const daysCount = Array(7).fill(0); // Array to store counts for each day of the week (Sun-Sat)
        events.forEach((event) => {
          const day = new Date(event.date).getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
          daysCount[day]++;
        });

        // Prepare data in the format required for the chart
        const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const formattedData = daysOrder.map((day, index) => ({
          day,
          sales: daysCount[index],
        }));

        setData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);
  console.log(data);
  return (
    <Card sx={{ Width: "100%", fontFamily: "Montserrat, sans-serif" }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Parties Requests
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Last Week
        </Typography>
        <Box sx={{ height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#FD99C9"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
