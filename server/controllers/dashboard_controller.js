const Event = require("../models/events_model");
const User = require("../models/user_model");
// ****************************
// Last week events
// *****************************
exports.getLastWeekData = async (req, res) => {
  try {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const events = await Event.find({
      date: { $gte: lastWeek, $lte: today },
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// ****************************
// current Year Registered data
// *****************************
exports.getCurrentYearUsers = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const data = await User.aggregate([
      {
        $match: {
          registrationDate: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$registrationDate" },
          users: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("en", { month: "short" }),
      users: 0,
    }));

    // Merge actual data with the allMonths array
    const mergedData = allMonths.map((monthData) => {
      const found = data.find(
        (d) => d._id === allMonths.indexOf(monthData) + 1
      );
      return found ? { ...monthData, users: found.users } : monthData;
    });

    res.status(200).json(mergedData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};
exports.getTotalTicketsSoldByDate = async (req, res) => {
  try {
    const date = await Ticket.find({date})
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
