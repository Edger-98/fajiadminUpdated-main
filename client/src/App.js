import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Events from "./pages/Events";
import Settings from "./pages/Settings";
import "./App.css";
import Tickets from "./pages/Tickets";
import Notifications from "./pages/Notifications";
import Login from "./components/Login";
import BackgroundUpdater from "./components/BodyBackground";
import CssBaseline from "@mui/material/CssBaseline";
import { Grid, ThemeProvider, createTheme } from "@mui/material";
import ViewEvent from "./components/events/ViewEvent";
import UpdateEvent from "./components/events/UpdateEvent";
import ViewTicket from "./components/tickets/ViewTicket";
import PromoCode from "./pages/PromoCodes";
import EditPromo from "./components/tickets/EditPromo";
import EditUser from "./components/users/EditUser";
import AddPromo from "./components/tickets/AddPromo";
import AddUser from "./components/users/AddUser";
import EmailTemplateList from "./components/notifications/EmailTemplateList";
import EmailTemplateForm from "./components/notifications/EmailTemplateForm";
import PushNotificationList from "./components/notifications/PushNotificationList";
import NotificationForm from "./components/notifications/AddNotification";
import Blogs from "./pages/Blogs";
import BlogForm from "./components/blogs/BlogForm";
import Finance from "./pages/Finance";
import Audit from "./pages/Audit";
import Reports from "./pages/Reports";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("userId"));


  const handleLogout = () => {

    setIsLoggedIn(localStorage.removeItem("userId"));
   
  };

  const theme = createTheme({
    palette: {
      customColor: {
        main: "#FD99C9",
      },
    },
  });
  return (
    <>
      <Router>
        <ThemeProvider theme={theme}>
          <div className="App">
            {isLoggedIn && (
              <>
                <CssBaseline />
                <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
              </>
            )}
            <Grid container spacing={2}>
              {isLoggedIn && (
                <>
                  <Grid item xs={12} sm={3} md={3}>
                    <Sidebar onLogout={handleLogout} />
                  </Grid>
                  <Grid item xs={12} sm={9} md={9}>
                    <div className="main-content">
                      <BackgroundUpdater />
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/tickets" element={<Tickets />} />
                        <Route
                          path="/notifications"
                          element={<Notifications />}
                        />
                        <Route path="/settings" element={<Settings />} />
                        <Route
                          path="/events/view-event/:id"
                          element={<ViewEvent />}
                        />
                        <Route
                          path="/events/update-event/:id"
                          element={<UpdateEvent />}
                        />
                        <Route path="/promo" element={<PromoCode />} />
                        <Route
                          path="/promo/edit-promo/:id"
                          element={<EditPromo />}
                        />
                        <Route
                          path="/users/edit-user/:id"
                          element={<EditUser />}
                        />
                        <Route
                          path="/promo/add-promo/"
                          element={<AddPromo />}
                        />
                        <Route path="/users/add-user/" element={<AddUser />} />
                        <Route
                          path="/tickets/view-ticket/:id"
                          element={<ViewTicket />}
                        />
                        <Route
                          path="/email-templates"
                          element={<EmailTemplateList />}
                        />
                        <Route
                          path="/email-templates/create"
                          element={<EmailTemplateForm />}
                        />
                        <Route
                          path="/email-templates/edit/:id"
                          element={<EmailTemplateForm />}
                        />
                        <Route
                          path="/app-notifications"
                          element={<PushNotificationList />}
                        />
                        <Route
                          path="/app-notifications/create"
                          element={<NotificationForm />}
                        />
                        <Route
                          path="/app-notifications/edit/:id"
                          element={<NotificationForm />}
                        />
                        <Route path="/blogs" element={<Blogs />} />
                        <Route
                          path="/blogs/blog-form/create"
                          element={<BlogForm />}
                        />
                        <Route
                          path="/blogs/blog-form/edit/:id"
                          element={<BlogForm />}
                        />
                        <Route path="/finance" element={<Finance />} />
                        <Route path="/audit" element={<Audit />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/login" element={<Navigate to="/" />} />
                      </Routes>
                    </div>
                  </Grid>
                </>
              )}
              {!isLoggedIn && (
                <Grid item xs={12} sm={12} md={12}>
                  <div className="main-content">
                    <BackgroundUpdater />
                    <Routes>
                      <Route
                        path="/login"
                        element={<Login setIsLoggedIn={setIsLoggedIn} />}
                      />
                      <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                  </div>
                </Grid>
              )}
            </Grid>
          </div>
        </ThemeProvider>
      </Router>
    </>
  );
}

export default App;
