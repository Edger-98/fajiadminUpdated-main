import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import EventIcon from "@mui/icons-material/Event";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import EmailIcon from "@mui/icons-material/Email";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FeedIcon from "@mui/icons-material/Feed";
import AppsIcon from "@mui/icons-material/Apps";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ReportIcon from "@mui/icons-material/Report";
import Logout from "./Logout";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  IconButton,
  useTheme,
  useMediaQuery,
  Box,
  Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function Sidebar({ onLogout }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const drawerContent = (
    <List sx={{ marginTop: "8%" }}>
      <ListItem button component={NavLink} to="/">
        <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText
          primary="Dashboard"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        />
      </ListItem>
      <ListItem button component={NavLink} to="/finance">
        <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
          <AccountBalanceIcon />
        </ListItemIcon>
        <ListItemText
          primary="Financial Overview"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        />
      </ListItem>
      <ListItem button component={NavLink} to="/events">
        <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
          <EventIcon />
        </ListItemIcon>
        <ListItemText
          primary="Manage Parties"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        />
      </ListItem>
      <ListItem button component={NavLink} to="/tickets">
        <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
          <ConfirmationNumberIcon />
        </ListItemIcon>
        <ListItemText
          primary="View Tickets"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        />
      </ListItem>
      <ListItem button component={NavLink} to="/promo">
        <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
          <LocalActivityIcon />
        </ListItemIcon>
        <ListItemText
          primary="PromoCodes"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        />
      </ListItem>
      <ListItem button component={NavLink} to="/users">
        <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText
          primary="Manage Users"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        />
      </ListItem>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
          <NotificationsIcon />
        </ListItemIcon>
        <ListItemText primary="Notifications" sx={{ color: "#FFF" }} />

        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ListItem component={NavLink} disablePadding to="/email-templates">
          <ListItemButton sx={{ pl: 4, color: "#FFF" }}>
            <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText primary="Email Notifications" />
          </ListItemButton>
        </ListItem>
        <ListItem component={NavLink} disablePadding to="/app-notifications">
          <ListItemButton sx={{ pl: 4, color: "#FFF" }}>
            <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary="Application Notifications" />
          </ListItemButton>
        </ListItem>
      </Collapse>
      <ListItem button component={NavLink} to="/blogs">
        <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
          <FeedIcon />
        </ListItemIcon>
        <ListItemText
          primary="Manage Blogs"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        />
      </ListItem>
      <ListItem button component={NavLink} to="/settings">
        <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText
          primary="Settings"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        />
      </ListItem>
      <ListItem button component={NavLink} to="/audit">
        <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText
          primary="Audit Logs"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        />
      </ListItem>
      <ListItem button component={NavLink} to="/reports">
        <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
          <ReportIcon />
        </ListItemIcon>
        <ListItemText
          primary="Escalations & Reports"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon sx={{ minWidth: "32px", color: "#fff" }}>
          <PowerSettingsNewIcon />
        </ListItemIcon>
        <Logout onLogout={onLogout} /> {/* Render Logout component */}
      </ListItem>
    </List>
  );
  return (
    <>
      {isMobile ? (
        <>
          <Grid item xs={12} sm={12}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              sx={{ marginTop: "20%", marginRight: "80%" }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Grid>

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            sx={{
              "& .MuiDrawer-paper": {
                backgroundColor: "#1F1F1F", // Set background color of the drawer
                color: "#fff", // Set text color for better contrast
              },
            }}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={handleDrawerToggle}
              onKeyDown={handleDrawerToggle}
            >
              {drawerContent}
            </Box>
          </Drawer>
        </>
      ) : (
        <div className="sidebar">{drawerContent}</div>
      )}
    </>
  );
}

export default Sidebar;
