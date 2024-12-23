const dataBase = require("../Database/Config.js");
const {
  sendEmail,
  sendNotification,
} = require("./NotificationAndEmailController");

const moment = require("moment-timezone");

let oneGuardianInvoice = (req, res, next) => {
  let id = req.params.id;
  query = `SELECT guardianinvoices.*, guardians.name AS guardianName,
    guardians.hoursPrice AS hoursPrice,
    guardians.transferPrice AS transferPrice,
    guardians.paymentType AS paymentType
                FROM guardianinvoices
                INNER JOIN guardians
                ON guardianinvoices.guardianID= guardians.id
                WHERE guardianinvoices.id = ${id}`;
  msg = "There are no results available to display.";
  return next();
};

// Function to retrieve prepaid classes based on invoice ID
let prepaidClasses = (req, res, next) => {
  let id = req.params.id; // Extract the InvoiceID from the request parameters

  // Query to fetch classes associated with the invoice ID
  // This query retrieves class details along with teacher and student names
  // Joins the following tables:
  // 1. classes
  // 2. teachers (via teacherID)
  // 3. students (via studentID)
  // 4. guardians (via guardianID from students)
  // 5. guardianinvoices (via guardianID from guardians)

  query = `SELECT classes.*, teachers.name AS teacherName, students.name AS studentName
            FROM classes 
            INNER JOIN teachers 
            ON classes.teacherID = teachers.id 
            INNER JOIN students 
            ON classes.studentID = students.id
            INNER JOIN guardians
            ON guardians.id = students.guardianID
            INNER JOIN guardianinvoices
            ON guardianinvoices.guardianID = guardians.id
            WHERE classes.countForStudent = 1 -- Ensure the class counts towards the student
            AND (classes.status=0 OR classes.status=1 OR classes.status=4) -- Include specific class statuses
            AND guardianinvoices.id = ${id} -- Filter by the given invoice ID
            AND (
                    (classes.invoiceID=${id}) -- Match classes associated with this invoice ID
                OR 
                    (classes.invoiceID IS NULL) -- Include classes with no associated invoice
                )
            ORDER BY classes.startingDate`; // Order the results by the class starting date

  // Message to display if no results are found
  msg = "There are no results available to display.";
  
  // Call the next middleware
  return next();
};

// Function to update a guardian's invoice
let updateGuardianInvoice = (req, res) => {
  let id = req.params.id; // Extract the invoice ID from the request parameters
  let bodyData = req.body; // Extract the request body containing invoice data
  let classesIDs = bodyData.classesIDs; // Extract class IDs to associate with the invoice

  // Remove unnecessary fields from the request body before updating the invoice
  delete bodyData.guardianName; 
  delete bodyData.paymentType;
  delete bodyData.classesIDs;
  delete bodyData.establishedAt;
  delete bodyData.createdAt;

  // NOTE: A potential feature to create a new invoice when paid hours equal counted hours is commented out

  // Step 1: If class IDs are provided, update the invoice association for these classes. To exclude any classes mentioned in other invoices.
 if (classesIDs) {
  dataBase.query(
    `UPDATE classes SET invoiceID = null WHERE invoiceID = ${id}`, 
    () => {
      if (bodyData.paid == 1) {
        let query = `
          UPDATE classes 
          SET ? 
          WHERE id IN (${classesIDs})
          AND (invoiceID IS NULL OR invoiceID != ${id}) 
          AND countForStudent = 1
          AND (status=0 OR status=1 OR status=4)
        `;
        let data = { invoiceID: id };
        dataBase.query(query, data);
      }
    }
  );
}

  // Step 2: Update the invoice record in the database
  let query = `UPDATE guardianinvoices SET ? WHERE id = ${id}`; // Query to update the invoice
  dataBase.query(query, bodyData, (error, data) => {
    if (error || !data) {
      // If there is an error or no data is returned, respond with a failure message
      return res.json({
        success: false,
        msg: "Failed update Invoice",
        error: error,
      });
    }
    // Respond with a success message if the update is successful
    res.json({
      success: true,
      msg: "Great, the Invoice have been successfully updated.",
    });
  });
};

