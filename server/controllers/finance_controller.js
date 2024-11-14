const Ticket = require("../models/tickets_model");
const Event = require("../models/events_model");
const moment = require("moment");
exports.totalRevenue = async (req, res) => {
  try {
    const totalRevenue = await Ticket.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $toDouble: {
                $substr: [
                  "$price",
                  0,
                  { $subtract: [{ $strLenCP: "$price" }, 1] },
                ],
              },
            },
          },
        },
      },
    ]);
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    res.json({ totalRevenue: revenue });
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ****************
// Profit Earned
// ****************

exports.profitEarned = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" }).lean();
    const tickets = await Ticket.find().lean();
    const totalExpense = events.reduce((sum, event) => {
      // Remove the '$' symbol and convert to float
      const expense = parseFloat(event.platform_expense.replace("$", "")) || 0;
      return sum + expense;
    }, 0);
    const totalRevenue = tickets.reduce((sum, ticket) => {
      // Remove the '$' symbol and convert to float
      const price = parseFloat(ticket.price.replace("$", "")) || 0;
      return sum + price;
    }, 0);
    const profit = totalRevenue * 0.15 - totalExpense;
    res.json({ totalProfitEarned: profit });
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
};
// ****************
// Last month revenue
// ****************
function generateDaysInMonth(month, year) {
  const days = [];
  const date = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      _id: day,
      totalAmount: 0,
    });
  }

  return days;
}
exports.lastMonthRevenue = async (req, res) => {
  const now = new Date();
  const startDate = moment().subtract(1, "months").startOf("month").toDate();
  const endDate = moment().subtract(1, "months").endOf("month").toDate();
 
  try {
    const allDays = generateDaysInMonth(
      startDate.getMonth(),
      startDate.getFullYear()
    );

    const revenueData = await Ticket.aggregate([
      {
        $match: {
          purchasedDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$purchasedDate" }, // Group by day of the month
          totalAmount: {
            $sum: {
              $toDouble: {
                $substr: [
                  "$price",
                  0,
                  { $subtract: [{ $strLenCP: "$price" }, 1] },
                ],
              },
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const result = allDays.map((day) => {
      const found = revenueData.find((rev) => rev._id === day._id);
      return found || day;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
};
// ****************
// Host Payment
// ****************

exports.totalHostPayment = async (req, res) => {
  try {
    const totalRevenueResult = await Ticket.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $toDouble: {
                $substr: [
                  "$price",
                  0,
                  { $subtract: [{ $strLenCP: "$price" }, 1] },
                ],
              },
            },
          },
        },
      },
    ]);

    const totalRevenue =
      totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
    const hostPayment = totalRevenue - totalRevenue * 0.15;
    res.json({ hostPayment });
  } catch (error) {
    res.status(500).json("error");
  }
};
// **********************
// Last month host payout
// **********************
function generateDaysInMonth(month, year) {
  const days = [];
  const date = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      _id: day,
      totalAmount: 0,
      payout:0
    });
  }

  return days;
}
exports.lastMonthHostpayout = async (req, res) => {
  const now = new Date();
  const startDate = moment().subtract(1, "months").startOf("month").toDate();
  const endDate = moment().subtract(1, "months").endOf("month").toDate();
  try {
    const payoutPercentage = 0.15;
    const allDays = generateDaysInMonth(
      startDate.getMonth(),
      startDate.getFullYear()
    );

    const revenueData = await Ticket.aggregate([
      {
        $match: {
          purchasedDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$purchasedDate" },
          totalAmount: {
            $sum: {
              $toDouble: {
                $substr: [
                  "$price",
                  0,
                  { $subtract: [{ $strLenCP: "$price" }, 1] },
                ],
              },
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const result = allDays.map((day) => {
      const found = revenueData.find((rev) => rev._id === day._id);
      const totalAmount = found ? found.totalAmount : 0;
      const payout = totalAmount - totalAmount * payoutPercentage;

      return {
        day: day._id,
        totalAmount,
        payout,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
};
