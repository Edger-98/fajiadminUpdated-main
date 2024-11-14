require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connectDb = require("./utils/db");
const blogRoutes = require("./router/blog-route");
const eventsRoutes = require("./router/events_route");
const ticketsRoutes = require("./router/tickets_route");
const promocodeRoutes = require("./router/promocode_route");
const authRoutes = require("./router/auth_route");
const adminRoutes = require("./router/admin_route");
const userRoutes = require("./router/user_route");
const settingsRoutes = require("./router/settings_route");
const logsRoutes = require("./router/auditLogs_route");
const reportsRoutes = require("./router/report_route");
const emailsRoutes = require("./router/emailTemplate_route");
const notificationsRoutes = require("./router/notification_route");
const errorMiddleware = require("./middlewares/error-middleware");
const Notification = require("./models/sendNotification_model");
const financeRoutes = require("./router/finance_route");
const dashboardRoutes = require("./router/dashboard_route");
const socketIo = require("socket.io");
const http = require("http");
const cors = require("cors");
const path = require("path");
const PORT = 5000;
const server = http.createServer(app);
const io = socketIo(server);

//MiddleWare
app.use(cors());
app.use(express.json());
app.use(errorMiddleware);
app.use(bodyParser.json());
//Routes
app.use("/api", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.use("/api/events", eventsRoutes);

app.use("/api/promo", promocodeRoutes);

app.use("/api/tickets", ticketsRoutes);

app.use("/api/users", userRoutes);

app.use("/api/settings", settingsRoutes);

app.use("/api/audits", logsRoutes);

app.use("/api/reports", reportsRoutes);

app.use("/api/email-templates", emailsRoutes);

app.use("/api/app-notifications", notificationsRoutes);

app.use("/api/", financeRoutes);
app.use("/api/", dashboardRoutes);
app.use(express.static("public"));

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Handle client connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
app.post("/api/app-notifications/send-notification/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { title, date, type, description } = req.body;

    // Send notification via socket.io
    io.emit("receiveNotification", { title, description });
    console.log("Notification sent to clients via Socket.io.");

    // Save notification to the database
    const notification = new Notification({
      id: req.params.id,
      title,
      date,
      type,
      description,
    });

    const savedNotification = await notification.save();
    res.status(201).json({
      message: "Notification sent and saved successfully",
      notification: savedNotification,
    });
  } catch (error) {
    console.error("Error sending or saving notification:", error);
    res.status(500).json({
      message: "Error sending or saving notification",
      details: error.message,
    });
  }
});

//Connection with DB

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
