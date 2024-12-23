const dataBase = require("../Database/Config.js");
const {
  sendEmail,
  sendNotification,
} = require("./NotificationAndEmailController");

// Path0: Add new Student
let addStudent = (req, res) => {
  let id = tokenData.id; //GurdianID
  let bodyData = req.body;
  bodyData.guardianID = id;
  // Start Insert
  let query = `INSERT INTO students SET ?`;
  dataBase.query(query, bodyData, (error, data) => {
    if (error || !data) {
      return res.json({
        success: false,
        msg: "Failed add the student",
        error: error,
      });
    }
    //Config mail
    let configAdminEmail = {
      subject: "A new student was added",
      html: `
            <p>${tokenData.name} has added a new student.</p>
            <p>Here are the student details</p>
            <p>Student's Name : ${bodyData.name}</p>
            <p>Student's Birthday : ${bodyData.birthday}</p>
            <p>Student's Email : ${bodyData.email}</p>
            <p>Student's Phone : ${bodyData.phone}</p>
            <p>Student's Address : ${bodyData.address}</p>
            `,
    };
    //Send Email to admin
    sendEmail(configAdminEmail);
    //Send Email to guardian
    let configGuardianEmail = {
      to: tokenData.email,
      subject: "Congratulations you have completed your registration!",
      // text:''
      html: `
            <p>Assalamu alaykum,</p>
            <p>We hope you are doing well,</p>
            <p>We would like to welcome you for taking this important step and joining Waraqa. We want to assure you that your Quran and Arabic learning is our top priority and that our teachers will work with you to ensure that you progress consistently at your own pace. We are very excited to get started. Someone from our team will contact you shortly to confirm your plan snd schedule.</p>
            <p>Best regards</p>
            `,
    };
    sendEmail(configGuardianEmail);

    //Config Notification
    notiConfig = {
      type: 0,
      admin: 1,
      teacherID: null,
      guardianID: tokenData.id,
      studentID: data.insertId,
      adminMsg: `${tokenData.name} has added student ${bodyData.name} to his student list.`,
      teacherMsg: null,
      guardianMsg: `${bodyData.name} has been added to your student list.`,
    };
    //Send Notification
    sendNotification(notiConfig);

    res.json({ success: true, msg: "The student registered successfully" });
  });

  /*
    //Check Email And Name not exists in students Before
    let query = `SELECT
    EXISTS (SELECT name FROM students WHERE name = ?) AS foundName,
    EXISTS (SELECT email FROM students WHERE email = ?) AS foundEmail`
    dataBase.query(query, [bodyData.name, bodyData.email], (error, results) => {
        //If Email with name Exists
        if(results[0].foundName && results[0].foundEmail){
            return res.json({success:false, msg:"This account already exists as Student, Please check your students list"})
        //If Email Exist
        }else if(results[0].foundEmail){
            return res.json({success:false, msg:"This Email already exists as Student, Please check your students list"})
        }
        ///// INSERT Here

    });
    */
};

// Path2: Fetch one Student
let oneStudent = (req, res, next) => {
  let id = req.params.id;
  query = `SELECT students.*, guardians.name AS guardianName, guardians.paymentType AS paymentType
            FROM students
            INNER JOIN guardians
            ON students.guardianID = guardians.id
            WHERE students.id=${id}
    `;
  msg = "There are no results available to display.";
  return next();
};
// Path3: Update Student
let updateStudent = (req, res) => {
  let id = req.params.id;
  //Only admin can update any data && Authorized Guardian
  if (!isAdmin) {
    let localID = tokenData.id; // Authorized Guardian
    let query = `SELECT (SELECT COUNT(guardianID) FROM students WHERE id = ${id} AND guardianID = ${localID}) AS count`;
    dataBase.query(query, (error, data) => {
      if (error || data[0].count < 1) {
        return res.json({
          success: false,
          msg: "Soory, you don't have the perimission",
        });
      }
    });
  }

  let bodyData = req.body;
  delete bodyData.image;

  delete bodyData.createdAt;
  bodyData.startingDate =
    Number(bodyData.startingDate) == bodyData.startingDate
      ? bodyData.startingDate
      : null;
  bodyData.token =
    Number(bodyData.token) == bodyData.token ? bodyData.token : null;

  /*
    //////
    if(req.file){
        bodyData.picture = req.file.filename
    }
    //////
    */

  //cloudinary
  if (req.file) {
    bodyData.picture = req.file.path;
  }
  let query = `UPDATE students SET ? WHERE id = ${id}`;
  dataBase.query(query, [bodyData], (error, data) => {
    if (error || !data) {
      return res.json({ success: false, msg: "Failed update student" });
    }
    res.json({
      success: true,
      msg: "Great, the data have been successfully updated.",
    });
  });
};
// Path 4: Delete Student
let deleteStudent = (req, res) => {
  let id = req.params.id;
  //Only admin can delete any data && Authorized Guardian
  if (!isAdmin) {
    let localID = tokenData.id; // Authorized Guardian
    let query = `SELECT (SELECT COUNT(guardianID) FROM students WHERE id = ${id} AND guardianID = ${localID}) AS count`;
    dataBase.query(query, (error, data) => {
      if (error || data[0].count < 1) {
        return res.json({
          success: false,
          msg: "Soory, you don't have the perimission",
        });
      }
    });
  }
  let query = `DELETE FROM students WHERE id = ${id}`;
  dataBase.query(query, (error, data) => {
    if (error) {
      return res.json({
        success: false,
        msg: "Sorry, this student could not be deleted; perhaps he has a class.",
      });
    }
    res.json({
      success: true,
      msg: "The student has been successfully deleted.",
    });
  });
};

