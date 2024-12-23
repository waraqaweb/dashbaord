const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  clientVerifyToken,
  adminVerifyToken,
  VerifyToken,
} = require("../Controllers/AuthController");
const uploadController = require("../Controllers/UploadController.js");
const {
  oneGuardian,
  updateGuardian,
  deleteGuardian,
  changeGuardianPassword,
} = require("../Controllers/guardianController");
const {
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
} = require("../Controllers/StudentController");
const {
  oneTeacher,
  updateTeacher,
  deleteTeacher,
  changeTeacherPassword,
  uploadFiles,
} = require("../Controllers/teacherController");
const {
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
  getDueInvoices,
  getHoursAndStudentsNum,
  deleteClasses,
  getReportCount,
} = require("../Controllers/ClassesController");
const {
  oneGuardianInvoice,
  prepaidClasses,
  updateGuardianInvoice,
  postPaidClasses,
  deleteGuardianInvoice,
  deleteTeacherInvoice,
  guardianPaymentReq,
  activatePostPaidGuardianInvoice,
  oneTeacherInvoice,
  teacherInvoiceClasses,
  updateTeacherInvoice,
  teachersPayWages,
  openNewTeacherInvoice,
  billsOfTeacher,
  billsOfGuardian,
  sentInvoice,
  changeClassInvoiceCount,
  addInvoice,
} = require("../Controllers/BillsController");
const {
  allGuardians,
  allStudents,
  addStudentInWait,
  allTeachers,
  addClass,
  allClasses,
  classesOfMonth,
  allGuardiansBills,
  allTeachersBills,
  addProcess,
  getExpenses,
  updateAdmin,
  addAdmin,
  changeAdminPassword,
} = require("../Controllers/adminController");
const {
  getNotifications,
  deleteNotification,
  seenNotification,
  enableEmails,
  isEmailsEnabled,
} = require("../Controllers/NotificationAndEmailController");
const { nextDbProccess } = require("../Controllers/helperController");

/* #################### Guardian Account ################## */
// Path0: Add new Student
router.post("/v1/guardian/students/path0", VerifyToken, addStudent);

// Path1: Fetch the student's data
router.get("/v1/guardian/students/path2");
/* #################### Teacher Account ################## */

/* #################### Admin Account #################### */
// Path 1: Update admin account
router.post(
  "/v1/admin/admin/account/path1/:id",
  adminVerifyToken,
  uploadController.upload.single("image"),
  uploadController.uploadValidation,
  updateAdmin
);

