const Event = require("../models/events_model");
const User = require("../models/user_model");
const fs = require("fs");
const upload = require("../uploads");
const path = require("path");
const eventValidationSchema = require("../validators/event_Validators");
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
exports.fetchTotalEvents = async (req, res) => {
  
  try {
    const totalEvents = await Event.countDocuments();
    res.json({ totalEvents });
  } catch (error) {}
};


// Fetch events with optional status filter
exports.getEvents = async (req, res) => {
  try {
    const { status } = req.query; // Get the status filter from query parameters

    let query = {}; // Default query to get all events

    if (status) {
      query.status = status;
    }

    const events = await Event.find(query);
    const formattedEventDate = events.map((event) => ({
      ...event._doc,
      date: formatDate(event.date),
    }));
    return res.json(formattedEventDate);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" }); // Handle errors
  }
};

// *****************
// Get Event By Id
// *****************

exports.getEventById = async (req, res) => {
  // const { id } = req.params;

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res
      .status(500)
      .json({ error: "Error fetching event", details: err.message });
  }
};
// *****************
// Create events
// *****************

exports.createEvent = async (req, res) => {
  try {
    const {
      userId,
      eventTitle,
      date,
      time,
      seats,
      location,
      price,
      description,
      event_organizer,
      status,
      platform_expense,
    } = req.body;
    const imageUrls = req.files.map(
      (file) => `${process.env.SERVER_URL}/Images/${path.basename(file.path)}`
    );
    console.log(
      "File paths:",
      req.files.map((file) => file.path)
    );

    const newEvent = new Event({
      userId,
      eventTitle,
      date,
      time,
      seats,
      location,
      price,
      description,
      images: imageUrls,
      event_organizer,
      status,
      platform_expense,
    });

    try {
      const savedEvent = await newEvent.save();
      return res.status(201).json(savedEvent); // Ensure return here
    } catch (err) {
      console.error("Error creating event:", err);
      return res
        .status(500)
        .json({ error: "Error creating event", details: err.message }); // Ensure return here
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message }); // Ensure return here
  }
};

// *****************
// Get approved events
// *****************
exports.getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.findOne({ status: "approved" });
    console.log(events.status);
    res.json(events);
  } catch (error) {
    res.status(500).send("Server error");
  }
};
// *****************
// Update event status
// *****************
exports.updatedEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log(status);
    const eventId = req.params.id;
    console.log(eventId);
    const event = await Event.findByIdAndUpdate(
      eventId,
      { status },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event status updated", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// *****************
// needInfo status
// *****************
exports.needInfo = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findByIdAndUpdate(
      eventId,
      { status: "req_info" },
      { new: true }
    );
    res.status(200).json({ message: "Event need info ", event });
  } catch (error) {
    res.status(500).json({ error: "Error event need info" });
  }
};

// *****************
// Decline Event
// *****************

exports.declineEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { reason } = req.body;

    const event = await Event.findByIdAndUpdate(
      eventId,
      { status: "declined", reason },
      { new: true }
    );
    res.status(200).json({ message: "Event declined", event });
  } catch (error) {
    res.status(500).json({ error: "Error declining event" });
  }
};

// *****************
// Update Event
// *****************

exports.updateEvent = async (req, res) => {
  try {
    const { status } = req.body;
    const eventId = req.params.id;
    const updatedData = req.body;

    const event = await Event.findByIdAndUpdate(eventId, updatedData, {
      new: true,
    });

    res.status(200).json({ message: "Event updated", event });
  } catch (error) {
    res.status(500).json({ error: "Error updating event" });
  }
};

// *****************
// Delete Event
// *****************

exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", err);
    res
      .status(500)
      .json({ error: "Error deleting event", details: err.message });
  }
};

// *******************************
// GET /api/events?status=upcoming
// *******************************
exports.eventsStatus = async (req, res) => {
  const { status } = req.query;
  try {
    if (status === "upcoming") {
      events = await Event.find({ date: { $gte: new Date() } });
    } else if (status === "expired") {
      events = await Event.find({ date: { $lt: new Date() } });
    } else {
      events = await Event.find({});
    }

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// *******************************
// Events Stats
// *******************************


// ******************
// get total seats
// *****************

exports.totalSeats = async (req, res) => {
  try {
    const totalSeats = await Event.aggregate([
      { $group: { _id: null, totalSeats: { $sum: "$seats" } } },
    ]);
    console.log(totalSeats);
    res.status(200).json({ totalSeats: totalSeats[0]?.totalSeats || 0 });
  } catch (err) {
    console.error("Error fetching total seats:", err);
    res
      .status(500)
      .json({ message: "Error fetching total seats", details: err.message });
  }
};
