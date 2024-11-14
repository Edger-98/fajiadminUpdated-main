import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import constant from "../constant";
const TotalSalesCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios
      .get(`${constant.apiUrl}/registeredUsers`)
      .then((response) => {
        
        setData(response.data);
      })
      .catch((error) => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Users Registered
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Current Year
        </Typography>
        <Box sx={{ height: { xs: 200, sm: 250, md: 300, lg: 350, xl: 500 } }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='users' fill="#FD99C9" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalSalesCard;