let postPaidClasses = (req, res, next) => {
  let id = req.params.id; // InvoiceID
  let queryReq = req.query;

  let fromActivatedAt = queryReq.InvoiceActivatedAt;

  let firstDateOfMonth = moment(fromActivatedAt)
    .subtract(1, "months")
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss"); // first date of last month DEPEND of fromActivatedAt
  let lastDateOfMonth = moment(fromActivatedAt)
    .subtract(1, "months")
    .endOf("month")
    .format("YYYY-MM-DD HH:mm:ss"); //last date of last month DEPEND of fromActivatedAt

  query = `SELECT classes.*, teachers.name AS teacherName, students.name AS studentName
                    FROM classes 
                    INNER JOIN teachers 
                    ON classes.teacherID = teachers.id 
                    INNER JOIN students 
                    ON classes.studentID = students.id
                    INNER JOIN guardians
                    ON guardians.id = students.guardianID
                    INNER JOIN guardianinvoices
                    ON guardianinvoices.guardianID = guardians.id
                    WHERE guardianinvoices.id = ${id}
                    AND (classes.status = 1 OR classes.status = 4) AND classes.countForStudent = 1
                    AND (
                        (guardianinvoices.paid=1 AND classes.invoiceID=${id}) 
                    OR 
                        (guardianinvoices.paid!=1 AND classes.invoiceID IS NULL AND classes.startingDate BETWEEN '${firstDateOfMonth}' AND '${lastDateOfMonth}')
                    )
                    ORDER BY classes.startingDate
                    `;
  // WHERE classes.startingDate BETWEEN guardianinvoices.createdAt AND DATE_ADD(guardianinvoices.createdAt, INTERVAL 1 MONTH)
  msg = "There are no results available to display.";
  return next();
};

// Path 5: Delete Invoice
let deleteGuardianInvoice = (req, res) => {
  let id = req.params.id;

  let query = `DELETE FROM guardianinvoices WHERE id = ${id}`;
  dataBase.query(query, (error, data) => {
    if (error) {
      return res.json({
        success: false,
        msg: "Sorry, this Invoice could not be deleted.",
        error,
      });
    }
    res.json({
      success: true,
      msg: "The Invoice has been successfully deleted.",
    });
  });
};
let deleteTeacherInvoice = (req, res) => {
  let id = req.params.id;

  let query = `DELETE FROM teacherinvoices WHERE id = ${id}`;
  dataBase.query(query, (error, data) => {
    if (error) {
      return res.json({
        success: false,
        msg: "Sorry, this Invoice could not be deleted.",
        error,
      });
    }
    res.json({
      success: true,
      msg: "The Invoice has been successfully deleted.",
    });
  });
};
// Path7: Fetch One teacher's Invoice
let oneTeacherInvoice = (req, res, next) => {
  let id = req.params.id;
  //Get InoviceCreatedAt, Need it for cancelation req
  let inoviceQuery = `SELECT createdAt FROM teacherinvoices WHERE id = ${id}`;
  dataBase.query(inoviceQuery, (error, data) => {
    if (error || !data.length) {
      return res.json({ success: false, msg: "Failed find Invoice" });
    }

    let fromCreatedAt = data[0].createdAt; //InoviceCreatedAt, Need it for cancelation req
    let firstDateOfMonth = moment(fromCreatedAt)
      .subtract(1, "months")
      .startOf("month")
      .format("YYYY-MM-DD HH:mm:ss"); //last month first date
    let lastDateOfMonth = moment(fromCreatedAt)
      .subtract(1, "months")
      .endOf("month")
      .format("YYYY-MM-DD HH:mm:ss");

    //Get data
    query = `SELECT teacherinvoices.*, teachers.id AS teacherID, teachers.name AS teacherName, teachers.bonus AS autoBonus,
                    (SELECT COUNT (classesreq.teacherCancelReq)
                    FROM classesreq 
                    WHERE (classesreq.createdAt BETWEEN '${firstDateOfMonth}' AND '${lastDateOfMonth}')
                    AND classesreq.teacherID = teachers.id 
                    ) AS autoCancelationReq
    
                    FROM teacherinvoices
                    INNER JOIN teachers
                    ON teacherinvoices.teacherID= teachers.id
                    WHERE teacherinvoices.id = ${id}
                    AND teacherinvoices.active = 1
                    `;
    msg = "There are no results available to display.";
    return next();
  });
};

