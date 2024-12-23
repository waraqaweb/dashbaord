const dataBase = require("../Database/Config.js");
const { validationResult } = require("express-validator");
const moment = require("moment-timezone");

// const guardianModel = require('../Models/guardian');
// const teacherModel = require('../Models/teacher');
// const adminModel = require('../Models/admin');
const jwtSecret = require("../Secret/jwtSecret");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
// const {transporter, config} = require('./EmailConfig');
const {
  sendEmail,
  sendNotification,
} = require("./NotificationAndEmailController");
const { config } = require("dotenv");

let clientVerifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  jwt.verify(token, jwtSecret.client, (error, data) => {
    if (error || !data) {
      return res.json({
        success: false,
        msg: "Can't access without permisson.",
      });
    }
    tokenData = data;
    return next();
  });
  /*
    try {
        const token = req.header('Authorization');
        tokenData = jwt.verify(token, jwtSecret.client);
        return next();
    } catch (error) {
        res.json({ success: false, msg: "Can't access without permisson." })
        // res.status(401).send({ success: false, msg: "Can't access without permisson." })
    }
    */
};
//path0: Sign Up
let register = (req, res) => {
  /*
    step 1 : check validator(email and password>8)
    Step 2: Check User is Guardian or Teacher
        step 3 : check Email not exists in guardian/teachers
            step 3.1 : Hash password
                     step 3.1.A : Insert in DB
                        step 3.1.B Send Email
                            step 3.1.C Send token & Data
    */
  // Handel Validator Erorrs
  const formError = validationResult(req);
  if (!formError.isEmpty()) {
    let setError = formError.errors[0].msg;
    return res.json({ success: false, msg: setError });
  }

  let email = req.body.email;
  let password = req.body.password;
  let userType = req.body.userType;
  let theBody = req.body;
  delete theBody.userType; //userType shouldn't stored.

  let configAdminEmail = {};
  let notiConfig = {};
  let configEmail = {};

  //step 3 : check Email not exists in guardian/teachers before
  let query = `SELECT
    EXISTS (SELECT * FROM guardians WHERE email = ?) AS foundGuardian,
    EXISTS (SELECT * FROM teachers WHERE email = ?) AS foundTeacher`;
  dataBase.query(query, [email, email], (error, results, fields) => {
    if (error) throw error;

    //If Exist as Guardian Before
    if (results[0].foundGuardian) {
      return res.json({
        success: false,
        msg: "This account already exists as Guardian, Please Log In",
      });
      //If Exist as Teacher Before
    } else if (results[0].foundTeacher) {
      return res.json({
        success: false,
        msg: "This account already exists as Teacher, Please Log In",
      });
    }

    //Register depend on userType
    const storeUser = (table) => {
      //Hash password
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(password, salt, null, (err, hash) => {
          if (err) throw err;
          if (hash) {
            theBody.password = hash;
            //Store
            let query = `INSERT INTO ${table} SET ? `;
            dataBase.query(query, theBody, (error, results, fields) => {
              if (error || !results) {
                return res.json({
                  success: false,
                  msg: "The registration process has failed!",
                });
              }

              //Send Notification
              if (userType == "Guardian") {
                notiConfig.guardianID = results.insertId;
              } else if (userType == "Teacher") {
                notiConfig.teacherID = results.insertId;
              }
              sendNotification(notiConfig);

              //Send Email to Teacher
              sendEmail(configEmail);
              //Send Email to Admin
              sendEmail(configAdminEmail);

              return res.json({
                success: true,
                msg: "You're registered successfully",
              });
            });
          }
        });
      });
    };

    // If userType is Guardian, Store it
    if (userType == "Guardian") {
      //Config Admin Email
      configAdminEmail = {
        subject: "A new registered guardian",
        html: `
                    <p>A new guardian has registered with us. Review their details here:</p>
                    <p>Guardian's Name : ${theBody.name}</p>
                    <p>Guardian's Email : ${theBody.email}</p>
                    <p>Guardian's Phone : ${theBody.phone}</p>
                    <p>Guardian's Address : ${theBody.address}</p>
                    `,
      };
      //Config Guardian Email
      configEmail = {
        to: email,
        subject: "Welcome to Waraqa!",
        html: `
                    <p>Assalamu alaykum,</p>
                    <p>My name is Mohamed Ismail and I’m CEO at Waraqa. I wanted to reach out to welcome you and help you complete your registration process. Waraqa is a modern online teaching platform that will simplify your life and let you enhance your Quran recitation and/or memorization and/or understanding of the Arabic language and/or Islamic studies. With Waraqa, everyone can learn effectively from any device. You have successfully signed up with a guardian account. It is time to add students' data.</p>
                    <p>Best regards</p>
                    `,
      };
      // Config notification
      notiConfig = {
        type: 0,
        admin: 1,
        teacherID: null,
        guardianID: null,
        studentID: null,
        adminMsg: `${theBody.name} has registered as a ${userType}.`,
        teacherMsg: null,
        guardianMsg: `Your account has been created successfully.<br>
                Complete your registration and add students details now.`,
      };
      storeUser("guardians");
    } else if (userType == "Teacher") {
      //Config Admin Email
      configAdminEmail = {
        subject: "A new teacher registered",
        html: `
                    <p>A new teacher has registered with us. Review their details here:</p>
                    <p>Teacher's Name : ${theBody.name}</p>
                    <p>Teacher's Email : ${theBody.email}</p>
                    <p>Teacher's Phone : ${theBody.phone}</p>
                    <p>Teacher's Address : ${theBody.address}</p>
                    `,
      };
      //Config mail
      configEmail = {
        to: email,
        subject: "Welcome to Waraqa!",
        html: `
                <div style="direction:rtl; text-align:right">
                    <p>السلام عليكم</p>
                    <p>شكرا جزيلا للانضمامِك إلى مؤسسة وَرَقَة. نسأل الله أن يوفقنا وإياك لما فيه مرضاته.</p>
                    <p>يرجى التأكد من إضافة كافة بياناتك بدقة والانتظارحتى يتمكن فريق العمل من مراجعتها والتواصل معك.</p>
                    <p>جزيل الشكر لك</p>
                </div>
            `,
      };
      // Config notification
      notiConfig = {
        type: 0,
        admin: 1,
        teacherID: null,
        guardianID: null,
        studentID: null,
        adminMsg: `${theBody.name} has registered as a ${userType}.`,
        teacherMsg: `Your account has been created successfully.<br> 
                Complete your registration and add your information.`,
        guardianMsg: null,
      };
      storeUser("teachers");
    }

    // return res.send({ success: true, data: results, msg: 'New user has been created successfully.' });
  });
};

