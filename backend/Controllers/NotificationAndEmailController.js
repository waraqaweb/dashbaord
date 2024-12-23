const dataBase = require("../Database/Config.js");
const nodemailer = require("nodemailer");

let EMAILS_ENABLED = false;

let appEmail = "waraqaweb@gmail.com";
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: appEmail,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = (config) => {
  if (!EMAILS_ENABLED) {
    console.log("emails are disabled");
    return false;
  }
  config.from = appEmail;
  if ("to" in config == false) {
    config.to = appEmail; //Send to admin email
  }
  //Send Email
  transporter.sendMail(config, function (error, sent) {
    if (!sent || error) {
      console.log("Failed send to Email", error);
    } else {
      console.log("Email sent");
    }
  });
  return true;
};

const isEmailsEnabled = (req, res) => {
  res.json({
    msg: EMAILS_ENABLED ? "emails are enabled" : "emails are disabled",
    status: EMAILS_ENABLED,
  });
};

const enableEmails = (req, res) => {
  let { enable } = req.body;
  EMAILS_ENABLED = enable;
  res.send(enable ? "emails are enabled" : "emails are disabled");
};

const sendNotification = ({
  type = "NULL",
  admin = "NULL",
  teacherID = "NULL",
  guardianID = "NULL",
  studentID = "NULL",
  adminMsg = "NULL",
  teacherMsg = "NULL",
  guardianMsg = "NULL",
}) => {
  let dataBody = {
    type: type,
    admin: admin,
    teacherID: teacherID,
    guardianID: guardianID,
    studentID: studentID,
    adminMsg: adminMsg,
    teacherMsg: teacherMsg,
    guardianMsg: guardianMsg,
  };
  let query = `INSERT INTO notifications SET ?`;
  dataBase.query(query, dataBody, (error, data) => {
    if (error || !data) {
      // return res.json({success:false, msg:"Failed add Notification", error:error});
      console.log("Failed add Notification");
    } else {
      console.log("The notification saved successfully");
    }
    // res.json({success:true, msg:"The notification saved successfully"});
  });
};

//Path1: getNotifications
let getNotifications = (req, res, next) => {
  let queryReq = req.query;
  let type = queryReq.type;
  if (queryReq.admin && isAdmin) {
    query = `SELECT * FROM notifications WHERE admin = 1 ${
      type ? ` AND type = ${type}` : ""
    }  ORDER BY createdAt DESC`;
  } else if (queryReq.userID && queryReq.userType == "Teacher") {
    query = `SELECT * FROM notifications WHERE teacherID = ${
      queryReq.userID
    }  ${type ? ` AND type = ${type}` : ""} ORDER BY createdAt DESC`;
  } else if (queryReq.userID && queryReq.userType == "Guardian") {
    query = `SELECT * FROM notifications WHERE guardianID = ${
      queryReq.userID
    } ${type ? ` AND type = ${type}` : ""}  ORDER BY createdAt DESC`;
  }

  msg = "There are no results available to display.";
  return next();
};

const deleteNotification = (req, res) => {
  let id = req.params.id;
  let query = `DELETE FROM notifications WHERE id = ${id}`;
  dataBase.query(query, (error, data) => {
    if (error) {
      return res.json({
        success: false,
        msg: "Sorry, this notification could not be deleted!",
        error: error,
      });
    }
    res.json({
      success: true,
      msg: "The notification has been successfully deleted.",
    });
  });
};
const seenNotification = (req, res) => {
  let id = req.params.id;
  let query = `UPDATE notifications SET ? WHERE id = ${id}`;
  dataBase.query(query, req.body, (error, data) => {
    if (error || !data) {
      return res.json({
        success: false,
        msg: "Failed update the notification!",
        error: error,
      });
    }
    res.json({ success: true, msg: "The notification seen successfully" });
  });
};

module.exports = {
  sendEmail,
  sendNotification,
  getNotifications,
  deleteNotification,
  seenNotification,
  enableEmails,
  isEmailsEnabled,
};
