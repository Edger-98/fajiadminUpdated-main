import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/system";
import logo from "../assets/LogoBlack.png";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import AdminDetails from "../components/logs/AdminDetails";
import { Avatar } from "@mui/material";
import adminPic from "../assets/adminPic.png";
import AdminIcon from "@mui/icons-material/Person";
import {
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import constant from "../constant";
import { useMediaQuery, useTheme } from "@mui/material";
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  top: 0,
  bottom: "auto",
}));

const StyledToolBar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});
const StyledLogo = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const Search = styled("Box")(({ theme }) => ({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  mx: "auto",
}));
function Navbar() {
  const { userDetails, error } = AdminDetails();
  console.log(userDetails.username);

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
    return "body1";
  };
  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#fff" }}>
        <StyledToolBar>
          <StyledLogo>
            <img
              src={logo}
              alt="Logo"
              sx={{ display: { xs: "none", sm: "block" } }}
              style={{ width: "15px", marginBottom: "10px" }}
            />
            <Typography
              varient="h6"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 800,
                color: "#4E4E4E",
                display: { xs: "none", sm: "block" },
              }}
            >
              FAJI admin
            </Typography>
          </StyledLogo>
          {/* <Search>
            <TextField
              variant="outlined"
              placeholder="Search"
              fullWidth
              size="small"
              sx={{
                backgroundColor: "rgba(246, 246, 246, 0.53)",
                borderRadius: 1,
                justifyContent: "center",
                width: {
                  xs: "70%",
                  sm: "80%",
                  md: "70%",
                  lg: "80%",
                  xl: "90%",
                },
              }}
              InputProps={{
                sx: {
                  "&::placeholder": {
                    fontSize: { xs: "12px", sm: "14px", md: "16px" }, 
                    fontFamily: "Montserrat, sans-serif", 
                  },
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ fontSize: { xs: "16px", sm: "20px", md: "24px" } }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Search> */}
          <Avatar
            alt="Admin"
            src={adminPic}
            sx={{
              width: 30,
              height: 30,
              marginLeft: "auto",
              backgroundColor: "#FD99C9",
            }}
          >
            <AdminIcon />
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              color: "#4E4E4E",
              fontFamily: "Montserrat, sans-serif",
              fontSize: { xs: "11px", md: "15px" },
              display: { xs: "block", sm: "block" },
            }}
          >
            {`Hi ${userDetails.username}`}
          </Typography>
        </StyledToolBar>
      </AppBar>
    </>
  );
}

export default Navbar;