//path1: Log In
let login = (req, res) => {
  /*
    step 1 : Check validator(Email and Password>8)

    step 2: Check account exists in guardians or in teachers
        step 4 (if yes) 
            step 4.1 Compare password
            step 4.2 : Send token and Data
        step 5 (if not exist in both) send msg : account doesn't exists.
    */

  // Handel Validator Erorrs
  const formError = validationResult(req);
  if (!formError.isEmpty()) {
    let setError = formError.errors[0].msg;
    return res.json({ success: false, msg: setError });
  }
  let email = req.body.email;
  let password = req.body.password;

  //step 4.1 Compare password
  // Login Function
  let userLogin = (table, userType) => {
    //step 4.1 Compare password
    let query = `SELECT * FROM ${table} WHERE email = ? `;
    dataBase.query(query, [email], (error, data) => {
      bcrypt.compare(password, data[0].password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
          return res.json({
            success: false,
            msg: "This is an incorrect password. Please try again.",
          });
        }
        //step 4.2 : Send token and Data
        let token = jwt.sign(JSON.stringify(data[0]), jwtSecret.client);
        res.json({ success: true, userType: userType, token: token });
      });
    });
  };
  //step 2: Check account exists in guardians or in teachers
  let query = `SELECT
    EXISTS (SELECT id FROM guardians WHERE email = ?) AS foundGuardian,
    EXISTS (SELECT id FROM teachers WHERE email = ?) AS foundTeacher`;
  dataBase.query(query, [email, email], (error, results) => {
    if (error) throw error;
    //If Exist as Guardian
    if (results[0].foundGuardian) {
      //step 4.1 Compare password
      userLogin("guardians", "Guardian");
      //If Exist as Teacher
    } else if (results[0].foundTeacher) {
      //step 4.1 Compare password
      userLogin("teachers", "Teacher");
      //step 5 (if not exist in both) send msg : account doesn't exists.
    } else {
      return res.json({
        success: false,
        msg: "This account dosen't exists, please register first",
      });
    }
  });
};
let accessAcount = (req, res) => {
  let email = req.body.email;
  let table;
  let userType;
  let query = `SELECT
    EXISTS (SELECT * FROM guardians WHERE email = ?) AS foundGuardian,
    EXISTS (SELECT * FROM teachers WHERE email = ?) AS foundTeacher`;
  dataBase.query(query, [email, email], (error, results, fields) => {
    if (error) throw error;
    //If Exist as Guardian
    if (results[0].foundGuardian) {
      table = "guardians";
      userType = "Guardian";
      //If Exist as Teacher
    } else if (results[0].foundTeacher) {
      table = "teachers";
      userType = "Teacher";
      //step 5 (if not exist in both) send msg : account doesn't exists.
    } else {
      return res.json({
        success: false,
        msg: "This account dosen't exists, please register first",
      });
    }

    let query = `SELECT * FROM ${table} WHERE email = ?`;
    dataBase.query(query, email, (error, data) => {
      if (data.length) {
        let token = jwt.sign(JSON.stringify(data[0]), jwtSecret.client);
        res.json({ success: true, userType: userType, token: token });
      }
    });
  });
};