// Path 5: Add Periodic evaluations
let AddPeriodicEvaluation = (req, res) => {
  let query = `INSERT INTO periodicevaluations SET ?`;
  dataBase.query(query, req.body, (error, data) => {
    if (error || !data) {
      return res.json({ success: false, msg: "Failed add the Evaluation" });
    }
    res.json({
      success: true,
      msg: "The periodic evaluation added successfully",
    });
  });
};

// Path 6: Fetch Periodic evaluations
let fetchPeriodicEvaluation = (req, res, next) => {
  let id = req.params.id; // student ID
  query = `SELECT periodicevaluations.*, teachers.name AS teacherName, students.name AS studentName
            FROM periodicevaluations
            INNER JOIN teachers
            ON teachers.id = periodicevaluations.teacherID
            INNER JOIN students
            ON students.id = periodicevaluations.studentID
            WHERE periodicevaluations.studentID = ${id}
            ORDER BY periodicevaluations.meetingDate DESC
        `;
  msg = "There are no results available to display.";
  return next();
};

// Path 7: Wait-list
let fetchWaitListStudents = (req, res, next) => {
  let queryReq = req.query;
  let search = queryReq.search;
  let offset = queryReq.offset;
  query = `SELECT *, count(*) OVER() AS fullCount FROM waitlist
                ${search ? ` WHERE waitlist.name LIKE '%${search}%'` : ""}
                ORDER BY waitlist.createdAt DESC
                ${offset ? `LIMIT 30 OFFSET ${offset}` : ""}
                `;
  msg = "There are no results available to display.";
  return next();
};

// Path 8: Fetch Wait-list student
let fetchWaitListStudent = (req, res, next) => {
  let id = req.params.id; // student ID
  query = `SELECT * FROM waitlist WHERE id=${id}`;
  msg = "There are no results available to display.";
  return next();
};

// Path 9: Update 1 Wait-list student
let updateWaitListStudent = (req, res) => {
  let id = req.params.id; // student ID
  let bodyData = req.body;
  console.log(bodyData);
  let query = `UPDATE waitlist SET ? WHERE id = ${id}`;
  dataBase.query(query, bodyData, (error, data) => {
    if (error || !data) {
      console.log(error);
      return res.json({ success: false, msg: "Failed update student" });
    }
    res.json({
      success: true,
      msg: "Great, the data have been successfully updated.",
    });
  });
};

// Path 10: Delete 1 Wait-list student
let deleteWaitListStudent = (req, res) => {
  let id = req.params.id; // student ID
  let query = `DELETE FROM waitlist WHERE id = ${id}`;
  dataBase.query(query, (error, data) => {
    if (error) {
      return res.json({
        success: false,
        msg: "Sorry, this student could not be deleted.",
      });
    }
    res.json({
      success: true,
      msg: "The student has been successfully deleted.",
    });
  });
};

//Path 0: Fetch students of Teacher
let studentsOfTeacher = (req, res, next) => {
  let id = tokenData.id;
  let queryReq = req.query;
  let search = queryReq.search;
  let status = queryReq.status;
  let offset = queryReq.offset;
  query = `SELECT students.*,count(*) OVER() AS fullCount, guardians.name AS guardianName,
                        (SELECT SUM(classes.duration) 
                        FROM classes 
                        WHERE classes.studentID = students.id 
                        AND status=0 AND countForStudent = 1) AS hours
                    FROM students 
                    INNER JOIN classes 
                    ON classes.studentID = students.id
                    INNER JOIN guardians
                    ON students.guardianID = guardians.id
                    INNER JOIN teachers 
                    ON classes.teacherID = teachers.id 
                    WHERE classes.teacherID = ${id}
                    ${status ? ` AND students.status = ${status}` : ""}
                    ${
                      search
                        ? ` AND ( students.name LIKE '%${search}%' OR  guardians.name LIKE '%${search}%' OR  guardians.email LIKE '%${search}%' ) `
                        : ""
                    }
                    GROUP BY students.id
                    ORDER BY students.name
                    ${offset ? `LIMIT 30 OFFSET ${offset}` : ""}
                    `;
  msg = "There are no results available to display.";
  return next();
};

//Path 1: Fetch students of Guardian
let studentsOfGuardian = (req, res, next) => {
  let id = tokenData.id;
  let queryReq = req.query;
  let search = queryReq.search;
  let status = queryReq.status;
  let offset = queryReq.offset;

  query = `SELECT students.*,count(*) OVER() AS fullCount, guardians.name AS guardianName,
  (SELECT SUM(classes.duration)
                    FROM classes
                    WHERE classes.studentID = students.id AND classes.countOnInvoice = 1
                    AND classes.invoiceID IS NOT NULL
                    AND classes.countForStudent = 1
                  ) AS savedPaidHours

                    FROM students 
                    INNER JOIN guardians
                    ON students.guardianID = guardians.id
                    WHERE students.guardianID = ${id}
                    ${status ? ` AND students.status = ${status}` : ""}
                    ${
                      search
                        ? ` AND ( students.name LIKE '%${search}%' OR  guardians.name LIKE '%${search}%' OR  guardians.email LIKE '%${search}%' ) `
                        : ""
                    }
                    GROUP BY students.id
                    ORDER BY students.name
                    ${offset ? `LIMIT 30 OFFSET ${offset}` : ""}
                    `;

  msg = "There are no results available to display.";
  return next();
};

module.exports = {
  addStudent,
  oneStudent,
  updateStudent,
  deleteStudent,
  AddPeriodicEvaluation,
  fetchPeriodicEvaluation,
  fetchWaitListStudents,
  fetchWaitListStudent,
  updateWaitListStudent,
  deleteWaitListStudent,
  studentsOfTeacher,
  studentsOfGuardian,
};
