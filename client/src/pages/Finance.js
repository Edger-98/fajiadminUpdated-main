import React, { useEffect, useState } from "react";
import { Grid, Typography, Card, CardContent, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";
import constant from "../constant";
import CountUp from "react-countup";
import { useMediaQuery, useTheme } from "@mui/material";

const Finance = () => {
  const [hostPayment, setHostPayment] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState([]);
  const [lastMonthHostpayout, setLastMonthHostpayout] = useState([]);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));
  useEffect(() => {
    const fetchTotalEvents = async () => {
      try {
        const fetchTicket = await axios.get(
          `${constant.apiUrl}/events/totalEvents`
        );
        setTotalEvents(fetchTicket.data);
        console.log(fetchTicket.data); // This will log the total events data
      } catch (error) {
        console.error("Error fetching total events:", error);
      }
    };

    fetchTotalEvents();
  }, []);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const fetchRevenue = await axios.get(`${constant.apiUrl}/totalRevenue`);
        setTotalRevenue(fetchRevenue.data.totalRevenue);
        console.log(fetchRevenue.data); // This will log the total events data
      } catch (error) {
        console.error("Error fetching total events:", error);
      }
    };

    fetchTotalRevenue();
  }, []);

  useEffect(() => {
    const fetchTotalProfit = async () => {
      try {
        const fetchTotalProfit = await axios.get(`${constant.apiUrl}/profit`);
        setTotalProfit(fetchTotalProfit.data.totalProfitEarned);
        console.log(fetchTotalProfit.data); // This will log the total events data
      } catch (error) {
        console.error("Error fetching total events:", error);
      }
    };

    fetchTotalProfit();
  }, []);
  useEffect(() => {
    const fetchTotalHostPayment = async () => {
      try {
        const fetchHostPayment = await axios.get(
          `${constant.apiUrl}/hostPayment`
        );
        setHostPayment(fetchHostPayment.data.hostPayment);
      } catch (error) {
        console.error("Error fetching total events:", error);
      }
    };

    fetchTotalHostPayment();
  }, []);
  console.log(hostPayment);
  useEffect(() => {
    const fetchLastMonthRevenue = async () => {
      try {
        const lastMonthRevenue = await axios.get(`${constant.apiUrl}/revenue`);
        const data = lastMonthRevenue.data;
        const days = data.map((day) => `Day ${day._id}`);
        const sales = data.map((day) => day.totalAmount);
        setLastMonthRevenue(lastMonthRevenue.data);
      } catch (error) {
        console.error("Error fetching last month revenue:", error);
      }
    };

    fetchLastMonthRevenue();
  }, []);
  console.log(lastMonthRevenue);
  useEffect(() => {
    const fetchLastMonthHostPayment = async () => {
      try {
        const response = await axios.get(`${constant.apiUrl}/lastMonthPayout`);
        setLastMonthHostpayout(response.data);
      } catch (error) {
        console.error("Error fetching last month host payment:", error);
      }
    };

    fetchLastMonthHostPayment();
  }, []);
  console.log(lastMonthHostpayout);
  const getVariant = () => {
    if (isXs) return "h5";
    if (isSm) return "h5";
    if (isMd) return "h4";
    if (isLg) return "h4";
    if (isXl) return "h3";
    return "body1"; // Default variant
  };
  return (
    <>
      <Typography
        variant={getVariant()}
        style={{
          fontFamily: "Montserrat, sans-serif",
          marginTop: "9%",
          textAlign: "left",
          fontWeight: "500",
        }}
      >
        Financial Overview
      </Typography>
      <Grid container spacing={3} sx={{ marginTop: "4%" }}>
        <Grid item xs={12} sm={12} md={4}>
          <Card sx={{ fontFamily: "Montserrat, sans-serif", padding: "2%" }}>
            <CardContent>
              <Typography variant="h6" align="left">
                Total Revenue
              </Typography>
              <Typography variant="h4" align="left" sx={{ marginTop: "5%" }}>
                $<CountUp start={0} end={totalRevenue} duration={2.5} />
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "13px",
                  textAlign: "left",
                  fontWeight: "300",
                  marginTop: "5%",
                }}
              >
                Total revenue generated so far by the company
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ marginTop: "5%" }}>
            <CardContent>
              <Typography variant="h6" align="left">
                Profit Earned
              </Typography>
              <Typography variant="h4" align="left" sx={{ marginTop: "5%" }}>
                $<CountUp start={0} end={totalProfit} duration={2.5} />
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "13px",
                  textAlign: "left",
                  fontWeight: "300",
                  marginTop: "5%",
                }}
              >
                Total fees collected so far by the company
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={8}>
          <Card sx={{ fontFamily: "Montserrat, sans-serif" }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Revenue
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Last Month
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={lastMonthRevenue}
                    margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="totalAmount"
                      stroke="#FD99C9"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Host Payouts
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Last Month
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={lastMonthHostpayout}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="payout" fill="#FD99C9" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} spacing={2} sm={12} md={4}>
          <Card sx={{ fontFamily: "Montserrat, sans-serif", padding: "2%" }}>
            <CardContent>
              <Typography variant="h6" align="left">
                Total Hosts Payments
              </Typography>
              <Typography variant="h4" align="left" sx={{ marginTop: "5%" }}>
                $<CountUp start={0} end={hostPayment} duration={2.5} />
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "13px",
                  textAlign: "left",
                  fontWeight: "300",
                  marginTop: "5%",
                }}
              >
                Total payouts to hosts so far by the company
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ marginTop: "5%" }}>
            <CardContent>
              <Typography variant="h6" align="left">
                Organized Parties
              </Typography>
              <Typography variant="h4" align="left" sx={{ marginTop: "5%" }}>
                <CountUp
                  start={0}
                  end={totalEvents.totalEvents}
                  duration={2.5}
                />
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "13px",
                  textAlign: "left",
                  fontWeight: "300",
                  marginTop: "5%",
                }}
              >
                Total parties organized so far by the company
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Finance;
