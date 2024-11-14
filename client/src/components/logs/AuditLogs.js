import React from "react";
import constant from "../../constant";
import axios from "axios";
const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(d.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  };
export const AuditLogs = async (
  ID,
  timeStamp = new Date(),
  action,
  userId,
  userName,
  changes
) => {
  try {
    const auditLogData = {
      action,
      ID,
      timeStamp,
      userId,
      userName,
      changes,
    };

    const response = await axios.post(
      `${constant.apiUrl}/audits/`,
      auditLogData
    );
    console.log("Audit log saved:", response.data);
  } catch (error) {
    console.error("Failed to log audit:", error);
  }
};