//path2: Re-check Auth [On relaod]
let recheckauth = (req, res) => {
  let id = tokenData.id;
  let email = tokenData.email;
  ///
  let userTable;
  let userType;
  let query = `SELECT
    EXISTS (SELECT * FROM guardians WHERE id = ${id} AND email = '${email}') AS foundGuardian,
    EXISTS (SELECT * FROM teachers WHERE id = ${id} AND email = '${email}') AS foundTeacher`;
  dataBase.query(query, (error, results) => {
    if (error) throw error;
    //If Exist as Guardian
    if (results[0].foundGuardian) {
      userTable = "guardians";
      userType = "Guardian";
      // return res.json({success:true, userType:'Guardian', data:data})
      //If Exist as Teacher
    } else if (results[0].foundTeacher) {
      userTable = "teachers";
      userType = "Teacher";
      //Add notification and email if teacher late to add class Report
      let query = `SELECT id, startingDate,(SELECT name FROM students WHERE id=classes.studentID) AS studentName FROM classes WHERE teacherID = ${id} AND status = 0 AND startingDate < NOW() - INTERVAL 2 DAY AND reportReminded = 0`;
      dataBase.query(query, (error, data) => {
        if (error || !data.length) {
          // return res.json({success:false, msg:"Failed send a notification to remind the teacher to add class's report."});
          return;
        }
        for (let i in data) {
          let classID = data[i].id;

          let startingDate = moment(data[i].startingDate).format(
            "dddd, D MMM , hh:mm A"
          );
          let endDate = moment(startingDate)
            .add(72, "hours")
            .format("dddd, D MMM , hh:mm A");
          let studentName = data[i].studentName;
          //Config Notification
          notiConfig = {
            type: 2,
            admin: 0,
            teacherID: id,
            guardianID: null,
            studentID: null,
            adminMsg: null,
            // teacherMsg: `We would like to inform you that class number: "${classID}" is missing your report submission.`,
            teacherMsg: `Reminder: Submit class report of (${startingDate})'s 
            class with student (${studentName}) before (${endDate})`,
            guardianMsg: null,
          };
          //Send Notification
          sendNotification(notiConfig);

          configTeacherEmail = {
            to: email,
            subject: "Class report reminder",
            html: `Reminder: Submit class report of (${startingDate})'s 
            class with student (${studentName}) before (${endDate})`,
          };
          sendEmail(configTeacherEmail);

          //Update Each class => reportReminded to = 1
          let query = `UPDATE classes SET ? WHERE id = ${classID}`;
          dataBase.query(query, { reportReminded: 1 }, (error, data) => {
            if (error || !data) {
              return res.json({ success: false, msg: "Failed update Class" });
            }
          });
        }
      });

      // // Add notification and email if classes missed for teacher
      let query2 = `SELECT id, startingDate,(SELECT name FROM students WHERE id=classes.studentID) AS studentName, (SELECT name FROM teachers WHERE id=classes.teacherID) AS teacherName FROM classes WHERE teacherID = ${id} AND status = 0 AND startingDate < now() - INTERVAL 3 DAY `;
      dataBase.query(query2, (error, data) => {
        if (error || !data.length) {
          // return res.json({success:false, msg:"Failed send a notification to remind the teacher to add class's report."});
          return;
        }
        for (let i in data) {
          let classID = data[i].id;

          let startingDate = moment(data[i].startingDate).format(
            "dddd, D MMM , hh:mm A"
          );
          let studentName = data[i].studentName;
          let teacherName = data[i].teacherName;

          //Config Notification
          notiConfig = {
            type: 2,
            admin: 1,
            teacherID: id,
            guardianID: null,
            studentID: null,
            adminMsg: `${teacherName} missed class report from (${startingDate}) with student (${studentName}).`,
            // Unfortunately, you  missed class report of (date and time)'s class with student (student name).
            teacherMsg: `Unfortunately, you missed class report of (${startingDate})'s
              class with student (${studentName}).`,
            guardianMsg: null,
          };
          //Send Notification
          sendNotification(notiConfig);

          configTeacherEmail = {
            to: email,
            subject: "Missed class report",
            html: `Unfortunately, you missed class report of (${startingDate})'s
            class with student (${studentName}).`,
          };
          sendEmail(configTeacherEmail);
          configAdminEmail = {
            subject: "Missed class report",
            html: `${teacherName} missed class report from (${startingDate}) with student (${studentName}).`,
          };
          sendEmail(configTeacherEmail);

          //Update Each class => canReport to = 0
          let query = `UPDATE classes SET ? WHERE id = ${classID}`;
          dataBase.query(query, { status: 7 });
        }
      });

      //step 5 (if not exist in both) send msg : account doesn't exists.
    } else {
      return res.json({
        success: false,
        msg: "This account doesn't exists, please register first",
      });
    }
    // return data
    dataBase.query(
      `SELECT * FROM ${userTable} WHERE id = ${id} AND email = '${email}' `,
      (error, data) => {
        if (error) throw error;
        if (data.length) {
          return res.json({ success: true, userType, data });
        }
      }
    );
  });
};

