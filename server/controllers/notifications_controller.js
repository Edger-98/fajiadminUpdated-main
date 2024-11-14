const Notification = require("../models/notification_model");
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
// ************
// Get All notification
// ****************

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    const formattedDate = notifications.map((notification) => ({
      ...notification._doc,
      date: formatDate(notification.date),
    }));
    res;
    return res.json(formattedDate);
    res.json(notifications);
  } catch (error) {
    res.status(400).json("error");
  }
};

// *********************
// Get notification by ID
// **********************
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (err) {
    console.error("Error fetching notification:", err);
    res
      .status(500)
      .json({ error: "Error fetching notification", details: err.message });
  }
};

// ************
// Add notification
// ****************

exports.addNotification = async (req, res) => {
  const { title, date, type, description } = req.body;
  const newNotification = await new Notification({
    title,
    date,
    type,
    description,
  });
  try {
    const savedNotification = await newNotification.save();
    res.json(savedNotification);
  } catch (error) {
    res.json(error);
  }
};

// ******************
// upadte notification
// ********************

exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const updatedData = req.body;
    const notification = await Notification.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json({ message: "Notification updated", notification });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating Notification", details: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res
      .status(500)
      .json({ error: "Error deleting notification", details: err.message });
  }
};
