const dataBase = require("../Database/Config.js");
const {
  sendEmail,
  sendNotification,
} = require("./NotificationAndEmailController");
const moment = require("moment-timezone");

// Path2: Fetch One Class
let oneClass = (req, res, next) => {
  let id = req.params.id;
  query = `SELECT classes.*,reportsubjects.*, teachers.name AS teacherName, teachers.classLink AS classLink, students.name AS studentName,
                    (SELECT studentCancelReq FROM classesreq WHERE classID = ${id} LIMIT 1) AS studentCancelReq,
                    (SELECT teacherCancelReq FROM classesreq WHERE classID = ${id} LIMIT 1) AS teacherCancelReq
            FROM classes
            INNER JOIN teachers
            ON classes.teacherID = teachers.id
            INNER JOIN students
            ON classes.studentID = students.id
            LEFT JOIN reportsubjects
            ON classes.id = reportsubjects.classID

            WHERE classes.id = ${id}
    `;
  // I replaced INNER to LEFT for ability to delete student from class
  msg = "There are no results available to display.";
  return next();
};
// Path3: End Class (Add Class report)
let endClass = (req, res) => {
  let id = req.params.id; // class id
  //Only admin can end any class && Authorized teacher
  if (!isAdmin) {
    let localID = tokenData.id; // Authorized teacher
    let query = `SELECT (SELECT COUNT(teacherID) FROM classes WHERE id = ${id} AND teacherID = ${localID}) AS count`;
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
  let dataClassTable = bodyData[0];
  let dataReportTable = bodyData[1];
  dataReportTable.classID = id;
  dataReportTable.report = 1;

  let studentID = dataClassTable.studentID;
  let teacherID = dataClassTable.teacherID;
  let scheduleID = dataClassTable.scheduleID;

  let guardianID;

  // add attended hours to student and teacher
  const query1 = `SELECT countForStudent,countForTeacher,status FROM classes WHERE id = ${id}`;
  dataBase.query(query1, (error, data) => {
    if (error || !data) {
      return res.json({ success: false, msg: "Failed to get class" });
    }

    const classStatus = dataClassTable.status.toString();
    const currentClassStatus = data[0].status.toString();
    let addHours = 0;
    if (
      ["1", "4"].includes(classStatus) &&
      !["1", "4"].includes(currentClassStatus)
    ) {
      addHours = 1;
    } else if (
      ["2", "3", "5", "6"].includes(classStatus) &&
      ["1", "4"].includes(currentClassStatus)
    ) {
      addHours = 2;
    }

    if (addHours !== 0) {
      if (data[0].countForTeacher === 1) {
        const query1 = `UPDATE teachers SET hours = hours ${
          addHours === 2 ? "-" : "+"
        } (SELECT duration FROM classes WHERE id = ${id}) WHERE id = ${teacherID}`;
        dataBase.query(query1, (error, data) => {
          if (error || !data) {
            return res.json({
              success: false,
              msg: "Failed update hours for teacher",
            });
          }
        });
      }
      if (data[0].countForStudent === 1) {
        const query1 = `UPDATE students SET attendedHours = attendedHours ${
          addHours === 2 ? "-" : "+"
        } (SELECT duration FROM classes WHERE id = ${id}) WHERE id = ${studentID}`;
        dataBase.query(query1, (error, data) => {
          if (error || !data) {
            return res.json({
              success: false,
              msg: "Failed update hours for student",
            });
          }
        });
      }
    }
  });

  //Step1: Update into class table
  // Step2: Insert into reportsubjects table
  // Step3: Check if guardian payment type is "Prepaid"
  // --------------- Step4: Check the invoice isn't active
  //Step4: Check Invoice exists (Exist during first add classes)
  // ---------- Step5: Active the Invoice (update active = 1, enough need to do that after end first class) & Inform Guardian (email)
  //Step5: Active the invoice IF :
  // => "Paid hours of last paid invoice" - "submit classes(status = 1 or 4 and count for student)" of all students of this guardian = 0
  // => Previous invoice(Will the First) is inactive
  //Step5.1: Get startingDate of first not paid class of this guardian
  //Step5.2: Open a new active Invoice(createdAt = startingDate(Step5.1)).
  //Step6: ------CANCELLED------ Check if this class is the last
  //Step7: ----CANCELLED----- Re-add classes
  //Step 6: Add next class If this class scheduled (scheduleID)

  //Step1: Update into class table
  let query = `UPDATE classes SET ? WHERE id = ${id}`;
  dataBase.query(query, dataClassTable, (error, data) => {
    if (error || !data) {
      return res.json({ success: false, msg: "Failed update Class", error });
    }
    // Step2: Insert into reportsubjects table
    let query = `INSERT INTO reportsubjects SET ?`;
    dataBase.query(query, dataReportTable, (error, data) => {
      if (error || !data) {
        return res.json({
          success: false,
          msg: "Failed add subject to report",
        });
      }
      // Step3: Check if guardian payment type is "Prepaid"
      query = `SELECT guardians.paymentType, guardians.email, guardians.id,guardians.hoursPrice,
      students.name AS studentName, guardians.name AS guardianName,
       (SELECT email FROM teachers WHERE id = ${teacherID}) AS teacherEmail,
       (SELECT name FROM teachers WHERE id = ${teacherID}) AS teacherName
                    FROM guardians
                    INNER JOIN students
                    ON students.guardianID = guardians.id
                    WHERE students.id = ${studentID}
            `;
      dataBase.query(query, (error, data) => {
        if (error) {
          return res.json({ success: false, msg: "Failed Find guardian Info" });
        } else if (data.length) {
          guardianID = data[0].id;
          let invoiceStatus;
          let guardianEmail = data[0].email;
          let studentName = data[0].studentName;
          let teacherEmail = data[0].teacherEmail;
          let teacherName = data[0].teacherName;
          let guardianName = data[0].guardianName;
          let hoursPrice = data[0].hoursPrice;
          //Check if guardian payment type is "Prepaid"
          if (data[0].paymentType == 1) {
            //Step4: Check Invoice exists
            let query = `SELECT * FROM guardianinvoices WHERE guardianID = ${guardianID} ORDER BY guardianinvoices.createdAt DESC`;
            dataBase.query(query, (error, data) => {
              if (error) {
                return res.json({
                  success: false,
                  msg: "Failed find the Invoice",
                });
              }
              if (data.length) {
                //Invoice that created on first class
                // let invoicePaid = data[0].paid;
                const found = data.find(invoice => parseInt(invoice.paid) == 2);
                const isAllInvoicePaid = found ? false : true

                invoiceStatus = data[0].active;
                //Step5: If "Paid hours of last paid invoice" - "submit classes(status = 1 or 4 and count for student)" of all students of this guardian = 0 FROM last invoice : Active the invoice
                let query = `SELECT 
                                (SELECT SUM(students.attendedHours) 
                                FROM students
                                WHERE guardianID = ${guardianID}) AS hours,
        
                                (SELECT SUM(savedPaidHours)
                                    FROM guardianinvoices
                                    WHERE guardianinvoices.guardianID = ${guardianID}
                                    AND guardianinvoices.paid = 1
                                    ) AS savedPaidHours,
                                
                                (SELECT startingDate 
                                    FROM classes WHERE classes.scheduleID=${scheduleID} AND (classes.status=1 OR classes.status = 4) AND classes.countForStudent = 1 ORDER BY startingDate DESC LIMIT 1) AS startingDate`;
                dataBase.query(query, bodyData, (error, data) => {
                  if (error || !data.length) {
                    return console.log("Failed find students hours!");
                  }

                  //Active In case A-B = 0 OR In case First class (invoice active = 0)
                  // let lastCountedStartingDate = data[0].startingDate;
                  let allHoursIsZero = false;
                  let paidHours = data[0].savedPaidHours
                    ? parseInt(data[0].savedPaidHours)
                    : 0;
                  let hours = parseInt(data[0].hours);
                  if (paidHours - hours <= 0) allHoursIsZero = true;

                  if (allHoursIsZero || invoiceStatus == 0) {
                    let query = `UPDATE guardianinvoices SET active = 1 WHERE guardianID = ${guardianID}`;
                    dataBase.query(query, bodyData, (error, data) => {
                      if (error || !data) {
                        return res.json({
                          success: false,
                          msg: "Failed active the Invoice",
                        });
                      }

                      ////////////////////////////////////////////////////////////////////////////////////////////
                      //Config Guardian Email
                      configGuardianEmail = {
                        to: guardianEmail,
                        subject: "A new invoice",
                        html: `
                          <p>Assalamu alaykum,</p>
                          <p>We hope you are doing well,</p>
                          <p>We'd like to let you know that your invoice is now available on the Waraqa web platform; please for more details check bills section in your account.</p>
                          <p>Best regards</p>
                                                    `,
                      };
                      sendEmail(configGuardianEmail);
                      ////////////////////////////////////////////////////////////////////////////////////////////
                    });
                  }
                  // check if class starting date between invoice createdAT and payEvery of gaurdian
                  if (
                    allHoursIsZero &&
                    invoiceStatus == 1 &&
                    // invoicePaid == 1
                    isAllInvoicePaid
                  ) {
                    //Step5.1: Get startingDate of first not paid class (invoiceID IS NULL) of this guardian
                    let query = `SELECT classes.*
                                    FROM classes
                                    INNER JOIN students
                                    ON classes.studentID = students.id
                                    INNER JOIN guardians
                                    ON guardians.id = students.guardianID
                                    WHERE guardians.id = ${guardianID}
                                    AND (classes.invoiceID IS NULL)
                                    AND (classes.status=0 OR classes.status=1 OR classes.status = 4) AND countForStudent = 1
                                    ORDER BY classes.startingDate`;
                    dataBase.query(query, (error, data) => {
                      if (error || !data.length) {
                        return console.log(
                          "Failed find start not paid classes"
                        );
                      }
                      let totalHours = 0;
                      data.forEach(
                        (obj) => (totalHours += parseInt(obj.duration))
                      );
                      let saveData = {
                        active: 1,
                        guardianID,
                        createdAt: data[0].startingDate,
                        savedPaidHours: totalHours,
                      };

                      //Step5.2: Open a new active Invoice(createdAt = startingDate(Step5.1)).
                      dataBase.query(
                        `INSERT INTO guardianinvoices SET ?`,
                        saveData,
                        (error, data) => {
                          if (error || !data) {
                            return res.json({
                              success: false,
                              msg: "Failed Open new invoice[5]",
                            });
                          }

                          notiConfig = {
                            type: 3,
                            admin: 1,
                            teacherID: null,
                            guardianID,
                            studentID: null,
                            adminMsg: `Send (${guardianName}) a new invoice. His remaining hours are 0 or less.`,
                            teacherMsg: null,
                            guardianMsg: `Your paid hours have been completed.
                            The due amount: (${
                              totalHours == null
                                ? "No upcoming hours"
                                : (totalHours / 60) * hoursPrice
                            })
                            Check your new invoice details for more information about last payment period and the new one. All data are recorded on your billing details page.`,
                          };
                          sendNotification(notiConfig);
                        }
                      );
                    });
                    // });
                  }
                });
              }
            });
          }

          //Step 6: Add next class If this class scheduled (scheduleID)
          if (scheduleID > 0) {
            // Get lastClassDate
            let lastClassDate;
            let queryLas = `SELECT startingDate FROM classes WHERE scheduleID=${scheduleID} ORDER BY startingDate DESC LIMIT 1`;
            dataBase.query(queryLas, (error, data) => {
              if (error || !data.length) {
                return console.log("Failed find last class date");
              }
              lastClassDate = data[0].startingDate;

              let query = `SELECT * FROM scheduledclasses WHERE id = ${scheduleID}`;
              dataBase.query(query, (error, data) => {
                if (error || !data.length) {
                  // return res.json({success:false, msg:""});
                  console.log("Faild find scheduled classes!");
                } else {
                  let classes = [];
                  let daysTime = {};
                  let selectedDays = {};
                  if (data[0].Sun) {
                    daysTime.Sun = data[0].Sun;
                    selectedDays.Sun = "Sun";
                  }
                  if (data[0].Mon) {
                    daysTime.Mon = data[0].Mon;
                    selectedDays.Mon = "Mon";
                  }
                  if (data[0].Tue) {
                    daysTime.Tue = data[0].Tue;
                    selectedDays.Tue = "Tue";
                  }
                  if (data[0].Wed) {
                    daysTime.Wed = data[0].Wed;
                    selectedDays.Wed = "Wed";
                  }
                  if (data[0].Thu) {
                    daysTime.Thu = data[0].Thu;
                    selectedDays.Thu = "Thu";
                  }
                  if (data[0].Fri) {
                    daysTime.Fri = data[0].Fri;
                    selectedDays.Fri = "Fri";
                  }
                  if (data[0].Sat) {
                    daysTime.Sat = data[0].Sat;
                    selectedDays.Sat = "Sat";
                  }
                  // 2- Weekly Classes Start
                  let start = moment(lastClassDate).format("YYYY-MM-DD");
                  let end = moment(lastClassDate).add(data[0].payEvery, "M");

                  //Convert times to array
                  let timesOfDays = Object.values(daysTime);
                  // timesOfDays = timesOfDays.filter(item => item !== "");

                  //Convert days to array
                  let selectedDaysArray = Object.values(selectedDays);
                  // selectedDaysArray = selectedDaysArray.filter(item => item !== "");

                  for (let i = 0; i < selectedDaysArray.length; i++) {
                    // var day = moment(this.startingDate).day(selectedDaysArray[i]);
                    let day = moment(
                      start + " " + moment(timesOfDays[i]).format("HH:mm")
                    ).day(selectedDaysArray[i]);

                    if (moment(day).isBefore(start)) day.add(7, "d");
                    while (day.isBefore(end)) {
                      let weeklyClass = {
                        teacherID: data[0].teacherID,
                        studentID: data[0].studentID,
                        subject: data[0].subject,
                        classTitle: data[0].classTitle,
                        startingDate: day.format("YYYY-MM-DD HH:mm").toString(),
                        duration: data[0].duration,
                        guests: data[0].guests,
                        description: data[0].description,
                        timeZone: data[0].timeZone,
                        countForTeacher: data[0].countForTeacher ? 1 : 0,
                        countForStudent: data[0].countForStudent ? 1 : 0,
                      };
                      classes.push(weeklyClass);
                      day.add(7, "d");
                    }
                  }
                  classes = classes.sort(function (a, b) {
                    return new Date(a.startingDate) - new Date(b.startingDate);
                  });

                  let nextClass = classes[1];
                  // Add scheduleID
                  nextClass.scheduleID = scheduleID;

                  // Step5: Save The Next Class
                  let query = `INSERT INTO classes SET ? `;
                  dataBase.query(query, nextClass, (error, data) => {
                    if (error || !data) {
                      // return res.json({success:false, msg:"Failed store classes", error:error});
                      console.log("Failed store classes!", error);
                    } else {
                      console.log("Great, the next class have been added.");
                    }
                  });
                }
              });
            });
          }

          let query = `SELECT status FROM classes WHERE studentID = ${studentID} AND startingDate < NOW() ORDER BY startingDate DESC LIMIT 2`;
          dataBase.query(query, (error, data) => {
            if (error || !data.length) return;
            // Check if second time in row of missed by the student
            if (data[1]?.status == 4 && data[0].status == 4) {
              //Send Notification
              notiConfig = {
                type: 2,
                admin: 1,
                teacherID,
                guardianID,
                studentID: null,
                adminMsg: `${studentName} missed two or more consequent classs.`,
                teacherMsg: `Thank you for reporting ${studentName}'s repeated absence. Don't worry, we will contact them.`,
                guardianMsg: `${teacherName} told us that (${studentName}) has missed two or more classes. We hope everything is going well at your end. We are concerned about you and your progress. Feel free to contact us anytime via whatsapp or phone.`,
              };
              sendNotification(notiConfig);
              // Send Email
              configGuardianEmail = {
                to: guardianEmail,
                subject: "Repeated missed class",
                html: `${teacherName} told us that (${studentName}) has missed two or more classes. We hope everything is going well at your end. We are concerned about you and your progress. Feel free to contact us anytime via whatsapp or phone.`,
              };
              sendEmail(configGuardianEmail);

              configTeacherEmail = {
                to: teacherEmail,
                subject: "Repeated missed class",
                html: `Thank you for reporting ${studentName}'s repeated absence. Don't worry, we will contact them.`,
              };
              sendEmail(configTeacherEmail);

              configAdminEmail = {
                subject: "Repeated missed class",
                html: `${studentName} missed two or more consequent classs.`,
              };
              sendEmail(configAdminEmail);
              // check if missed by the student send email and notification
            } else if (data[0].status == 4) {
              //Send Notification
              notiConfig = {
                type: 2,
                admin: 0,
                teacherID,
                guardianID,
                studentID: null,
                adminMsg: null,
                teacherMsg: `Thank you for reporting ${studentName}'s absence.`,
                guardianMsg: `${studentName} missed today's class. We hope everything is going well.`,
              };
              sendNotification(notiConfig);

              // Send email
              configGuardianEmail = {
                to: guardianEmail,
                subject: "Missed class",
                html: `${studentName} missed today's class. We hope everything is going well.`,
              };
              sendEmail(configGuardianEmail);

              configTeacherEmail = {
                to: teacherEmail,
                subject: "Student missed class",
                html: `Thank you for reporting ${studentName}'s absence.`,
              };
              sendEmail(configTeacherEmail);
            }
          });
        }
      });

      res.json({
        success: true,
        msg: "Great, the class have been successfully submited.",
      });
    });
  });
};
// Path4: Update Class
let updateClass = (req, res) => {
  let id = req.params.id; // class id

  /////////// F U N C T I O N S //////////////////////////////////////
  let rescheduleApprovedLogic = () => {
    let teacherID = req.body.teacherID;
    let studentID = req.body.studentID;
    let studentName = req.body.studentName;
    let teacherName = req.body.teacherName;
    let requesterName = req.body.requesterName;
    let data = {};
    data.startingDate = moment(req.body.startingDate).format(
      "YYYY-MM-DD HH:mm:ss"
    );

    if ("teacherReschedule" in req.body)
      data.teacherReschedule = req.body.teacherReschedule;
    if ("studentReschedule" in req.body)
      data.studentReschedule = req.body.studentReschedule;

    let query = `UPDATE classes SET ? WHERE id = ${id}`;
    dataBase.query(query, data, (error, data) => {
      if (error || !data) {
        return res.json({ success: false, msg: "Failed update Class", error });
      }
      let startingDate = moment(req.body.startingDate).format(
        "ddd, D MMM YYYY, HH:mm"
      );
      let oldStartingDate = moment(req.body.oldStartingDate).format(
        "ddd, D MMM YYYY, HH:mm"
      );

      let query = `SELECT classes.*, guardians.name AS guardianName,
                                                (SELECT email FROM teachers WHERE id = ${teacherID}) AS teacherEmail,
                                                (SELECT guardianID FROM students WHERE id = ${studentID}) AS guardianID,
                                                (SELECT guardians.email
                                                FROM students 
                                                INNER JOIN guardians
                                                ON students.guardianID = guardians.id
                                                WHERE students.id = ${studentID}) AS guardianEmail
                        FROM classes
                        LEFT JOIN teachers
                        ON classes.teacherID = teachers.id
                        LEFT JOIN students
                        ON classes.studentID = students.id
                        LEFT JOIN guardians
                        ON students.guardianID = guardians.id
                        WHERE classes.id = ${id}
                        `;
      dataBase.query(query, (error, data) => {
        if (error || !data.length) {
          return console.log("No data");
        }
        let teacherEmail = data[0].teacherEmail;
        let guardianEmail = data[0].guardianEmail;
        let guardianID = data[0].guardianID;

        ////////////////////////////////////////////////////////////////////////////////////////////
        //Config Admin Email
        configAdminEmail = {
          subject: "Rescheduling request is approved",
          html: `
                        <p>Admin approved the ${requesterName}'s request to change ${oldStartingDate}'s class's number : "${id}" with ${
            requesterName == teacherName
              ? `the student "${studentName}"`
              : `the teacher "${teacherName}"`
          } to be ${startingDate}</p>
                        `,
        };
        sendEmail(configAdminEmail);
        ////////////////////////////////////////////////////////////////////////////////////////////
        //Config Teacher Email
        configTeacherEmail = {
          to: teacherEmail,
          subject: "Rescheduling request is approved",
          html: `
                        <p>Assalamu alaykum,</p>
                        <p>We hope you are doing well,</p>
                        <p>Admin approved the ${requesterName}'s request to change ${oldStartingDate}'s class's number : "${id}" with ${
            requesterName == teacherName
              ? `the student "${studentName}"`
              : `the teacher "${teacherName}"`
          } to be ${startingDate}</p>
                        <p>Best regards</p> 
                        `,
        };
        sendEmail(configTeacherEmail);
        ////////////////////////////////////////////////////////////////////////////////////////////
        //Config Guardian Email
        configGuardianEmail = {
          to: guardianEmail,
          subject: "Rescheduling request is approved",
          html: `
                        <p>Assalamu alaykum,</p>
                        <p>We hope you are doing well,</p>
                        <p>Admin approved the ${requesterName}'s request to change ${oldStartingDate}'s class's number : "${id}" with ${
            requesterName == teacherName
              ? `the student "${studentName}"`
              : `the teacher "${teacherName}"`
          } to be ${startingDate}</p>
                        <p>Best regards</p> 
                        `,
        };
        sendEmail(configGuardianEmail);
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        //Config Notification
        notiConfig = {
          type: 1,
          admin: 1,
          teacherID: teacherID,
          guardianID: guardianID,
          studentID: studentID,
          adminMsg: `Admin approved the ${requesterName}'s request to change ${oldStartingDate}'s class's number : "${id}" with ${
            requesterName == teacherName
              ? `the student "${studentName}"`
              : `the teacher "${teacherName}"`
          } to be ${startingDate}`,
          teacherMsg: `Admin approved the ${requesterName}'s request to change ${oldStartingDate}'s class's number : "${id}" with ${
            requesterName == teacherName
              ? `the student "${studentName}"`
              : `the teacher "${teacherName}"`
          } to be ${startingDate}`,
          guardianMsg: `Admin approved the ${requesterName}'s request to change ${oldStartingDate}'s class's number : "${id}" with ${
            requesterName == teacherName
              ? `the student "${studentName}"`
              : `the teacher "${teacherName}"`
          } to be ${startingDate}`,
        };
        //Send Notification
        sendNotification(notiConfig);
      });
      res.json({
        success: true,
        msg: "Great, the Class have been successfully updated.",
      });
    });
  };
  let cancellationApproved = () => {
    let teacherID = req.body.teacherID;
    let studentID = req.body.studentID;
    let startingDate = moment(req.body.startingDate).format(
      "ddd, D MMM YYYY, HH:mm"
    );
    let query = `SELECT classesreq.*, teachers.name AS teacherName, students.name AS studentName, guardians.name AS guardianName,
                                            (SELECT email FROM teachers WHERE id = ${teacherID}) AS teacherEmail,
                                            (SELECT guardianID FROM students WHERE id = ${studentID}) AS guardianID,
                                            (SELECT name FROM students WHERE id = ${studentID}) AS studentName,
                                            (SELECT guardians.email
                                            FROM students 
                                            INNER JOIN guardians
                                            ON students.guardianID = guardians.id
                                            WHERE students.id = ${studentID}) AS guardianEmail
                    FROM classesreq
                    INNER JOIN classes
                    ON classesreq.classID = classes.id
                    LEFT JOIN teachers
                    ON classesreq.teacherID = teachers.id
                    LEFT JOIN students
                    ON classesreq.studentID = students.id
                    LEFT JOIN guardians
                    ON classesreq.guardianID = guardians.id
                    WHERE classesreq.classID = ${id}
                    AND (studentCancelReq = 1 OR teacherCancelReq = 1)
                    `;
    dataBase.query(query, (error, data) => {
      if (error || !data.length) {
        return console.log("No Cancellation request");
      }
      let teacherEmail = data[0].teacherEmail;
      let guardianEmail = data[0].guardianEmail;
      let guardianID = data[0].guardianID;
      let teacherName = data[0].teacherName;
      let studentName = data[0].studentName;

      let requesterName = data[0].teacherCancelReq
        ? teacherName
        : data[0].studentCancelReq
        ? studentName
        : "";
      ////////////////////////////////////////////////////////////////////////////////////////////
      //Config Admin Email
      configAdminEmail = {
        subject: "Class cancellation is approved",
        html: `
                    <p>Admin approved the ${requesterName}'s request to cancel ${startingDate}'s class's number : "${id}" with ${
          requesterName == teacherName
            ? `the student "${studentName}"`
            : `the teacher "${teacherName}" `
        }</p>
                    `,
      };
      sendEmail(configAdminEmail);
      ////////////////////////////////////////////////////////////////////////////////////////////
      //Config Teacher Email
      configTeacherEmail = {
        to: teacherEmail,
        subject: "Class cancellation is approved",
        html: `
                    <p>Assalamu alaykum,</p>
                    <p>We hope you are doing well,</p>
                    <p>Admin approved the ${requesterName}'s request to cancel ${startingDate}'s class's number : "${id}" with ${
          requesterName == teacherName
            ? `the student "${studentName}"`
            : `the teacher "${teacherName}" `
        }</p>
                    <p>Best regards</p> 
                    `,
      };
      sendEmail(configTeacherEmail);
      ////////////////////////////////////////////////////////////////////////////////////////////
      //Config Guardian Email
      configGuardianEmail = {
        to: guardianEmail,
        subject: "Class cancellation is approved",
        html: `
                    <p>Assalamu alaykum,</p>
                    <p>We hope you are doing well,</p>
                    <p>Admin approved the ${requesterName}'s request to cancel ${startingDate}'s class's number : "${id}" with ${
          requesterName == teacherName
            ? `the student "${studentName}"`
            : `the teacher "${teacherName}" `
        }</p>
                    <p>Best regards</p> 
                    `,
      };
      sendEmail(configGuardianEmail);
      ///////////////////////////////////////////////////////////////////////////////////////////////////
      //Config Notification
      notiConfig = {
        type: 1,
        admin: 1,
        teacherID: teacherID,
        guardianID: guardianID,
        studentID: studentID,
        adminMsg: `Admin approved the ${requesterName}'s request to cancel ${startingDate}'s class's number : "${id}" with ${
          requesterName == teacherName
            ? `the student "${studentName}"`
            : `the teacher "${teacherName}" `
        }`,
        teacherMsg: `Admin approved the ${requesterName}'s request to cancel ${startingDate}'s class's number : "${id}" with ${
          requesterName == teacherName
            ? `the student "${studentName}"`
            : `the teacher "${teacherName}" `
        }`,
        guardianMsg: `Admin approved the ${requesterName}'s request to cancel ${startingDate}'s class's number : "${id}" with ${
          requesterName == teacherName
            ? `the student "${studentName}"`
            : `the teacher "${teacherName}" `
        }`,
      };
      //Send Notification
      sendNotification(notiConfig);
    });
  };
  ///////////////////////////////////////////////

  // IF Accept Reschedule
  if (req.body.rescheduleApproved) {
    rescheduleApprovedLogic();
  } else {
    let bodyData = req.body;
    const studentID = req.body.studentID;
    const teacherID = req.body.teacherID;
    const classStatus = req.body.status.toString();
    const currentClassStatus = req.body.currentStatus.toString();
    let addHours = 0;
    if (
      ["1", "4"].includes(classStatus) &&
      !["1", "4"].includes(currentClassStatus)
    ) {
      addHours = 1;
    } else if (
      ["2", "3", "5", "6", "0"].includes(classStatus) &&
      ["1", "4"].includes(currentClassStatus)
    ) {
      addHours = 2;
    }

    if (addHours !== 0) {
      if (bodyData.countForTeacher === 1) {
        const query1 = `UPDATE teachers SET hours = hours ${
          addHours === 2 ? "-" : "+"
        } (SELECT duration FROM classes WHERE id = ${id}) WHERE id = ${teacherID}`;
        dataBase.query(query1, (error, data) => {
          if (error || !data) {
            return res.json({
              success: false,
              msg: "Failed update hours for teacher",
              error,
            });
          }
        });
      }

      if (bodyData.countForStudent === 1) {
        const query1 = `UPDATE students SET attendedHours = attendedHours ${
          addHours === 2 ? "-" : "+"
        } (SELECT duration FROM classes WHERE id = ${id}) WHERE id = ${studentID}`;
        dataBase.query(query1, (error, data) => {
          if (error || !data) {
            return res.json({
              success: false,
              msg: "Failed update hours for student",
            });
          }
        });
      }
    }

    delete req.body.currentStatus;
    bodyData.startingDate = moment(bodyData.startingDate).format(
      "YYYY-MM-DD HH:mm:ss"
    ); // Correct save (utc)
    //Step1: Update into class table
    let query = `UPDATE classes SET ? WHERE id = ${id}`;
    dataBase.query(query, bodyData, (error, data) => {
      if (error || !data) {
        return res.json({
          success: false,
          msg: "Failed update Class",
          error,
        });
      }
      // IF status = 6 (Cancel): Check if there is Cancellation request
      if (req.body.status == 6) {
        cancellationApproved();
      }
      res.json({
        success: true,
        msg: "Great, the Class have been successfully updated.",
      });
    });
  }
};
// Path5: Update Class Report
let updateClassReport = (req, res) => {
  let id = req.params.id; // class id
  let bodyData = req.body;
  let dataClassTable = bodyData[0];
  let dataReportTable = bodyData[1];
  let currentStatus = bodyData[2].currentStatus;

  // add hours if status changed
  // else remove hours
  // 0 don't do anything ,1 add hours ,2 remove hours

  let addHours = 0;
  if (
    ["1", "4"].includes(dataClassTable.status.toString()) &&
    !["1", "4"].includes(currentStatus.toString())
  ) {
    addHours = 1;
  } else if (
    ["2", "3", "5", "6"].includes(dataClassTable.status.toString()) &&
    ["1", "4"].includes(currentStatus.toString())
  ) {
    addHours = 2;
  }

  if (addHours !== 0) {
    if (dataClassTable.countForTeacher === 1) {
      const query1 = `UPDATE teachers SET hours = hours ${
        addHours === 2 ? "-" : "+"
      } (SELECT duration FROM classes WHERE id = ${id}) WHERE id = (SELECT teacherID FROM classes WHERE id = ${id})`;
      dataBase.query(query1, (error, data) => {
        if (error || !data) {
          return res.json({
            success: false,
            msg: "Failed update hours for teacher",
          });
        }
      });
    }
    if (dataClassTable.countForStudent === 1) {
      const query1 = `UPDATE students SET attendedHours = attendedHours ${
        addHours === 2 ? "-" : "+"
      } (SELECT duration FROM classes WHERE id = ${id}) WHERE id = (SELECT studentID FROM classes WHERE id = ${id})`;
      dataBase.query(query1, (error, data) => {
        if (error || !data) {
          return res.json({
            success: false,
            msg: "Failed update hours for student",
          });
        }
      });
    }
  }

  //Step1: Update into class table
  // Step2: Update into reportsubjects table

  //Step1: Update into class table
  let query = `UPDATE classes SET ? WHERE id = ${id}`;
  delete dataClassTable.countForStudent;
  dataBase.query(query, dataClassTable, (error, data) => {
    if (error || !data) {
      return res.json({ success: false, msg: "Failed update Class" });
    }

    // Step2: Update into reportsubjects table
    let query = `UPDATE reportsubjects SET ? WHERE classID = ${id}`;
    dataBase.query(query, dataReportTable, (error, data) => {
      if (error || !data) {
        return res.json({
          success: false,
          msg: "Failed update subject to report",
        });
      }
      res.json({
        success: true,
        msg: "Great, the report have been successfully updated.",
      });
    });
  });
};
// Path6: Delete Class
let deleteClass = (req, res) => {
  let id = req.params.id;
  let query = `SELECT studentID, teacherID from classes WHERE id = ${id}`;
  dataBase.query(query, (error, data) => {
    if (data.length >= 1) {
      let studentID = data[0].studentID;
      let teacherID = data[0].teacherID;
      let query = `DELETE FROM classes WHERE id = ${id}`;
      dataBase.query(query, (error, data) => {
        if (error) {
          return res.json({
            success: false,
            msg: "Sorry, this class could not be deleted, please try again.",
          });
        }

        let query = `SELECT * FROM classes WHERE studentID=${studentID} AND startingDate >= NOW() AND status=0`;
        dataBase.query(query, (error, data) => {
          if (error || data.length >= 1) return;
          // set student inactive
          let query = `UPDATE students SET status=2 WHERE id = ${studentID}`;
          dataBase.query(query);
        });
        // check if teacher has another classes in the future
        let query2 = `SELECT * FROM classes WHERE teacherID=${teacherID} AND startingDate >= NOW() AND status=0`;
        dataBase.query(query2, (error, data) => {
          if (error || data.length >= 1) return;
          // set teacher inactive
          let query = `UPDATE teachers SET status=2 WHERE id = ${teacherID}`;
          dataBase.query(query);
        });

        res.json({
          success: true,
          msg: "The class has been successfully deleted.",
        });
      });
    } else {
      return res.json({
        success: false,
        msg: "Sorry, this class is not found.",
      });
    }
  });
};
let classesOfTeacher = (req, res, next) => {
  let id = tokenData.id;
  let queryReq = req.query;
  let userDateTime = queryReq.date;
  let type = queryReq.type; //Previous or Current
  let sign = type == "previous" ? "<" : ">=";
  let status = queryReq.status;
  let search = queryReq.search || "";
  let offset = queryReq.offset;

  query = `SELECT classes.*,count(*) OVER() AS fullCount, teachers.name AS teacherName, students.name AS studentName 
                FROM classes 
                INNER JOIN teachers 
                ON classes.teacherID = teachers.id 
                INNER JOIN students 
                ON classes.studentID = students.id
                ${
                  type == "previous"
                    ? `WHERE (classes.startingDate ${sign} NOW() OR classes.status !=0)`
                    : `WHERE (classes.startingDate ${sign} NOW() AND classes.status =0) AND students.status = 1`
                }
                AND teachers.id = ${id}
                ${status == 0 ? `AND classes.status = 0` : ""}
                ${
                  status == 1
                    ? `AND classes.status = 1 OR classes.status = 4 OR classes.status = 5`
                    : ""
                }
                ${
                  status == 2
                    ? `AND (classes.status = 2 OR classes.status = 3 OR classes.status= 6)`
                    : ""
                }
                ${
                  status == 3
                    ? `AND classes.status = 7`
                    : ""
                }
                ${
                  search
                    ? Number(search) == search
                      ? `AND classes.id LIKE '${search}'`
                      : ` AND ( classes.classTitle LIKE '%${search}%' OR students.name LIKE '%${search}%' OR teachers.name LIKE '%${search}%' OR classes.startingDate LIKE '%${search}%' ) `
                    : ""
                }
                ORDER BY startingDate ${type == "previous" ? "DESC" : ""}
                ${offset ? `LIMIT 30 OFFSET ${offset}` : ""}
                `;
  //${search ? ` AND classes.classTitle LIKE '%${search}%'`:''}

  //WHERE classes.teacherID = ${id} AND classes.startingDate ${sign} '${userDateTime}'
  msg = "There are no results available to display.";
  return next();
};
let classesOfGuardianStudents = (req, res, next) => {
  let id = tokenData.id;
  let queryReq = req.query;
  let userDateTime = queryReq.date;
  let type = queryReq.type; //Previous or Current
  let sign = type == "previous" ? "<" : ">=";
  let status = queryReq.status;
  let search = queryReq.search || "";
  let offset = queryReq.offset;

  query = `SELECT classes.*,count(*) OVER() AS fullCount, teachers.name AS teacherName, students.name AS studentName 
                FROM classes 
                INNER JOIN teachers 
                ON classes.teacherID = teachers.id 
                INNER JOIN students 
                ON classes.studentID = students.id
                INNER JOIN guardians 
                ON students.guardianID = guardians.id
                ${
                  type == "previous"
                    ? `WHERE (classes.startingDate ${sign} NOW() OR classes.status !=0)`
                    : `WHERE (classes.startingDate ${sign} NOW() AND classes.status =0) AND students.status = 1`
                }
                AND guardians.id = ${id}
                ${
                  status == 1
                    ? `AND (classes.id IN (SELECT classID FROM reportsubjects)) AND (classes.status = 1 OR classes.status = 4 OR classes.status = 5)`
                    : ""
                }
                ${
                  status == 2
                    ? `AND (classes.status = 2 OR classes.status = 3 OR classes.status= 6)`
                    : ""
                }
                ${
                  status == 3
                    ? `AND classes.status != 0 AND classes.id NOT IN (SELECT classID FROM reportsubjects)`
                    : ""
                }
                ${
                  search
                    ? ` AND ( classes.classTitle LIKE '%${search}%' OR classes.id LIKE '%${search}%' ) `
                    : ""
                }
                ORDER BY startingDate ${type == "previous" ? "DESC" : ""}
                ${offset ? `LIMIT 30 OFFSET ${offset}` : ""}
                `;
  //WHERE guardians.id = ${id} AND classes.startingDate ${sign} '${userDateTime}'
  msg = "There are no results available to display.";
  return next();
};
let cancelClassReq = (req, res) => {
  id = req.body.classID; // class id
  let bodyData = {};
  bodyData.classID = req.body.classID;

  //Only Authorized user(Teacher of the class class, guardian of student of the class) can send the request
  if (!isAdmin) {
    let localID = tokenData.id; // Authorized user
    let query = `SELECT (SELECT COUNT(teacherID) FROM classes WHERE id = ${id} AND teacherID = ${localID}) AS teacher,
        (SELECT COUNT(studentID) 
                    FROM classes 
                    INNER JOIN students
                    ON students.id = classes.studentID
                    INNER JOIN guardians
                    ON students.guardianID = guardians.id
                    WHERE guardians.id = ${localID} AND classes.id = ${id}) AS guardian`;
    dataBase.query(query, (error, data) => {
      if (error || (data[0].teacher < 1 && data[0].guardian < 1)) {
        return res.json({
          success: false,
          msg: "Soory, you don't have the perimission",
        });
      }
      if (data[0].guardian > 0) {
        bodyData.studentCancelReq = 1;
        bodyData.studentID = req.body.studentID;
        bodyData.guardianID = localID;
      } else if (data[0].teacher > 0) {
        bodyData.teacherCancelReq = 1;
        bodyData.teacherID = localID;
      }
      // Insert In classesReq
      let startingDate = moment(req.body.startingDate).format(
        "ddd, D MMM YYYY, HH:mm"
      );
      dataBase.query(
        `INSERT INTO classesreq SET ?`,
        bodyData,
        (error, data) => {
          if (error || !data) {
            return res.json({
              success: false,
              msg: "Failed Open send cancel request",
            });
          }
          // Send Email & Notifications
          let requesterName = tokenData.name;
          let studentName = req.body.studentName;
          let teacherName = req.body.teacherName;
          let teacherID = req.body.teacherID;
          let studentID = req.body.studentID;
          let usersData = `SELECT (SELECT name FROM teachers WHERE id = ${teacherID}) AS teacherName,
                                (SELECT email FROM teachers WHERE id = ${teacherID}) AS teacherEmail,
                                (SELECT name FROM students WHERE id = ${studentID}) AS studentName,
                                (SELECT guardianID FROM students WHERE id = ${studentID}) AS guardianID,
                                (SELECT guardians.name 
                                    FROM students 
                                    INNER JOIN guardians
                                    ON students.guardianID = guardians.id
                                    WHERE students.id = ${studentID}) AS guardianName,
                                (SELECT guardians.email
                                    FROM students 
                                    INNER JOIN guardians
                                    ON students.guardianID = guardians.id
                                    WHERE students.id = ${studentID}) AS guardianEmail
                `;
          dataBase.query(usersData, (error, data) => {
            if (error || !data.length) {
              console.log("We cant get names");
            }
            let teacherName = data[0].teacherName;
            let teacherEmail = data[0].teacherEmail;
            let studentName = data[0].studentName;
            let guardianEmail = data[0].guardianEmail;
            let guardianID = data[0].guardianID;
            ////////////////////////////////////////////////////////////////////////////////////////////
            //Config Admin Email
            configAdminEmail = {
              subject: "Class cancellation",
              html: `
                            <p>"${requesterName}" requested to cancel ${startingDate}'s class's number : "${id}" with ${
                requesterName == teacherName
                  ? `the student "${studentName}"`
                  : `the teacher "${teacherName}" `
              } </p>
                            `,
            };
            sendEmail(configAdminEmail);
            ////////////////////////////////////////////////////////////////////////////////////////////
            //Config Teacher Email
            configTeacherEmail = {
              to: teacherEmail,
              subject: "Class cancellation",
              html: `
                            <p>Assalamu alaykum,</p>
                            <p>We hope you are doing well,</p>
                            <p>"${requesterName}" requested to cancel ${startingDate}'s class's number : "${id}" with ${
                requesterName == teacherName
                  ? `the student "${studentName}"`
                  : `the teacher "${teacherName}" `
              } </p>
                            <p>Best regards</p> 
                            `,
            };
            sendEmail(configTeacherEmail);
            ////////////////////////////////////////////////////////////////////////////////////////////
            //Config Guardian Email
            configGuardianEmail = {
              to: guardianEmail,
              subject: "Class cancellation",
              html: `
                            <p>Assalamu alaykum,</p>
                            <p>We hope you are doing well,</p>
                            <p>"${requesterName}" requested to cancel ${startingDate}'s class's number : "${id}" with ${
                requesterName == teacherName
                  ? `the student "${studentName}"`
                  : `the teacher "${teacherName}" `
              } </p>
                            <p>Best regards</p> 
                            `,
            };
            sendEmail(configGuardianEmail);
            ///////////////////////////////////////////////////////////////////////////////////////////////////
            //Config Notification
            notiConfig = {
              type: 1,
              admin: 1,
              teacherID: teacherID,
              guardianID: guardianID,
              studentID: studentID,
              adminMsg: `"${requesterName}" requested to cancel ${startingDate}'s class's number : "${id}" with ${
                requesterName == teacherName
                  ? `the student "${studentName}"`
                  : `the teacher "${teacherName}" `
              } <a href="admin/classes/${id}">Go to class</a>`,
              teacherMsg: `"${requesterName}" requested to cancel ${startingDate}'s class's number : "${id}" with ${
                requesterName == teacherName
                  ? `the student "${studentName}"`
                  : `the teacher "${teacherName}" `
              } <a href="classes/${id}">Go to class</a>`,
              guardianMsg: `"${requesterName}" requested to cancel ${startingDate}'s class's number : "${id}" with ${
                requesterName == teacherName
                  ? `the student "${studentName}"`
                  : `the teacher "${teacherName}" `
              } <a href="classes/${id}">Go to class</a>`,
            };
            //Send Notification
            sendNotification(notiConfig);
            res.json({ success: true, msg: "Your request sent successfully" });
          });
        }
      );
    });
  }
};
let RescheduleClassReq = (req, res) => {
  id = req.body.classID; // class id
  let bodyData = {};
  // bodyData.classID = req.body.classID;

  //Only Authorized user(Teacher of the class class, guardian of student of the class) can send the request
  if (!isAdmin) {
    let localID = tokenData.id; // Authorized user
    let query = `SELECT (SELECT COUNT(teacherID) FROM classes WHERE id = ${id} AND teacherID = ${localID}) AS teacher,
        (SELECT COUNT(studentID) 
                    FROM classes 
                    INNER JOIN students
                    ON students.id = classes.studentID
                    INNER JOIN guardians
                    ON students.guardianID = guardians.id
                    WHERE guardians.id = ${localID} AND classes.id = ${id}) AS guardian`;
    dataBase.query(query, (error, data) => {
      if (error || (data[0].teacher < 1 && data[0].guardian < 1)) {
        return res.json({
          success: false,
          msg: "Soory, you don't have the perimission",
        });
      }
      if (data[0].guardian > 0) {
        bodyData.studentReschedule = req.body.startingRescheduled;
        // bodyData.studentID = req.body.studentID
        // bodyData.guardianID = localID
      } else if (data[0].teacher > 0) {
        bodyData.teacherReschedule = req.body.startingRescheduled;
        // bodyData.teacherID = localID
      }
      // Store and send the request
      let startingDate = moment(req.body.startingDate).format(
        "ddd, D MMM YYYY, HH:mm"
      );
      let startingRescheduled = moment(req.body.startingRescheduled).format(
        "ddd, D MMM YYYY, HH:mm"
      );

      dataBase.query(
        `UPDATE classes SET ? where id = ${id}`,
        bodyData,
        (error, data) => {
          if (error || !data) {
            return res.json({
              success: false,
              msg: "Failed send cancel request",
            });
          }
          // Send Email & Notifications
          let requesterName = tokenData.name;
          let teacherID = req.body.teacherID;
          let studentID = req.body.studentID;
          let usersData = `SELECT (SELECT name FROM teachers WHERE id = ${teacherID}) AS teacherName,
                                (SELECT email FROM teachers WHERE id = ${teacherID}) AS teacherEmail,
                                (SELECT name FROM students WHERE id = ${studentID}) AS studentName,
                                (SELECT guardianID FROM students WHERE id = ${studentID}) AS guardianID,
                                (SELECT guardians.name 
                                    FROM students 
                                    INNER JOIN guardians
                                    ON students.guardianID = guardians.id
                                    WHERE students.id = ${studentID}) AS guardianName,
                                (SELECT guardians.email
                                    FROM students 
                                    INNER JOIN guardians
                                    ON students.guardianID = guardians.id
                                    WHERE students.id = ${studentID}) AS guardianEmail
                `;
          dataBase.query(usersData, (error, data) => {
            if (error || !data.length) {
              console.log("We cant get names");
            }
            let teacherName = data[0].teacherName;
            let teacherEmail = data[0].teacherEmail;
            let studentName = data[0].studentName;
            let guardianEmail = data[0].guardianEmail;
            let guardianID = data[0].guardianID;

            ////////////////////////////////////////////////////////////////////////////////////////////
            //Config Admin Email
            configAdminEmail = {
              subject: "Rescheduling request",
              html: `
                            <p>"${requesterName}" requested to change ${startingDate}'s class's number : "${id}" with ${
                requesterName == teacherName
                  ? `the student "${studentName}"`
                  : `the teacher "${teacherName}"`
              } to be ${startingRescheduled}</p>
                            `,
            };
            sendEmail(configAdminEmail);
            ////////////////////////////////////////////////////////////////////////////////////////////
            //Config Teacher Email
            configTeacherEmail = {
              to: teacherEmail,
              subject: "Rescheduling request",
              html: `
                            <p>Assalamu alaykum,</p>
                            <p>We hope you are doing well,</p>
                            <p>"${requesterName}" requested to change ${startingDate}'s class's number : "${id}" with ${
                requesterName == teacherName
                  ? `the student "${studentName}"`
                  : `the teacher "${teacherName}"`
              } to be ${startingRescheduled}</p>
                            <p>Best regards</p> 
                            `,
            };
            sendEmail(configTeacherEmail);
            ////////////////////////////////////////////////////////////////////////////////////////////
            //Config Guardian Email
            configGuardianEmail = {
              to: guardianEmail,
              subject: "Rescheduling request",
              html: `
                            <p>Assalamu alaykum,</p>
                            <p>We hope you are doing well,</p>
                            <p>"${requesterName}" requested to change ${startingDate}'s class's number : "${id}" with ${
                requesterName == teacherName
                  ? `the student "${studentName}"`
                  : `the teacher "${teacherName}"`
              } to be ${startingRescheduled}</p>
                            <p>Best regards</p> 
                            `,
            };
            sendEmail(configGuardianEmail);
            ///////////////////////////////////////////////////////////////////////////////////////////////////
            //Config Notification
            notiConfig = {
              type: 1,
              admin: 1,
              teacherID: teacherID,
              guardianID: guardianID,
              studentID: studentID,
              adminMsg: `"${requesterName}" requested to change ${startingDate}'s class's number : "${id}" with ${
                requesterName == teacherName
                  ? `the student "${studentName}"`
                  : `the teacher "${teacherName}"`
              } to be ${startingRescheduled} <a href="admin/classes/${id}">Go to class</a>`,
              teacherMsg: `"${requesterName}" requested to change ${startingDate}'s class's number : "${id}" with ${
                requesterName == teacherName
                  ? `the student "${studentName}"`
                  : `the teacher "${teacherName}"`
              } to be ${startingRescheduled} <a href="classes/${id}">Go to class</a>`,
              guardianMsg: `"${requesterName}" requested to change ${startingDate}'s class's number : "${id}" with ${
                requesterName == teacherName
                  ? `the student "${studentName}"`
                  : `the teacher "${teacherName}"`
              } to be ${startingRescheduled} <a href="classes/${id}">Go to class</a>`,
            };
            //Send Notification
            sendNotification(notiConfig);
            res.json({ success: true, msg: "Your request sent successfully" });
          });
        }
      );
    });
  }
};
//Path 9: Remind Teacher/Student for a Class
let remindUser = (req, res) => {
  let classID = req.body.classID;
  let userID = req.body.userID;
  let userType = req.body.userType;

  let query;
  if (userType == "Teacher") {
    query = `SELECT email FROM teachers WHERE id = ${userID}`;
  } else if (userType == "Student") {
    query = `SELECT email FROM students WHERE id = ${userID}`;
  }
  dataBase.query(query, (error, data) => {
    if (error || !data.length) {
      return res.json({
        success: false,
        msg: "The process of reminding is failed!",
      });
    }
    let userEmail = data[0].email;
    //////////////////////////////////////////////////////////////////////////
    configEmail = {
      to: userEmail,
      subject: "Class time reminder",
      html: `
                <p>Assalamu alaykum,</p>
                <p>We hope you are doing well,</p>
                <p>We would like to remind you that you're running late for the class :"${classID}".</p>
                <p>Best regards</p> 
                `,
    };
    let emailSent = sendEmail(configEmail);
    res.json({
      success: emailSent,
      msg: emailSent
        ? "A reminder was sent to his email address."
        : "Emails are disabled",
      userEmail: userEmail,
    });
  });
};

let fetchScheduleData = (req, res, next) => {
  let queryData = req.query;

  let teacherID = queryData.teacherID;
  let studentID = queryData.studentID;

  query = `SELECT * FROM scheduledclasses WHERE teacherID = ${teacherID} AND studentID = ${studentID} AND classTitle IS NOT NULL AND subject IS NOT NULL AND duration IS NOT NULL ORDER BY createdAt DESC`;
  msg = "There are no results available to display.";
  return next();
};
let ScheduledClasses = (req, res, next) => {
  let queryData = req.query;
  if (queryData.teacherID) {
    // query = `SELECT * FROM scheduledclasses WHERE teacherID = ${queryData.teacherID} ORDER BY createdAt DESC`;
    query = `SELECT DISTINCT scheduledclasses.*, students.name AS studentName
        FROM scheduledclasses
        INNER JOIN classes
        ON classes.scheduleID = scheduledclasses.id
        INNER JOIN students
        ON students.id = classes.studentID
        INNER JOIN teachers
        ON teachers.id = classes.teacherID
        WHERE classes.teacherID = ${queryData.teacherID} ORDER BY scheduledclasses.createdAt DESC`;
  } else if (queryData.studentID) {
    // query = `SELECT * FROM scheduledclasses WHERE studentID = ${queryData.studentID} ORDER BY createdAt DESC`;
    query = `SELECT DISTINCT scheduledclasses.*, teachers.name AS teacherName
        FROM scheduledclasses
        INNER JOIN classes
        ON classes.scheduleID = scheduledclasses.id
        INNER JOIN students
        ON students.id = classes.studentID
        INNER JOIN teachers
        ON teachers.id = classes.teacherID
        WHERE classes.studentID = ${queryData.studentID} ORDER BY scheduledclasses.createdAt DESC`;
  }
  msg = "There are no results available to display.";
  return next();
};

let RescheduleClasses = (req, res) => {
  let id = req.params.id;
  let bodyData = req.body;
  let guardianID = bodyData.guardianID;
  let studentID = bodyData.studentID;
  let teacherID = bodyData.teacherID;
  let subject = bodyData.subject;
  let guests = bodyData.guests;
  let emailClassesDetails = [];
  delete bodyData.classesIDs;
  delete bodyData.createdAt;

  // delete all upcoming classes first
  let query1 = `SELECT id FROM classes WHERE teacherID=${teacherID} AND studentID = ${studentID} AND ( startingDate >= NOW() AND status=0 ) AND scheduleID IS NOT NULL`;
  dataBase.query(query1, (error, data) => {
    if (error || !data.length) {
      return res.json({ success: false, msg: "Failed find classes!" });
    }
    let ids = [];
    let arrayOfObject = data;

    for (i in arrayOfObject) {
      ids.push(arrayOfObject[i].id);
    }
    //Step2: delete
    let query = `DELETE FROM classes WHERE id IN (${ids.join(",")})`;
    dataBase.query(query, (error, data) => {
      if (error) {
        return res.json({
          success: false,
          msg: "Sorry, this class could not be deleted, please try again.",
          error: error,
        });
      }
    });
  });

  let insertClass = (sqlValues) => {
    let query = `INSERT INTO classes (teacherID, studentID, subject, classTitle, startingDate, duration, guests, description, timeZone,countForTeacher, countForStudent, scheduleID) VALUES ? `;
    dataBase.query(query, [sqlValues], (error, data) => {
      if (error || !data) {
        // return res.json({success:false, msg:"Failed store classes", error:error});
        console.log("Failed store classes", error);
      }
      // if(bodyData.length > 1){ //Save in ScheduledClasses, don't consider the first (of the Starting Date field)
      //     insertInScheduledClasses()
      // }
      //Send Emails and notifications
      let usersNames = `SELECT (SELECT name FROM teachers WHERE id = ${teacherID}) AS teacherName,
                        (SELECT name FROM students WHERE id = ${studentID}) AS studentName,
                        (SELECT email FROM teachers WHERE id = ${teacherID}) AS teacherEmail,
                        (SELECT classLink FROM teachers WHERE id = ${teacherID}) AS classLink,
                        (SELECT email FROM guardians WHERE id = ${guardianID}) AS guardianEmail
            `;
      dataBase.query(usersNames, (error, data) => {
        if (error || !data.length) {
          console.log("We can't get names");
        }
        let teacherName = data[0].teacherName;
        let studentName = data[0].studentName;
        let teacherEmail = data[0].teacherEmail;
        let guardianEmail = data[0].guardianEmail;
        let classLink = data[0].classLink;
        ////////////////////////////////////////////////////////////////////////////////////////////
        //Config Admin Email
        configAdminEmail = {
          subject: "A new lesson is added",
          html: `
                        <p>Admin "${tokenData.name}" has reschedule a class for the student "${studentName}".</p>
                        <p>${subject} start on ${emailClassesDetails[0]} with the teacher "${teacherName}" according to the following schedule:</p>
                        `,
        };
        for (var i in emailClassesDetails) {
          configAdminEmail.html += `<p>${emailClassesDetails[i]}</p>`;
        }
        sendEmail(configAdminEmail);
        ////////////////////////////////////////////////////////////////////////////////////////////
        //Config Teacher Email
        configTeacherEmail = {
          to: teacherEmail,
          subject: "A new lesson is added",
          html: `
                        <p>Assalamu alaykum,</p>
                        <p>We hope you are doing well,</p>
                        <p>Admin "${tokenData.name}" has reschedule a class.</p>
                        <p>${subject} start on ${emailClassesDetails[0]} with the student "${studentName}" according to the following schedule:</p>
                        `,
        };
        for (var i in emailClassesDetails) {
          configTeacherEmail.html += `<p>${emailClassesDetails[i]}</p>`;
        }
        configTeacherEmail.html += `<p>Please bookmark the following link to easily join the lesson. Join from PC, Mac, Linux, iOS or Android by clicking on the link: <a href="${classLink}" target="_blank">class zoom link</a>
                                            Kindly, set the password to: 1234</p> 
                                            <p>Best regards</p>           
                                            `;
        sendEmail(configTeacherEmail);
        ////////////////////////////////////////////////////////////////////////////////////////////
        //Config Guardian Email
        configGuardianEmail = {
          to: guardianEmail,
          subject: "A new lesson is added",
          html: `
                        <p>Assalamu alaykum,</p>
                        <p>We hope you are doing well,</p>
                        <p>Admin "${tokenData.name}" has reschedule a class.</p>
                        <p>${subject} start on ${emailClassesDetails[0]} with the teacher "${teacherName}" according to the following schedule:</p>
                        `,
        };
        for (var i in emailClassesDetails) {
          configGuardianEmail.html += `<p>${emailClassesDetails[i]}</p>`;
        }
        configGuardianEmail.html += `<p>Please bookmark the following link to easily join the lesson. Join from PC, Mac, Linux, iOS or Android by clicking on the link: <a href="${classLink}" target="_blank">class zoom link</a>
                                            Kindly, set the password to: 1234</p> 
                                            <p>Best regards</p>           
                                            `;
        sendEmail(configGuardianEmail);
        ////////////////////////////////////////////////////////////////////////////////////////////
        //Config Guest Email
        configGuestEmail = {
          to: guests,
          subject: "A new lesson is added",
          html: `
                        <p>Assalamu alaykum,</p>
                        <p>We hope you are doing well,</p>
                        <p>The administrator, "${tokenData.name}", cordially invites you to these classes.</p>
                        <p>${subject} start on ${emailClassesDetails[0]} with the teacher "${teacherName}" according to the following schedule:</p>
                        `,
        };
        for (var i in emailClassesDetails) {
          configGuestEmail.html += `<p>${emailClassesDetails[i]}</p>`;
        }
        configGuestEmail.html += `<p>Please bookmark the following link to easily join the lesson. Join from PC, Mac, Linux, iOS or Android by clicking on the link: <a href="${classLink}" target="_blank">class zoom link</a>
                                            Kindly, set the password to: 1234</p> 
                                            <p>Best regards</p>           
                                            `;
        sendEmail(configGuestEmail);
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        //Config Notification
        notiConfig = {
          type: 2,
          admin: 1,
          teacherID: teacherID,
          guardianID: guardianID,
          studentID: studentID,
          adminMsg: `Admin "${tokenData.name}" has reschedule a class for the student "${studentName}". <br> ${subject} start on ${emailClassesDetails[0]} with the teacher "${teacherName}" according to the following schedule: <br>`,
          teacherMsg: `Admin "${tokenData.name}" has reschedule a class for you. <br> ${subject} start on ${emailClassesDetails[0]} with the student "${studentName}" according to the following schedule: <br>`,
          guardianMsg: `Admin "${tokenData.name}" has reschedule a class for "${studentName}". <br> ${subject} start on ${emailClassesDetails[0]} with the teacher "${teacherName}" according to the following schedule: <br>`,
        };
        for (var i in emailClassesDetails) {
          notiConfig.adminMsg += `${emailClassesDetails[i]}<br>`;
          notiConfig.teacherMsg += `${emailClassesDetails[i]}<br>`;
          notiConfig.guardianMsg += `${emailClassesDetails[i]}<br>`;
        }
        //Send Notification
        sendNotification(notiConfig);
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
      });

      // res.json({success:true, msg:"Great, the classes have been successfully added."});
      console.log("Great, the classes have been successfully added.");
    });
  };

  let updateScheduledClasses = () => {
    if (bodyData.Sun) {
      bodyData.Sun = moment(bodyData.Sun).format("YYYY-MM-DD HH:mm:ss");
    }
    if (bodyData.Mon) {
      bodyData.Mon = moment(bodyData.Mon).format("YYYY-MM-DD HH:mm:ss");
    }
    if (bodyData.Tue) {
      bodyData.Tue = moment(bodyData.Tue).format("YYYY-MM-DD HH:mm:ss");
    }
    if (bodyData.Wed) {
      bodyData.Wed = moment(bodyData.Wed).format("YYYY-MM-DD HH:mm:ss");
    }
    if (bodyData.Thu) {
      bodyData.Thu = moment(bodyData.Thu).format("YYYY-MM-DD HH:mm:ss");
    }
    if (bodyData.Fri) {
      bodyData.Fri = moment(bodyData.Fri).format("YYYY-MM-DD HH:mm:ss");
    }
    if (bodyData.Sat) {
      bodyData.Sat = moment(bodyData.Sat).format("YYYY-MM-DD HH:mm:ss");
    }

    let query = `UPDATE scheduledclasses SET ? WHERE id = ${id}`;
    dataBase.query(query, bodyData, (error, data) => {
      if (error || !data) {
        return console.log("Failed Rescheduled Classes!", error);
      }

      return res.json({
        success: true,
        msg: "The Classes rescheduled successfully",
      });
    });
  };

  let query = `SELECT * FROM scheduledclasses WHERE id = ${id} ORDER BY createdAt DESC`;
  dataBase.query(query, (error, data) => {
    if (error || !data.length) {
      return console.log("Failed Find scheduledclasses Classes!");
    }

    let scheduleID = id;

    let classes = [];
    let selectedDays = {};
    let times = {};

    if (bodyData.Sun) {
      selectedDays.Sun = "Sun";
      times.Sun = moment(bodyData.Sun).format("HH:mm");
    }
    if (bodyData.Mon) {
      selectedDays.Mon = "Mon";
      times.Mon = moment(bodyData.Mon).format("HH:mm");
    }
    if (bodyData.Tue) {
      selectedDays.Tue = "Tue";
      times.Tue = moment(bodyData.Tue).format("HH:mm");
    }
    if (bodyData.Wed) {
      selectedDays.Wed = "Wed";
      times.Wed = moment(bodyData.Wed).format("HH:mm");
    }
    if (bodyData.Thu) {
      selectedDays.Thu = "Thu";
      times.Thu = moment(bodyData.Thu).format("HH:mm");
    }
    if (bodyData.Fri) {
      selectedDays.Fri = "Fri";
      times.Fri = moment(bodyData.Fri).format("HH:mm");
    }
    if (bodyData.Sat) {
      selectedDays.Sat = "Sat";
      times.Sat = moment(bodyData.Sat).format("HH:mm");
    }

    data[0].subject = bodyData.subject;
    data[0].classTitle = bodyData.classTitle;
    data[0].duration = bodyData.duration;
    data[0].guests = bodyData.guests;
    data[0].description = bodyData.description;

    let start = moment().format("YYYY-MM-DD");
    let end = moment().add(bodyData.payEvery, "M");
    //Convert times to array
    let timesOfDays = Object.values(times);
    // timesOfDays = timesOfDays.filter(item => item !== "");

    //Convert days to array
    let selectedDaysArray = Object.values(selectedDays);
    // selectedDaysArray = selectedDaysArray.filter(item => item !== "");
    for (let i = 0; i < selectedDaysArray.length; i++) {
      let day = moment(start + " " + timesOfDays[i]).day(selectedDaysArray[i]);

      if (moment(day).isBefore(start)) day.add(7, "d");
      while (day.isBefore(end)) {
        let weeklyClass = {
          teacherID: data[0].teacherID,
          studentID: data[0].studentID,
          subject: data[0].subject,
          classTitle: data[0].classTitle,
          startingDate: day.format("YYYY-MM-DD HH:mm").toString(),
          duration: data[0].duration,
          guests: data[0].guests,
          description: data[0].description,
          timeZone: data[0].timeZone,
          countForTeacher: data[0].countForTeacher ? 1 : 0,
          countForStudent: data[0].countForStudent ? 1 : 0,
        };
        classes.push(weeklyClass);
        day.add(7, "d");
      }
    }
    let classDet = [];
    let indexs = [];
    classes.forEach((obj) => {
      emailClassesDetails.push(
        moment(obj.startingDate).format("dddd, hh:mm A")
      );
    });
    for (i in emailClassesDetails) {
      if (!classDet.includes(emailClassesDetails[i].split(/[,]+/)[0])) {
        indexs.push(i);
        classDet.push(emailClassesDetails[i].split(/[,]+/)[0]);
      }
    }
    classDet = [];
    for (i in indexs) {
      classDet.push(emailClassesDetails[indexs[i]]);
    }
    emailClassesDetails = classDet;
    //Step : Insert Classes
    // Add scheduleID to each Object
    classes.forEach((obj) => {
      obj.scheduleID = scheduleID;
    });

    //Convert the array of objects to array of arrays
    sqlValues = classes.map((object) => Object.values(object));
    insertClass(sqlValues);

    //Step : Update Scheduled Classes
    updateScheduledClasses();
  });
};
let deleteManyClasses = (req, res) => {
  let scheduleID = req.body.scheduleID;
  let studentID = req.body.studentID;
  let teacherID = req.body.teacherID;
  //Step1: Get all upcoming classe's ID of this student&teacher
  //Step2: delete
  //Step3: Empty form scheduleClasses by scheduleID

  //Step1: Get all upcoming classe's ID of this student&teacher
  let query = `SELECT id FROM classes WHERE teacherID=${teacherID} AND studentID = ${studentID} AND ( startingDate >= NOW() AND status=0 )`;
  dataBase.query(query, (error, data) => {
    if (error || !data.length) {
      return res.json({ success: false, msg: "Failed find classes!" });
    }
    let ids = [];
    let arrayOfObject = data;

    for (i in arrayOfObject) {
      ids.push(arrayOfObject[i].id);
    }
    //Step2: delete
    let query = `DELETE FROM classes WHERE id IN (${ids.join(",")})`;
    dataBase.query(query, (error, data) => {
      if (error) {
        return res.json({
          success: false,
          msg: "Sorry, this class could not be deleted, please try again.",
          error: error,
        });
      }
      //Step3: Empty form scheduleClasses by scheduleID
      // let query = `DELETE FROM scheduledclasses WHERE id = ${scheduleID}`; [Can't delete when previous class exists, because this last has scheduleID]
      let query = `UPDATE scheduledclasses SET Sat=NULL,Fri=NULL,Thu=NULL,Wed=NULL,Tue=NULL,Mon=NULL,Sun=NULL,Sun=NULL,description=NULL,guests=NULL,duration=NULL,classTitle=NULL,subject=NULL WHERE id = ${scheduleID}`;
      dataBase.query(query, (error, data) => {
        if (error) {
          return res.json({
            success: false,
            msg: "Sorry, this scheduled classes could not be deleted, please try again.",
            error: error,
          });
        }

        // studentID
        // teacherID
        // check if student has another classes in the future
        let query = `SELECT * FROM classes WHERE studentID=${studentID} AND startingDate >= NOW() AND status=0`;
        dataBase.query(query, (error, data) => {
          if (error || data.length >= 1) return;
          // set student inactive
          let query = `UPDATE students SET status=2 WHERE id = ${studentID}`;
          dataBase.query(query);
        });
        // check if teacher has another classes in the future
        let query2 = `SELECT * FROM classes WHERE teacherID=${teacherID} AND startingDate >= NOW() AND status=0`;
        dataBase.query(query2, (error, data) => {
          if (error || data.length >= 1) return;
          // set teacher inactive
          let query = `UPDATE teachers SET status=2 WHERE id = ${teacherID}`;
          dataBase.query(query);
        });

        res.json({
          success: true,
          msg: "The classes has been successfully deleted.",
        });
      });
    });
  });
};

let deleteClasses = (req, res) => {
  const date = moment(req.body.data, "YYYY/MM/DD HH:mm:ss").format(
    "YYYY-MM-DD HH:mm:ss"
  );
  let query = `SELECT * FROM classes WHERE startingDate <= ? `;
  dataBase.query(query, date, (error, data) => {
    if (error || !data[0]) {
      return res.json({
        success: false,
        msg: error ? "Failed find classes!" : "No classes before that date",
        error: error,
      });
    }
    let classesIDs = [];
    let scheduleIDs = [];
    let arrayOfObject = data;

    for (i in arrayOfObject) {
      classesIDs.push(arrayOfObject[i].id);
    }
    for (i in arrayOfObject) {
      scheduleIDs.push(arrayOfObject[i].scheduleID);
    }
    scheduleIDs = [...new Set(scheduleIDs)];

    scheduleIDs = scheduleIDs.filter((item) => item != null);
    classesIDs = classesIDs.filter((item) => item != null);
    //Step2: delete classes
    let query = `DELETE FROM classes WHERE id IN (${classesIDs.join(",")})`;
    dataBase.query(query, (error, data) => {
      if (error) {
        return res.json({
          success: false,
          msg: "Sorry, this class could not be deleted, please try again.",
          error: error,
        });
      }
      //Step3: Delete scheduleClasses
      let query = `DELETE FROM scheduledclasses WHERE id IN (${scheduleIDs.join(
        ","
      )}) AND subject IS NULL AND classTitle IS NULL`;

      dataBase.query(query);
      res.json({
        success: true,
        msg: "All classes before this date deleted.",
      });
    });
  });
};

let getHoursAndStudentsNum = (req, res, next) => {
  /* 
    Teacher
    Guardian
    Admin
  */
  let id = tokenData.id;
  let userType = req.query.userType;
  if (userType == "Teacher") {
    query = `SELECT 
        (SELECT COUNT (DISTINCT classes.studentID)
            FROM classes
            INNER JOIN students
            ON students.id = classes.studentID
            WHERE classes.teacherID = ${id}
            AND students.status = 1
        ) AS activeStudentsCount,
        (SELECT classes.startingDate FROM classes INNER JOIN teachers
          ON classes.teacherID = teachers.id
          INNER JOIN students
          ON classes.studentID = students.id 
          WHERE classes.teacherID = ${id} AND (classes.startingDate >= NOW() AND classes.status = 0)
            AND students.status = 1 AND teachers.status = 1 ORDER BY classes.startingDate LIMIT 1) as nextClass,
            (SELECT students.name FROM classes INNER JOIN teachers
              ON classes.teacherID = teachers.id
              INNER JOIN students
              ON classes.studentID = students.id 
              WHERE classes.teacherID = ${id} AND (classes.startingDate >= NOW() AND classes.status = 0)
                AND students.status = 1 AND teachers.status = 1 ORDER BY classes.startingDate LIMIT 1) as studentName`;
  } else if (userType == "Guardian") {
    query = `SELECT 
        (SELECT SUM(attendedHours) 
        FROM students
        WHERE guardianID = ${id}
        ) AS hours,

        (SELECT SUM(savedPaidHours)
            FROM guardianinvoices
            WHERE guardianinvoices.guardianID =${id} AND guardianinvoices.paid = 1) AS savedPaidHours,
        (SELECT COUNT(students.guardianID)
            FROM students
            INNER JOIN guardians
            ON guardians.id = students.guardianID
            WHERE guardians.id = ${id}
            AND students.status = 1
        ) AS activeStudentsCount`;
  } else if (userType == "Admin") {
    query = `SELECT 
        (SELECT SUM(classes.duration) 
                    FROM classes
                     INNER JOIN teachers
                     ON classes.teacherID = teachers.id
                    AND (classes.status=1 OR classes.status=4) AND classes.countForTeacher=1
                ) AS hours,
                (SELECT COUNT(students.id) FROM students WHERE status=1) AS activeStudentsCount,
                (SELECT COUNT(students.id) FROM students WHERE status=2) AS inactiveStudentsCount,
                (SELECT COUNT(students.id) FROM students WHERE status=3) AS vacationStudentsCount,
                (SELECT COUNT(teachers.id) FROM teachers WHERE status=1) AS activeTeachersCount,
                (SELECT COUNT(teachers.id) FROM teachers WHERE status=2) AS inactiveTeachersCount,
                (SELECT COUNT(teachers.id) FROM teachers WHERE status=3) AS vacationTeachersCount,
                (SELECT SUM(classes.duration) FROM classes WHERE startingDate between DATE_FORMAT(NOW() ,'%Y-%m-01') AND NOW() AND status=1 OR status=4) AS attendedClassHours,
                (SELECT SUM(classes.duration) FROM classes WHERE startingDate BETWEEN now() and date_sub( last_day( date_add(now(), interval 1 month) ), interval day( last_day( date_add(now(), interval 1 month) ) )-1 DAY)) AS scheduledClassHours,
                (SELECT SUM(savedPaidHours) - (SELECT sum(attendedHours) from students) FROM guardianinvoices) AS paidClassHours,
                (SELECT SUM(savedPaidHours) FROM guardianinvoices) AS paidInvoicesHours,
                (SELECT COUNT(id) FROM guardians WHERE paymentType = 1) AS AdvancePay,
                (SELECT COUNT(id) FROM guardians WHERE paymentType = 2) AS ArrearsPay`;
  }
  msg = "There are no results available to display.";
  return next();
};
let getDueInvoices = (req, res, next) => {
  query = `SELECT DISTINCT (SELECT SUM(savedPaidHours) FROM guardianinvoices INNER JOIN guardians ON guardianinvoices.guardianID = guardians.id WHERE guardians.id = students.guardianID ) AS paidHours,(SELECT SUM(students.attendedHours) FROM students WHERE students.guardianID = guardians.id ) AS hours FROM guardians LEFT JOIN students ON students.guardianID = guardians.id`;
  msg = "There are no results available to display.";
  return next();
};

let getReportCount = (req, res, next) => {
  const id = tokenData.id;
  query = `SELECT (
    SELECT COUNT(*) FROM classes
    WHERE classes.startingDate
    BETWEEN (NOW() - INTERVAL 3 day)
     AND NOW()
     AND classes.status = 0 ${
       req.query.userType ? `AND classes.teacherID=${id}` : ""
     })AS noReportCount`;
  msg = "There are no results available to display.";
  return next();
};
module.exports = {
  oneClass,
  endClass,
  deleteClass,
  cancelClassReq,
  RescheduleClassReq,
  updateClass,
  updateClassReport,
  classesOfTeacher,
  classesOfGuardianStudents,
  remindUser,
  fetchScheduleData,
  RescheduleClasses,
  ScheduledClasses,
  deleteManyClasses,
  getHoursAndStudentsNum,
  deleteClasses,
  getDueInvoices,
  getReportCount,
};