// Path 2: Add new admin
router.post(
  "/v1/admin/admin/account/path2",
  [
    check("name").notEmpty().withMessage("Name can't be empty!"),
    check("email").isEmail().withMessage("Please entre valid Email"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password can't be less then 8 characters"),
  ],
  adminVerifyToken,
  addAdmin
);

// Path 2: Change Password
router.post(
  "/v1/admin/admin/account/path2/:id",
  [
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password can't be less then 8 characters"),
    check("newPassword")
      .isLength({ min: 8 })
      .withMessage("Password can't be less then 8 characters"),
  ],
  adminVerifyToken,
  changeAdminPassword
);

/* ********* Guardians Routes Start*********** */
// Path0: Fetch all guardians
router.get("/v1/admin/guardians/path0", adminVerifyToken, allGuardians);
// Path1: Fetch One Guardian
router.get(
  "/v1/admin/guardians/path1/:id",
  VerifyToken,
  oneGuardian,
  nextDbProccess
);
// Path2: Update Guardian
router.post(
  "/v1/admin/guardians/path2/:id",
  VerifyToken,
  uploadController.upload.single("image"),
  uploadController.uploadValidation,
  updateGuardian
);
// Path 3: Delete Guardian
router.delete(
  "/v1/admin/guardians/path3/:id",
  adminVerifyToken,
  deleteGuardian
);
// Path 4: Change Password
router.post(
  "/v1/admin/guardians/path4/:id",
  [
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password can't be less then 8 characters"),
    check("newPassword")
      .isLength({ min: 8 })
      .withMessage("Password can't be less then 8 characters"),
  ],
  VerifyToken,
  changeGuardianPassword
);

/* ********* Students Routes Start*********** */
// Path0: Fetch all students
router.get(
  "/v1/admin/students/path0",
  adminVerifyToken,
  allStudents,
  nextDbProccess
);
// Path1: Add students in Wait-list
router.post("/v1/admin/students/path1", adminVerifyToken, addStudentInWait);
// Path2: Fetch One Student
router.get(
  "/v1/admin/students/path2/:id",
  VerifyToken,
  oneStudent,
  nextDbProccess
);
// Path3: Update Student
router.post(
  "/v1/admin/students/path3/:id",
  VerifyToken,
  uploadController.upload.single("image"),
  uploadController.uploadValidation,
  updateStudent
);
// Path 4: Delete Student
router.delete("/v1/admin/students/path4/:id", VerifyToken, deleteStudent);
// Path 5: Add Periodic evaluations
router.post(
  "/v1/admin/students/path5",
  adminVerifyToken,
  AddPeriodicEvaluation
);
// Path 6: Fetch Periodic evaluations
router.get(
  "/v1/admin/students/path6/:id",
  adminVerifyToken,
  fetchPeriodicEvaluation,
  nextDbProccess
);
// Path 7: Fetch Wait-list students
router.get(
  "/v1/admin/students/path7",
  adminVerifyToken,
  fetchWaitListStudents,
  nextDbProccess
);
// Path 8: Fetch 1 Wait-list student
router.get(
  "/v1/admin/students/path8/:id",
  adminVerifyToken,
  fetchWaitListStudent,
  nextDbProccess
);
// Path 9: Update 1 Wait-list student
router.post(
  "/v1/admin/students/path9/:id",
  adminVerifyToken,
  updateWaitListStudent
);
// Path 10: delete 1 Wait-list student
router.delete(
  "/v1/admin/students/path10/:id",
  adminVerifyToken,
  deleteWaitListStudent
);

//Path 0: Fetch students of Teacher
router.get(
  "/v1/teacher/students/path0",
  VerifyToken,
  studentsOfTeacher,
  nextDbProccess
);
//Path 1: Fetch students of Guardian
router.get(
  "/v1/teacher/students/path1",
  VerifyToken,
  studentsOfGuardian,
  nextDbProccess
);

/* ********* Teacher Routes Start*********** */
// Path0: Fetch all Teachers
router.get(
  "/v1/admin/teachers/path0",
  VerifyToken,
  allTeachers,
  nextDbProccess
);
// Path1: Fetch One Teacher
router.get(
  "/v1/admin/teachers/path1/:id",
  VerifyToken,
  oneTeacher,
  nextDbProccess
);
// Path2: Update Teacher
router.post(
  "/v1/admin/teachers/path2/:id",
  VerifyToken,
  uploadController.upload.single("image"),
  uploadController.uploadValidation,
  updateTeacher
);
// Path 3: Delete Teacher
router.delete("/v1/admin/teachers/path3/:id", adminVerifyToken, deleteTeacher);
// Path 4: Change Password
router.post(
  "/v1/admin/teachers/path4/:id",
  [
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password can't be less then 8 characters"),
    check("newPassword")
      .isLength({ min: 8 })
      .withMessage("Password can't be less then 8 characters"),
  ],
  VerifyToken,
  changeTeacherPassword
);

// Path5: Upload files
router.post(
  "/v1/admin/teachers/path5/:id",
  VerifyToken,
  uploadController.upload.single("image"),
  uploadController.uploadValidation,
  uploadFiles
);

/* ********* Classes Routes Start*********** */
// Path0: Add new Class
router.post("/v1/admin/classes/path0", adminVerifyToken, addClass);
// Path1: Fetch all classes
router.get(
  "/v1/admin/classes/path1",
  adminVerifyToken,
  allClasses,
  nextDbProccess
);
// Path2: Fetch One Class
router.get(
  "/v1/admin/classes/path2/:id",
  VerifyToken,
  oneClass,
  nextDbProccess
);
// Path3: End Class (Add class report)
router.post("/v1/admin/classes/path3/:id", VerifyToken, endClass);
// Path4: Update Class
router.post("/v1/admin/classes/path4/:id", adminVerifyToken, updateClass);
// Path5: Update Class Report
router.post("/v1/admin/classes/path5/:id", adminVerifyToken, updateClassReport);
// Path 6: Delete Class
router.delete("/v1/admin/classes/path6/:id", adminVerifyToken, deleteClass);
// Path7: Cancel class request
router.post("/v1/admin/classes/path7", VerifyToken, cancelClassReq);
// Path8: Cancel class request
router.post("/v1/admin/classes/path8", VerifyToken, RescheduleClassReq);
//Path 9: Remind Teacher/Student
router.post("/v1/admin/classes/path9", VerifyToken, remindUser);
//Path 10: Remind Teacher/Student
router.get(
  "/v1/admin/classes/path10",
  adminVerifyToken,
  classesOfMonth,
  nextDbProccess
);
//Path 11: Fetch schedule Data
router.get(
  "/v1/admin/classes/path11",
  adminVerifyToken,
  fetchScheduleData,
  nextDbProccess
);
//Path 12: Reschedule the Classes
router.post(
  "/v1/admin/classes/path12/:id",
  adminVerifyToken,
  RescheduleClasses
);
//Path 13: Fetch all scheduled Classes of Teacher / Student
router.get(
  "/v1/admin/classes/path13",
  VerifyToken,
  ScheduledClasses,
  nextDbProccess
);
// Path 14: Delete All Class of a certain student and teacher
router.post("/v1/admin/classes/path14", adminVerifyToken, deleteManyClasses);
// Path 14: Delete All Class from a certain date
router.post("/v1/admin/classes/path15", adminVerifyToken, deleteClasses);

//Path 0: Fetch classes of Teacher
router.get(
  "/v1/teacher/classes/path0",
  VerifyToken,
  classesOfTeacher,
  nextDbProccess
);
//Path 0: Fetch classes of Guardian's students
router.get(
  "/v1/guardian/classes/path0",
  VerifyToken,
  classesOfGuardianStudents,
  nextDbProccess
);
//Path 0: Fetch classes of Guardian's students
router.get(
  "/v1/client/classes/path0",
  VerifyToken,
  getHoursAndStudentsNum,
  nextDbProccess
);
//Path 1: Fetch ReportCount
router.get(
  "/v1/client/classes/path1",
  VerifyToken,
  getReportCount,
  nextDbProccess
);
//Path 0: Fetch classes of Guardian's students
router.get(
  "/v1/client/hours/path0",
  VerifyToken,
  getDueInvoices,
  nextDbProccess
);

/* ********* Bills Routes Start*********** */
// Path0: Fetch all guardians' bills
router.get(
  "/v1/admin/bills/path0",
  adminVerifyToken,
  allGuardiansBills,
  nextDbProccess
);
// Path2: Fetch One guardian's Invoice
router.get(
  "/v1/admin/bills/path2/:id",
  VerifyToken,
  oneGuardianInvoice,
  nextDbProccess
);
// Path3: Fetch prepaidClasses of an Invoice
router.get(
  "/v1/admin/bills/path3/:id",
  VerifyToken,
  prepaidClasses,
  nextDbProccess
);
// Path4: Update guardian's Invoice
router.post(
  "/v1/admin/bills/path4/:id",
  adminVerifyToken,
  updateGuardianInvoice
);
// Path5: Fetch postPaidClasses of an Invoice
router.get(
  "/v1/admin/bills/path5/:id",
  VerifyToken,
  postPaidClasses,
  nextDbProccess
);
// Path6: Delete Invoice
router.delete(
  "/v1/admin/bills/guardian/path6/:id",
  adminVerifyToken,
  deleteGuardianInvoice
);

// Path7: Guardians(postpad) 1er of month (Inform them (email))
router.get(
  "/v1/admin/bills/guardian/path7",
  adminVerifyToken,
  guardianPaymentReq
);
// Path8: Guardians(postpad) Active the last inactive Invoice (run on guardian join his account)
router.post(
  "/v1/admin/bills/guardian/path8/:id",
  VerifyToken,
  activatePostPaidGuardianInvoice
);
// path 9
router.post("/v1/admin/bills/guardian/path9", adminVerifyToken, addInvoice);

//path 11: change invoice count
router.patch(
  "/v1/admin/bills/path11/:id",
  adminVerifyToken,
  changeClassInvoiceCount
);

//Path 0: Fetch Bills of Guardian
router.get(
  "/v1/guardian/bills/path0",
  VerifyToken,
  billsOfGuardian,
  nextDbProccess
);
//Path 1: Bill of Guardian sent
router.patch("/v1/guardian/bills/path1/:id", VerifyToken, sentInvoice);

// Path6: Fetch all teachers' bills
router.get(
  "/v1/admin/bills/path6",
  adminVerifyToken,
  allTeachersBills,
  nextDbProccess
);
// Path7: Fetch One teacher's Invoice
router.get(
  "/v1/admin/bills/path7/:id",
  VerifyToken,
  oneTeacherInvoice,
  nextDbProccess
);
// Path8: Fetch Teacher Invoice Classes
router.get(
  "/v1/admin/bills/path8",
  VerifyToken,
  teacherInvoiceClasses,
  nextDbProccess
);
// Path9: Update teacher's Invoice
router.post(
  "/v1/admin/bills/path9/:id",
  adminVerifyToken,
  updateTeacherInvoice
);
// Path10: Teacher's Paywages 1er of month (Inform them (email))
router.get(
  "/v1/admin/bills/path10",
  adminVerifyToken,
  teachersPayWages,
  nextDbProccess
);
// Path11: Teacher's invoice: Open new (run on teacher join his account)
router.post(
  "/v1/admin/bills/teachers/path11/:id",
  VerifyToken,
  openNewTeacherInvoice
);
// Path12: Delete teacher Invoice
router.delete(
  "/v1/admin/bills/teachers/path12/:id",
  adminVerifyToken,
  deleteTeacherInvoice
);
//Path 0: Fetch Bills of Teacher
router.get(
  "/v1/teacher/bills/path0",
  VerifyToken,
  billsOfTeacher,
  nextDbProccess
);

/* ********* Expenses Routes Start*********** */
// Path1: Update teacher's Invoice
router.post("/v1/admin/expenses/path1", adminVerifyToken, addProcess);
// Path2: Update teacher's Invoice
router.get(
  "/v1/admin/expenses/path2",
  adminVerifyToken,
  getExpenses,
  nextDbProccess
);

/* ********* Notifications Routes Start*********** */
// Path1: Get Notifications
router.get(
  "/v1/admin/notifications/path1",
  VerifyToken,
  getNotifications,
  nextDbProccess
);
//Path2: Delete Notification
router.delete(
  "/v1/admin/notifications/path2/:id",
  VerifyToken,
  deleteNotification
);
//Path3: Delete Notification
router.post("/v1/admin/notifications/path3/:id", VerifyToken, seenNotification);

/* ********* Emails Routes Start*********** */
// Path1: Enable and Disable Emails
router.post("/v1/admin/emails/path1", adminVerifyToken, enableEmails);
// Path2: Enable and Disable Emails
router.get("/v1/admin/emails/path2", adminVerifyToken, isEmailsEnabled);

module.exports = router;
