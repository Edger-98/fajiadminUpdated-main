import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import ChartCard from "../components/Chart";
import UsersChart from "../components/UsersChart";
import HomeTable from "../components/HomeTable";

import { useMediaQuery, useTheme } from "@mui/material";

const Dashboard = () => {

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
  return (
    <>
      <Typography
        variant={getVariant()}
        style={{
          fontFamily: "Montserrat, sans-serif",
          marginTop: "9%",
          marginBottom: "2%",
          textAlign: "left",
          fontWeight: "500",
        }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ marginTop: 2, width: "100%" }}>
        <Grid item xs={12} sm={6} md={6}>
          <ChartCard />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <UsersChart />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <HomeTable />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;