//Path3: Send Reset Password Request
let sendResetPasswordRequest = (req, res) => {
  //Step 1 Check email exists in guardians || teachers
  //Step 1.1 (if no) : Send msg => This Email doesn't exists.
  //Step 1.2 (if yes)
  // Step 1.2.A Store the Code in user
  // Step 1.2.B Send Email with the code number
  let { isAdmin, email } = req.body;
  //Step Generate token
  let code = Math.floor(Math.random() * 10000) * 1001;

  //Stepto store the code  in user
  storeToken = {
    token: code,
    // date: Date.now
  };

  //Config mail
  configEmail = {
    to: email,
    subject: "Reset Your Password",
    html: `
            <span>To reset your password, simply enter the given Code number.</span>
            <h2>${code}</h2>
        `,
  };
  //Step 1 Check email exists in guardians || teachers
  let userTable;
  let query = `SELECT
    ${
      isAdmin
        ? "EXISTS (SELECT * FROM admins WHERE email = ?) AS foundAdmin"
        : "EXISTS(SELECT * FROM guardians WHERE email = ?) AS foundGuardian, EXISTS (SELECT * FROM teachers WHERE email = ?) AS foundTeacher"
    }`;
  dataBase.query(query, [email, email], (error, results, fields) => {
    if (error) throw error;
    //If Exist as Guardian
    if (results[0].foundGuardian) {
      userTable = "guardians";
      //If Exist as Teacher
    } else if (results[0].foundTeacher) {
      //If Exist as Admin
      userTable = "teachers";
    } else if (results[0].foundAdmin) {
      userTable = "admins";
      //step 1.1 (if not exist in both) send msg : account doesn't exists.
    } else {
      return res.json({
        success: false,
        msg: "This account dosen't exists, please register first",
      });
    }

    // Step 1.2.A Store the Code in user
    dataBase.query(
      `UPDATE ${userTable} SET ? WHERE email = ?`,
      [storeToken, email],
      (error, data) => {
        if (error || !data) {
          return res.json({
            success: false,
            msg: "Failed complete rest password process! [Error:1]",
            error: error,
          });
        }
        // Step 1.2.B Send Email with the code number
        res.json({ success: true });
        return sendEmail(configEmail);
      }
    );
  });
};
//Path4: Confirm Reset Password Request
let confimrRestPassword = (req, res) => {
  let { isAdmin, email, code } = req.body;

  //Empty token from user
  emptyToken = {
    token: null,
  };

  let userTable;
  let query = `SELECT
  ${
    isAdmin
      ? "EXISTS (SELECT * FROM admins WHERE email = ?) AS foundAdmin"
      : "EXISTS(SELECT * FROM guardians WHERE email = ?) AS foundGuardian, EXISTS (SELECT * FROM teachers WHERE email = ?) AS foundTeacher"
  }`;
  dataBase.query(query, [email, email], (error, results, fields) => {
    if (error) throw error;
    //If Exist as Guardian
    if (results[0].foundGuardian) {
      userTable = "guardians";
      //If Exist as Teacher
    } else if (results[0].foundTeacher) {
      userTable = "teachers";
      //If Exist as Admin
    } else if (results[0].foundAdmin) {
      userTable = "admins";
      //step 1.1 (if not exist in both) send msg : account doesn't exists.
    } else {
      return res.json({
        success: false,
        msg: "This account dosen't exists, please register first",
      });
    }

    // Find user
    let query = `SELECT * FROM ${userTable} WHERE email = ? AND token = ?`;
    dataBase.query(query, [email, code], (error, data) => {
      if (error || !data) {
        return res.json({
          success: false,
          msg: "Code not match, Please try again.",
        });
      }
      //Empty Token
      let query = `UPDATE ${userTable} SET ? WHERE email = ? AND token = ?`;
      dataBase.query(query, [emptyToken, email, code], (error, data) => {
        console.log(error);
        console.log(data);
        if (error || !data) {
          return res.json({
            success: false,
            msg: "Failed complete rest password process! [Error:2]",
          });
        }
        //Send true as permission to change password
        return res.json({ success: true });
      });
    });
  });
};
//Path4: Reset Password (change password)
let resetPassword = (req, res) => {
  // Handel Validator Erorrs
  const formError = validationResult(req);
  if (!formError.isEmpty()) {
    let setError = formError.errors[0].msg;
    return res.json({ success: false, msg: setError });
  }

  let { email, password, isAdmin } = req.body;
  let userTable;
  let query = `SELECT
  ${
    isAdmin
      ? "EXISTS (SELECT * FROM admins WHERE email = ?) AS foundAdmin"
      : "EXISTS(SELECT * FROM guardians WHERE email = ?) AS foundGuardian, EXISTS (SELECT * FROM teachers WHERE email = ?) AS foundTeacher"
  }`;
  dataBase.query(query, [email, email], (error, results, fields) => {
    if (error) throw error;
    //If Exist as Guardian
    if (results[0].foundGuardian) {
      userTable = "guardians";
      //If Exist as Teacher
    } else if (results[0].foundTeacher) {
      userTable = "teachers";
    } else if (results[0].foundAdmin) {
      userTable = "admins";
      //step 1.1 (if not exist in both) send msg : account doesn't exists.
    } else {
      return res.json({
        success: false,
        msg: "This account dosen't exists, please register first",
      });
    }
    // Hash pass
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(password, salt, null, (err, hash) => {
        if (err) throw err;
        if (hash) {
          let password = hash;

          // Update password
          let query = `UPDATE ${userTable} SET password = ? WHERE email = ?`;
          dataBase.query(query, [password, email], (error, data) => {
            if (error || !data) {
              console.log(error);
              console.log(data);
              return res.json({
                success: false,
                msg: "Failed change password!",
              });
            }
            res.json({
              success: true,
              msg: "Password was successfully changed.",
            });
          });
        }
      });
    });
  });
};
//Path10 Admin Login
let adminLogin = (req, res) => {
  /*
    step 1 : Check validator(email and password>8)
    step 2 : Check Email(account) is exists
            step 2.1: Compare password
                    step 2.1.A : Send token
    */

  // Handel Validator Erorrs
  const formError = validationResult(req);
  if (!formError.isEmpty()) {
    let setError = formError.errors[0].msg;
    res.json({ success: false, msg: setError });
    return; // Out from callback func at all
  }
  let email = req.body.email;
  // step 2 : Check Account is exists
  let query = `SELECT * FROM admins WHERE email = '${email}'`;
  dataBase.query(query, (error, data) => {
    if (error || !data.length) {
      return res.json({
        success: false,
        msg: "This side is unavailable to you.",
      });
    }
    // step 2.1: Compare password
    bcrypt.compare(req.body.password, data[0].password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          success: false,
          msg: "Incorrect passowrd, please try again",
        });
      }
      if (isMatch) {
        // step 2.1.A Send token
        let token = jwt.sign(JSON.stringify(data[0]), jwtSecret.admin);
        res.json({ success: true, token: token });
      }
    });
  });
};
// Add ADMIN
function addAdmin(req, res) {
  /*
    step 1 : check validator(email and password>8)
    step 2 : check email not exists
            step 2.1 : Hash password
                     step 2.1.A : Insert admin in DB
    */

  // Handel Validator Errors
  const formError = validationResult(req);
  if (!formError.isEmpty()) {
    let setError = formError.errors[0].msg;
    res.json({ success: false, msg: setError });
    return; // Out from callback func at all
  }

  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  let theBody = {
    name: name,
    email: email,
  };
}
//Path 11 Re-check Auth [On relaod]
let Adminrecheckauth = (req, res) => {
  let id = tokenData.id;
  let query = `SELECT * FROM admins WHERE id = ?`;
  dataBase.query(query, [id], (error, data) => {
    if (error || !data.length) {
      return res.json({ success: false, msg: "Failed re-check auth." });
    }
    // if data => authorized and exists
    res.json({ success: true, data: data });
  });
};
let adminVerifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    tokenData = jwt.verify(token, jwtSecret.admin);
    isAdmin = true;
    return next();
  } catch (error) {
    res.json({ success: false, msg: "This side is unavailable to you." });
  }
};
let VerifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  // Verify Admin Token
  jwt.verify(token, jwtSecret.admin, (error, data) => {
    if (error || !data) {
      // return res.json({ success: false, msg: "This side is unavailable to you." })

      // Verify Client Token
      jwt.verify(token, jwtSecret.client, (error, data) => {
        if (error || !data) {
          return res.json({
            success: false,
            msg: "This side is unavailable to you.",
          });
        }
        tokenData = data;
        isAdmin = false;
        return next();
      });
    } else {
      tokenData = data;
      isAdmin = true;
      return next();
    }
  });
};

module.exports = {
  VerifyToken,
  adminVerifyToken,
  clientVerifyToken,
  register,
  login,
  recheckauth,
  sendResetPasswordRequest,
  confimrRestPassword,
  resetPassword,
  adminVerifyToken,
  adminLogin,
  Adminrecheckauth,
  accessAcount,
};
