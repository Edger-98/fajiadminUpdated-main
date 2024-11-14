const Ticket = require("../models/tickets_model");
const User = require("../models/user_model");
const Event = require("../models/events_model");
const mongoose = require("mongoose");

const ticketValidationSchema = require("../validators/tickets_Validators");
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// *************
// Get All Ticket
// *************
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    const formattedTicketDate = tickets.map((ticket) => ({
      ...ticket._doc,
      purchasedDate: formatDate(ticket.purchasedDate), // Format as mm/dd/yyyy
    }));
    return res.json(formattedTicketDate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteTicket = async (req, res) => {
  const { ticketId, userId } = req.params;

  try {
    // Find and delete the ticket
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Count the remaining tickets purchased by the user
    const ticketCount = await Ticket.countDocuments({ userId });

    // Update the user's ticketsPurchased count
    await User.findOneAndUpdate(
      { _id: userId },
      { ticketsPurchased: ticketCount },
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .json({ message: "Ticket deleted successfully", deletedTicket });
  } catch (err) {
    console.error("Error deleting ticket:", err);
    res
      .status(500)
      .json({ error: "Error deleting ticket", details: err.message });
  }
};
// *************
// Create Ticket
// *************
exports.createTicket = async (req, res) => {
  const {
    userId,
    eventId,
    ticketId,
    partyName,
    userName,
   
    price,
    promoCode,
  } = req.body;
  const newTicket = await new Ticket({
    userId,
    eventId,
    ticketId,
    partyName,
    userName,
    purchasedDate,
    price,
    promoCode,
  });

  try {
    await newTicket.save();
    const ticketCount = await Ticket.countDocuments({ userId });
    console.log(ticketCount);
    console.log();
    // Update the user's ticketsPurchased count
    await User.findOneAndUpdate(
      { _id: userId },
      { ticketsPurchased: ticketCount },
      { new: true, runValidators: true }
    );

    res.status(201).json(newTicket);
  } catch (err) {
    console.error("Error creating ticket:", err);
    res
      .status(500)
      .json({ error: "Error creating ticket", details: err.message });
  }
};
// *******************
// Get Ticket by id
// *******************
exports.getTicketById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const event = await Event.findById(ticket.eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json({
      ...ticket.toObject(),
      organizerName: event.event_organizer, // Directly using the string field
    });
  } catch (err) {
    console.error("Error fetching ticket:", err);
    res
      .status(500)
      .json({ error: "Error fetching ticket", details: err.message });
  }
};
// *********************
// Filter events
// *********************
exports.filterTickets = async (req, res) => {
  const { filter, value } = req.query;
  const filterOptions = {
    event: { eventId: value },
    user: { userId: value },
    date: { purchaseDate: new Date(value) },
  };
  try {
    const filterTicket = await Ticket.find(filterOptions[filter]);
    res.status(200).json(filterTicket);
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
};
// exports.getTotalTicketsSold = async (req, res) => {
//   const { eventId } = req.params;

//   console.log("eventId received:", eventId); // Debugging line

//   if (!eventId || !mongoose.isValidObjectId(eventId)) {
//     return res.status(400).json({ error: "Invalid event ID" });
//   }

//   try {
//     const count = await Ticket.countDocuments({ eventId: eventId });
//     if (count === 0) {
//       return res
//         .status(404)
//         .json({ message: "No tickets found for this event." });
//     }
//     return res.status(200).json({ totalTicketsSold: count });
//   } catch (error) {
//     console.error("Error calculating total tickets sold:", error);
//     return res
//       .status(500)
//       .json({ error: "An error occurred while calculating tickets sold." });
//   }
// };
exports.getTotalTicketsSold = async (req, res) => {
  const { eventId } = req.params;

  console.log("eventId received:", eventId); // Debugging line

  if (!eventId || !mongoose.isValidObjectId(eventId)) {
    return res.status(400).json({ error: "Invalid event ID" });
  }

  try {
    // Group tickets by the day they were sold and count the total for each day
    const ticketSalesByDate = await Ticket.aggregate([
      { $match: { eventId: new mongoose.Types.ObjectId(eventId) } }, // Match the event ID
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$purchasedDate" }, // Group by date
          },
          ticketsSold: { $sum: 1 }, // Count tickets
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    if (ticketSalesByDate.length === 0) {
      return res
        .status(404)
        .json({ message: "No tickets found for this event." });
    }

    return res.status(200).json({ ticketSalesByDate });
  } catch (error) {
    console.error("Error calculating total tickets sold:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while calculating tickets sold." });
  }
};
// In your ticket controller file
exports.getUsersByEventId = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    // Find all tickets for the event
    const tickets = await Ticket.find({ eventId: eventId }).select('userId');
    
    if (tickets.length === 0) {
      return res.status(404).json({ error: "No tickets found for this event" });
    }
    
    // Extract userIds from tickets
    const userIds = tickets.map(ticket => ticket.userId);
    
    // Find users by userIds
    const users = await User.find({ _id: { $in: userIds } });
    
    if (users.length === 0) {
      return res.status(404).json({ error: "No users found for these tickets" });
    }
    
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error fetching users", details: err.message });
  }
};