// Path8: Fetch Teacher Invoice Classes
// Get classes between first and last day of the previous month
let teacherInvoiceClasses = (req, res, next) => {
  let queryReq = req.query;
  let id = queryReq.teacherID; // teacherID
  let fromActivatedAt = queryReq.InvoiceActivatedAt;

  let firstDateOfMonth = moment(fromActivatedAt)
    .subtract(1, "months")
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss"); // first date of last month DEPEND of fromActivatedAt
  let lastDateOfMonth = moment(fromActivatedAt)
    .subtract(1, "months")
    .endOf("month")
    .format("YYYY-MM-DD HH:mm:ss"); //last date of last month DEPEND of fromActivatedAt
  // let firstDateOfMonth = moment(fromActivatedAt).startOf('month').format('YYYY-MM-DD HH:mm:ss'); // first date of the month DEPEND of fromActivatedAt
  // let lastDateOfMonth = moment(fromActivatedAt).endOf('month').format('YYYY-MM-DD HH:mm:ss'); //last date of the month DEPEND of fromActivatedAt

  query = `SELECT classes.*, teachers.name AS teacherName, students.name AS studentName
                    FROM classes 
                    INNER JOIN students 
                    ON classes.studentID = students.id
                    INNER JOIN teachers 
                    ON classes.teacherID = teachers.id 
                    WHERE (classes.startingDate BETWEEN '${firstDateOfMonth}' AND '${lastDateOfMonth}')
                    AND (classes.status = 1 OR classes.status = 4) AND classes.countForTeacher=1
                    AND classes.teacherID = ${id}
                    ORDER BY classes.startingDate
                    `;
  msg = "There are no results available to display.";
  return next();
};
// Path9: Update teacher's Invoice
let updateTeacherInvoice = (req, res) => {
  let id = req.params.id;
  let bodyData = req.body;
  delete bodyData.teacherID;
  delete bodyData.teacherName;
  delete bodyData.autoCancelationReq;
  delete bodyData.autoBonus;
  delete bodyData.activatedAt;
  delete bodyData.createdAt;

  let query = `UPDATE teacherinvoices SET ? WHERE id = ${id}`;
  dataBase.query(query, bodyData, (error, data) => {
    if (error || !data) {
      return res.json({
        success: false,
        msg: "Failed update Invoice",
        error: error,
      });
    }
    res.json({
      success: true,
      msg: "Great, the Invoice have been successfully updated.",
    });
  });
};
let teachersPayWages = (req, res, next) => {
  let firstDateOfLastMonth = moment()
    .subtract(1, "months")
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss"); // first date of the last month
  let lastDateOfLastMonth = moment()
    .subtract(1, "months")
    .endOf("month")
    .format("YYYY-MM-DD HH:mm:ss"); //last date of the last month

  // Get Emails of all teachers who has classes(status = 1 or 4)
  query = `SELECT DISTINCT teachers.email, teachers.id FROM teachers
            INNER JOIN classes
            ON classes.teacherID = teachers.id
            WHERE (classes.status = 1 OR classes.status = 4)
            AND (classes.startingDate BETWEEN '${firstDateOfLastMonth}' AND '${lastDateOfLastMonth}')
            `;
  dataBase.query(query, (error, data) => {
    if (error || !data.length) {
      return res.json({
        success: false,
        msg: "There are no results available to display.",
      });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////
    //Config Admin Email
    configAdminEmail = {
      subject: "Teachers payday!",
      html: `<p>Teachers have been notified that their invoices are now available on the platform.</p>`,
    };
    sendEmail(configAdminEmail);
    ////////////////////////////////////////////////////////////////////////////////////////////
    //Config Teacher Email
    configTeacherEmail = {
      to: "",
      subject: "Happy payday!",
      html: `<p>Assalamu alaykum Teacher,</p>
                <p>We hope you are doing well,</p>
                <p>We'd like to let you know that your invoice is now available on the Waraqa web platform; please for more details check bills section in your account.</p>
                <p>Best regards</p>
                `,
    };
    for (var i in data) {
      configTeacherEmail.to += data[i].email + ",";
      openNewTeacherInvoiceFunc(data[i].id);

      // // // set hours to 0
      // let query2 = `UPDATE teachers SET hours = 0 WHERE id = ${data[i].id}`;
      // dataBase.query(query2);
    }

    sendEmail(configTeacherEmail);
    ////////////////////////////////////////////////////////////////////////////////////////////
    //Config Notification
    notiConfig = {
      type: 3,
      admin: 1,
      teacherID: null,
      guardianID: null,
      studentID: null,
      adminMsg: `Teachers have been notified that their invoices are now available on the platform.`,
      teacherMsg: null,
      // teacherMsg:`We'd like to let you know that your invoice is now available on the Waraqa web platform; please for more details check bills section in your account.`,
      guardianMsg: null,
    };
    //Send Notification
    sendNotification(notiConfig);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    res.json({ success: true, msg: "Inform teachers process is successfully" });
  });
};

let openNewTeacherInvoiceFunc = (id) => {
  // Notice : First invoice of teacher is must be created on his first counted class, but incactive invoice.

  // Step1 : Check if this Teacher has students that they have [ classes(status=1 or status=4) and classes.startingdate between last and first day of last month, AND no invoice After the first of this month
  //Step2: Update the inactive invoice (active = 1)
  //Step3: Open new inactive invoice (active = 0)
  let firstDateOfLastMonth = moment()
    .subtract(1, "months")
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss"); // first date of the last month
  let lastDateOfLastMonth = moment()
    .subtract(1, "months")
    .endOf("month")
    .format("YYYY-MM-DD HH:mm:ss"); //last date of the last month

  // Step1 : Check if this Teacher has students that they have [ classes(status=1 or status=4) and classes.startingdate between last and first day of last month, AND no invoice After the first of this month
  query = `SELECT DISTINCT teachers.id, teachers.hours AS teachingHours, teacherinvoices.createdAt AS invoiceDate, teacherinvoices.id AS invoiceID
            FROM teachers
            INNER JOIN classes
            ON classes.teacherID = teachers.id
            INNER JOIN teacherinvoices
            ON teacherinvoices.teacherID = teachers.id
            WHERE teachers.id = ${id}
            AND (classes.status = 1 OR classes.status = 4) AND classes.countForTeacher=1
            AND (classes.startingDate BETWEEN '${firstDateOfLastMonth}' AND '${lastDateOfLastMonth}')
            ORDER BY teacherinvoices.createdAt DESC
            `;
  let firstDateOfThisMonth = moment()
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss"); // first date of Current month
  dataBase.query(query, (error, data) => {
    if (error) throw error;
    // let createdBeforeFirstOfThisMonth;
    // if(data.length ){
    //     createdBeforeFirstOfThisMonth = moment(data[0].invoiceDate).isBefore(firstDateOfThisMonth);
    // }
    //Create New Invoice
    // if(!data.length || (data.length && createdBeforeFirstOfThisMonth)){
    if (
      data.length &&
      moment(data[0].invoiceDate).isBefore(firstDateOfThisMonth)
    ) {
      //Step2: Update the inactive invoice (active = 1)
      let invoiceData = {
        active: 1,
        activatedAt: new Date(),
        teachingHours: data[0].teachingHours,
      };
      let invoiceID = data[0].invoiceID;
      dataBase.query(
        `UPDATE teacherinvoices SET ? WHERE id = ? `,
        [invoiceData, invoiceID],
        (error, data) => {
          if (error || !data) {
            return console.log("Failed active the invoice of the teacher!");
          }
          //Notification ////////////////////////////////////////////////////////////////////////////////////////////
          // Config Notification
          notiConfig = {
            type: 3,
            admin: null,
            teacherID: id,
            guardianID: null,
            studentID: null,
            adminMsg: null,
            teacherMsg:
              "We'd like to let you know that your invoice is now available on the Waraqa web platform; please for more details check bills section in your account.",
            guardianMsg: null,
          };
          //Send Notification
          sendNotification(notiConfig);
          //////////////////////////////////////////////////////////////////////////////////////////////////////////

          // // set hours to 0
          let query2 = `UPDATE teachers SET hours = 0 WHERE id = ${id}`;
          dataBase.query(query2);
          //Open new inactive Invoice
          let invoiceData = {
            teacherID: id,
          };
          //Step3: Open new inactive invoice (active = 0)
          dataBase.query(
            `INSERT INTO teacherinvoices SET ? `,
            [invoiceData],
            (error, data) => {
              if (error || !data) {
                return;
              }
            }
          );
        }
      );
    } else {
      return;
    }
  });
};
// Active & Open new
let openNewTeacherInvoice = (req, res) => {
  let id = req.params.id;
  openNewTeacherInvoiceFunc(id);
  res.json({ msg: "done" });
};

let billsOfTeacher = (req, res, next) => {
  let id = tokenData.id;

  let queryReq = req.query;
  let status = queryReq.status;
  let search = queryReq.search;
  let offset = queryReq.offset;
  query = `SELECT teacherinvoices.*, count(*) OVER() AS fullCount, teachers.name AS teacherName, 
                    (SELECT SUM(classes.duration) 
                    FROM classes 
                    WHERE classes.teacherID = teachers.id 
                    AND (status = 1 OR status = 4) AND classes.countForTeacher=1) AS minutes
                FROM teacherinvoices
                INNER JOIN teachers
                ON teacherinvoices.teacherID = teachers.id
                WHERE teacherinvoices.teacherID = ${id}
                AND teacherinvoices.active = 1
                ${
                  search
                    ? Number(search) == search
                      ? `AND teacherinvoices.invoiceNumber LIKE '${search}'`
                      : ` AND teachers.name LIKE '%${search}%' `
                    : ""
                }
                ${status ? ` AND teacherinvoices.paid = ${status}` : ""}

                ORDER BY teacherinvoices.createdAt
                ${offset ? `LIMIT 30 OFFSET ${offset}` : ""}
                `;
  msg = "There are no results available to display.";
  return next();
};

let billsOfGuardian = (req, res, next) => {
  let id = tokenData.id;

  let queryReq = req.query;
  let status = queryReq.status;
  let search = queryReq.search;
  let offset = queryReq.offset;

  query = `SELECT guardianinvoices.*, count(*) OVER() AS fullCount, guardians.name AS guardianName, guardians.paymentType AS paymentType
                FROM guardianinvoices
                INNER JOIN guardians
                ON guardianinvoices.guardianID = guardians.id
                WHERE guardians.id = ${id}
                AND guardianinvoices.active = 1
                ${
                  search
                    ? Number(search) == search
                      ? `AND guardianinvoices.invoiceNumber LIKE '${search}'`
                      : ` AND guardians.name LIKE '%${search}%' `
                    : ""
                }

                ${status ? ` AND guardianinvoices.paid = ${status}` : ""}
                ORDER BY guardianinvoices.createdAt
                ${offset ? `LIMIT 30 OFFSET ${offset}` : ""}
                `;
  msg = "There are no results available to display.";
  return next();
};

let guardianPaymentReq = (req, res) => {
  //Get emails of guardian that their payment type is "postpaid", and has students that they have [ classes(status=1 or status=4) and classes.startingDate between first and last date of last month
  let firstDateOfLastMonth = moment()
    .subtract(1, "months")
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss"); // first date of the last month
  let lastDateOfLastMonth = moment()
    .subtract(1, "months")
    .endOf("month")
    .format("YYYY-MM-DD HH:mm:ss"); //last date of the last month

  // let firstDateOfMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'); // first date of Current month
  // let lastDateOfMonth = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'); //last date of Current month

  query = `SELECT DISTINCT guardians.email FROM guardians
                INNER JOIN students
                ON students.guardianID = guardians.id
                INNER JOIN classes
                ON classes.studentID = students.id
                WHERE guardians.paymentType=2
                AND (classes.status = 1 OR classes.status = 4) AND classes.countForStudent = 1
                AND (classes.startingDate BETWEEN '${firstDateOfLastMonth}' AND '${lastDateOfLastMonth}')
    `;
  dataBase.query(query, (error, data) => {
    if (error || !data.length) {
      return res.json({
        success: false,
        msg: "There are no results available to display.",
      });
    }
    // ////////////////////////////////////////////////////////////////////////////////////////////
    // //Config Admin Email
    // configAdminEmail = {
    //   subject: "A new invoice",
    //   html: `<p>Guardians(Postpaid) have been notified that their invoices are now available on the platform.</p>
    //             `,
    // };
    // sendEmail(configAdminEmail);
    // ////////////////////////////////////////////////////////////////////////////////////////////
    // //Config Teacher Email
    // configGuardianEmail = {
    //   to: "",
    //   subject: "A new invoice",
    //   html: `
    //             <p>Assalamu alaykum,</p>
    //             <p>We hope you are doing well,</p>
    //             <p>We'd like to let you know that your invoice is now available on the Waraqa web platform; please for more details check bills section in your account.</p>
    //             <p>Best regards</p>
    //             `,
    // };
    // for (var i in data) {
    //   configGuardianEmail.to += data[i].email + ",";
    // }

    // sendEmail(configGuardianEmail);
    ////////////////////////////////////////////////////////////////////////////////////////////
    //Config Notification
    notiConfig = {
      type: 3,
      admin: 1,
      teacherID: null,
      guardianID: null,
      studentID: null,
      adminMsg: `Guardians(Postpaid) have been notified that their invoices are now available on the platform.`,
      teacherMsg: null,
      // teacherMsg:`We'd like to let you know that your invoice is now available on the Waraqa web platform; please for more details check bills section in your account.`,
      guardianMsg: `Your invoice is due. Here's a summary of this month's classes:
(((Previous classes report)))`,
    };
    //Send Notification
    sendNotification(notiConfig);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    res.json({ success: true, msg: "Inform teachers process is successfully" });
  });
};

const changeClassInvoiceCount = (req, res) => {
  let query = `UPDATE classes SET ? WHERE id=${req.params.id}`;
  const CurrentCountOnInvoice = req.body.CurrentCountOnInvoice;
  dataBase.query(
    query,
    { countOnInvoice: CurrentCountOnInvoice === 1 ? 2 : 1 },
    (error, data) => {
      if (error) {
        return res.json({
          success: false,
          msg: `error ${
            CurrentCountOnInvoice === 1 ? "removing" : "adding"
          } the class from the invoice.`,
          error: error,
        });
      }
      res.json({
        success: true,
        msg: `This class ${
          CurrentCountOnInvoice === 1 ? "removed from" : "added to"
        } the invoice.`,
      });
    }
  );
};
// query = `SELECT classes.*, teachers.name AS teacherName, students.name AS studentName
//                     FROM classes
//                     INNER JOIN teachers
//                     ON classes.teacherID = teachers.id
//                     INNER JOIN students
//                     ON classes.studentID = students.id
//                     INNER JOIN guardians
//                     ON guardians.id = students.guardianID
//                     INNER JOIN guardianinvoices
//                     ON guardianinvoices.guardianID = guardians.id
//                     WHERE guardianinvoices.id = ${id}
//                     AND (classes.status = 1 OR classes.status = 4) AND classes.countForStudent = 1
//                     AND (
//                         (guardianinvoices.paid=1 AND classes.invoiceID=${id})
//                     OR
//                         (guardianinvoices.paid!=1 AND classes.invoiceID IS NULL AND classes.startingDate BETWEEN '${firstDateOfMonth}' AND '${lastDateOfMonth}')
//                     )
//                     ORDER BY classes.startingDate
//                     `;
let activatePostPaidGuardianInvoice = (req, res) => {
  let id = req.params.id;
  //Get the Invoice creted before the first of this month, if this guardian has students that they have [ classes(status=1 or status=4)
  let firstDateOfThisMonth = moment()
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss"); // first date of Current month

  let query = `SELECT DISTINCT guardians.id,guardians.name,guardians.email,guardianinvoices.id AS invoiceID
                FROM guardians
                INNER JOIN students
                ON students.guardianID = guardians.id
                INNER JOIN classes
                ON classes.studentID = students.id
                INNER JOIN guardianinvoices
                ON guardianinvoices.guardianID = guardians.id
                WHERE guardians.id=${id}
                AND guardians.paymentType = 2
                AND (classes.status = 1 OR classes.status = 4) AND classes.countForStudent = 1
                AND guardianinvoices.active = 0
                AND guardianinvoices.createdAt < '${firstDateOfThisMonth}'
                ORDER by guardianinvoices.createdAt DESC
    `;
  dataBase.query(query, (error, data) => {
    if (error || !data.length) {
      return res.json({ success: false, msg: "There are no Invoice inactive" });
    }
    let guardianID = data[0].id;
    let guardianEmail = data[0].email;
    let guardianName = data[0].name;
    let invoiceID = data[0].invoiceID;
    let activeData = {
      active: 1,
      activatedAt: new Date(),
    };
    dataBase.query(
      `UPDATE guardianinvoices SET ? WHERE id=${invoiceID}`,
      [activeData],
      (error, data) => {
        if (error || !data) {
          return res.json({
            success: false,
            msg: "There are no Invoice inactive",
          });
        }
        activeData.activatedAt;

        let firstDateOfMonth = moment(activeData.activatedAt)
          .subtract(1, "months")
          .startOf("month")
          .format("YYYY-MM-DD HH:mm:ss"); // first date of last month DEPEND of fromActivatedAt
        let lastDateOfMonth = moment(activeData.activatedAt)
          .subtract(1, "months")
          .endOf("month")
          .format("YYYY-MM-DD HH:mm:ss"); //last date of last month DEPEND of fromActivatedAt

        let query = `SELECT classes.* FROM classes 
        INNER JOIN students 
        ON classes.studentID = students.id
        INNER JOIN guardians
        ON guardians.id = students.guardianID
        INNER JOIN guardianinvoices
        ON guardianinvoices.guardianID = guardians.id
        WHERE guardianinvoices.id = ${invoiceID}
        AND (classes.status = 1 OR classes.status = 4) AND classes.countForStudent = 1
        AND (guardianinvoices.paid!=1 AND classes.invoiceID IS NULL AND classes.startingDate BETWEEN '${firstDateOfMonth}' AND '${lastDateOfMonth}')
        ORDER BY classes.startingDate`;
        dataBase.query(query, (error, data) => {
          if (error) return;

          let dueHours = null;
          if (data[0]) {
            data.forEach((obj) => {
              if (obj.duration) dueHours += parseInt(obj.duration);
            });
          }
          let expectedUpcomingClasses = data ? [] : null;
          for (i in data) {
            expectedUpcomingClasses.push(
              moment(data[i]?.startingDate).format("dddd, D MMM , hh:mm A")
            );
          }
          expectedUpcomingClasses = expectedUpcomingClasses.join(" <br/> ");

          //Notification ////////////////////////////////////////////////////////////////////////////////////////////
          // Config Notification
          notiConfig = {
            type: 3,
            admin: null,
            teacherID: null,
            guardianID,
            studentID: null,
            adminMsg: `Send (${guardianName}) a new invoice. His remaining hours are (${
              dueHours ? dueHours : "No classes Hours"
            }) and this is a summary of the last month classes:
            ${
              expectedUpcomingClasses
                ? expectedUpcomingClasses
                : "No Previous classes "
            }`,
            teacherMsg: null,
            guardianMsg: `Your invoice is due. Here's a summary of this month's classes: ${
              expectedUpcomingClasses
                ? expectedUpcomingClasses
                : "No Previous classes "
            }`,
            // guardianMsg:
            //   "We'd like to let you know that your invoice is now available on the Waraqa web platform; please for more details check bills section in your account.",
          };
          //Send Notification
          sendNotification(notiConfig);
          //////////////////////////////////////////////////////////////////////////////////////////////////////////
          configGuardianEmail = {
            to: guardianEmail,
            subject: "A new invoice",
            html: `Your invoice is due. Here's a summary of this month's classes: ${
              expectedUpcomingClasses
                ? expectedUpcomingClasses
                : "No Previous classes "
            }`,
          };
          sendEmail(configGuardianEmail);

          configAdminEmail = {
            subject: "A new invoice",
            html: ` <p>Send (${guardianName}) a new invoice. His remaining hours are (${
              dueHours ? dueHours : "No classes Hours"
            }) and this is a summary of the last month classes:
                      ${
                        expectedUpcomingClasses
                          ? expectedUpcomingClasses
                          : "No Previous classes "
                      }</p>
                      `,
          };
          sendEmail(configAdminEmail);
        });
      }
    );
  });
  // WHERE guardians.paymentType=2
};

//Path 1: Bill of Guardian sent
let sentInvoice = (req, res) => {
  let id = req.params.id;
  let { isSent } = req.body;
  dataBase.query(
    `UPDATE guardianinvoices SET ? WHERE id=${id}`,
    { isSent: isSent ? 0 : 1 },
    (error, data) => {
      if (error || !data) {
        return res.json({
          success: false,
          msg: "There are no Invoice inactive",
          error,
        });
      }
      return res.json({ success: true, msg: "Invoice sent to the client" });
    }
  );
};

let addInvoice = (req, res) => {
  let query = `INSERT INTO guardianinvoices SET ?`;
  dataBase.query(query, req.body, (error, data) => {
    if (error) {
      return res.json({
        success: false,
        msg: "Couldn't create the invoice",
        error,
      });
    }
    return res.json({ success: true, msg: "Invoice created" });
  });
};

module.exports = {
  oneGuardianInvoice,
  prepaidClasses,
  updateGuardianInvoice,
  postPaidClasses,
  deleteGuardianInvoice,
  deleteTeacherInvoice,
  oneTeacherInvoice,
  teacherInvoiceClasses,
  updateTeacherInvoice,
  teachersPayWages,
  openNewTeacherInvoice,
  billsOfTeacher,
  billsOfGuardian,
  guardianPaymentReq,
  activatePostPaidGuardianInvoice,
  sentInvoice,
  changeClassInvoiceCount,
  addInvoice,
};
