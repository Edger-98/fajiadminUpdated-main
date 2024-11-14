const Logs = require("../models/auditLogs_model");
const logsValidationSchema = require("../validators/auditLogs_Validators");
const User = require("../models/auth_model");
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

exports.getAuditLogs = async (req, res) => {
  try {
    const auditLog = await Logs.find().sort({ timeStamp: -1 });
    const formattedLogDate = auditLog.map((log) => ({
      ...log._doc,
      timeStamp: formatDate(log.timeStamp), // Format as mm/dd/yyyy
    }));
    return res.json(formattedLogDate);
   
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAuditLogs = async (req, res) => {

  const {action, ID, timeStamp, userId, userName, changes } = req.body;
 
  const newLogs = await new Logs({
    action,
    ID,
    timeStamp,
    userId,
    userName,
    changes,
  });

  try {
    const savedLogs = await newLogs.save();
    res.status(201).json(savedLogs);
  } catch (err) {
    console.error("Error creating logs:", err);
    res
      .status(500)
      .json({ error: "Error creating logs", details: err.message });
  }
};

