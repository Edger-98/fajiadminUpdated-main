const Report = require("../models/reports_model");

// ***************
// Create Report
// ***************

exports.getReports = async (req, res) => {
  try {
    const report = await Report.find();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ***************
// Create Report
// ***************

exports.createReport = async (req, res) => {
  const {
    ID,
    timeStamp,
    description,
    userId,
    username,
    eventname,
    action,
    eventId,
  } = req.body;
  const newReport = await new Report({
    ID,
    timeStamp,
    description,
    userId,
    username,
    eventname,
    eventId,
    action,
  });
  try {
    const savedReport = await newReport.save();
    res.status(200).json(savedReport);
  } catch (err) {
    console.error("Error creating reports:", err);
    res
      .status(500)
      .json({ error: "Error creating reports", details: err.message });
  }
};
// ********************
// Update Report Action
// ********************
exports.updatedReportActions = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const { action, requestedDetails } = req.body;
    console.log(action);

    const report = await Report.findByIdAndUpdate(
      id,
      { action },
      { new: true }
    );

    // Validate the action
    if (action === "req_info") {
      // Handle the "req_info" action
      const report = await Report.findByIdAndUpdate(
        reportId,
        { action, additionalInfo }, // Save additional info along with the action
        { new: true }
      );

      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json({ message: "Report action updated", report });
    } else {
      // Handle other actions
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// ********************
// Event Marked as Spam
// ********************
exports.spamEvent = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const report = await Report.findByIdAndUpdate(
      id,
      { action: "Marked as Spam" },
      { new: true }
    );
    res.status(200).json({ message: "Event Marked as Spam", report });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error marked as spam event", details: error.message });
  }
};
// ********************
// Event Declined
// ********************

exports.declineEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    console.log(id);
    const report = await Report.findByIdAndUpdate(
      id,
      { action: "Declined", reason },
      { new: true }
    );
    res.status(200).json({ message: "Event declined", report });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error declining event", details: error.message });
  }
};
// ********************
// Request Info
// ********************
exports.requestInfo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { requestedDetails } = req.body;

    const report = await Report.findByIdAndUpdate(
      id,
      { action: "request-info", requestedDetails: requestedDetails},
     
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Information requested successfully", report });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error requesting information", details: error.message });
  }
};
