const AuditLog = require('../models/AuditLog'); 


const logAction = async (action, entity, entityId, userId, userName, changes) => {
    try {
      const newLog = new AuditLog({
        ID, 
        timeStamp: new Date(),
        userId,
        userName,
        changes: changes // Use a Map or an object depending on your schema
      });
  
      await newLog.save();
    } catch (err) {
      console.error('Error logging action:', err);
    }
  };
  
  module.exports = logAction;