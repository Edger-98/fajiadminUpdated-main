import React, { useEffect, useState } from "react";
import { Typography, Grid } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useMediaQuery, useTheme } from "@mui/material";
import constant from "../constant";


const Audit = () => {
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${constant.apiUrl}/audits/audit-logs`);
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);
  const getVariant = () => {
    if (isXs) return "h5";
    if (isSm) return "h5";
    if (isMd) return "h4";
    if (isLg) return "h4";
    if (isXl) return "h3";
    return "body1"; // Default variant
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
      headerName: "User ID",
      field: "userId",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Username",
      field: "userName",
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Changes",
      field: "changes",
     
      cellRenderer: function (params) {
        return JSON.stringify(params.value);
      },
      
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };
  return (
    <Grid container spacing={1} sx={{ marginTop: "9%", marginBottom: "2%" }}>
      <Grid item xs={10} sm={10} md={10}>
        <Typography
          variant={getVariant()}
          style={{
            fontFamily: "Montserrat, sans-serif",
            textAlign: "left",
            fontWeight: "500",
          }}
        >
          Audit Logs
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <div
          className="ag-theme-alpine"
          style={{ height: "500px", width: "100%" }}
        >
          <AgGridReact
            columnDefs={columnDefs}
            rowData={logs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={6}
            domLayout="autoHeight"
          />
        </div>
      </Grid>
    </Grid>
  );
};
export default Audit;
