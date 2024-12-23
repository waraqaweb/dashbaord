const mysql = require("mysql");

// MySQL connection configurations
module.exports = con = mysql.createPool({
  connectionLimit: 100, //important
  host: "localhost",
  user: "root",
  password: "Waraqa123#",
  database: "waraqa",
  port: 3306,
});
//con.connect(function(err) {
//  if (err) throw err;
//console.log("Connected!");
//});

/*
(Foreign key : guardians - students ) :
ALTER TABLE students
ADD CONSTRAINT gsrel
FOREIGN KEY (guardianID)
REFERENCES guardians(id)
ON UPDATE CASCADE
ON DELETE CASCADE


(Foreign key : classes - teachers ) :
ALTER TABLE classes
ADD CONSTRAINT ctrel
FOREIGN KEY (teacherID)
REFERENCES teachers(id)
ON UPDATE CASCADE


(Foreign key : classes - students ) :
ALTER TABLE classes
ADD CONSTRAINT csrel
FOREIGN KEY (studentID)
REFERENCES students(id)
ON UPDATE CASCADE


(Foreign key : classes - guardians ) :
ALTER TABLE classes
ADD CONSTRAINT gcrel
FOREIGN KEY (guardianID)
REFERENCES guardians(id)
ON UPDATE CASCADE


(Foreign key : scheduledclasses - guardians ) :
ALTER TABLE scheduledclasses
ADD CONSTRAINT gssrel
FOREIGN KEY (guardianID)
REFERENCES guardians(id)
ON UPDATE CASCADE

(Foreign key : classes - guardianinvoices ) :
ALTER TABLE classes
ADD CONSTRAINT icsrel
FOREIGN KEY (invoiceID)
REFERENCES guardianinvoices(id)
ON UPDATE CASCADE


(Foreign key : guardians - guardianinvoices ) :
ALTER TABLE guardianinvoices
ADD CONSTRAINT girel
FOREIGN KEY (guardianID)
REFERENCES guardians(id)
ON UPDATE CASCADE
ON DELETE CASCADE

(Foreign key : teachers - teacherinvoices ) :
ALTER TABLE teacherinvoices
ADD CONSTRAINT tirel
FOREIGN KEY (teacherID)
REFERENCES teachers(id)
ON UPDATE CASCADE
ON DELETE CASCADE

(Foreign key : teachers - periodicevaluations ) :
ALTER TABLE periodicevaluations
ADD CONSTRAINT esrel
FOREIGN KEY (teacherID)
REFERENCES teachers(id)
ON UPDATE CASCADE
ON DELETE CASCADE

(Foreign key : students - periodicevaluations ) :
ALTER TABLE periodicevaluations
ADD CONSTRAINT essrel
FOREIGN KEY (studentID)
REFERENCES students(id)
ON UPDATE CASCADE
ON DELETE CASCADE

(Foreign key : classes - classreport ) :
ALTER TABLE classreport
ADD CONSTRAINT crrel
FOREIGN KEY (classID)
REFERENCES classes(id)
ON UPDATE CASCADE
ON DELETE CASCADE


(Foreign key : teachers - classesreq ) :
ALTER TABLE classesreq
ADD CONSTRAINT trrel
FOREIGN KEY (teacherID)
REFERENCES teachers(id)
ON UPDATE CASCADE
ON DELETE CASCADE

(Foreign key : guardians - classesreq ) :
ALTER TABLE classesreq
ADD CONSTRAINT gcrrel
FOREIGN KEY (guardianID)
REFERENCES guardians(id)
ON UPDATE CASCADE
ON DELETE CASCADE


(Foreign key : students - classesreq ) :
ALTER TABLE classesreq
ADD CONSTRAINT srrel
FOREIGN KEY (studentID)
REFERENCES students(id)
ON UPDATE CASCADE
ON DELETE CASCADE


(Foreign key : classes - classesreq ) :
ALTER TABLE classesreq
ADD CONSTRAINT ccrrel
FOREIGN KEY (classID)
REFERENCES classes(id)
ON UPDATE CASCADE
ON DELETE CASCADE



(Foreign key : guardians - notifications ) :
ALTER TABLE notifications
ADD CONSTRAINT gnrel
FOREIGN KEY (guardianID)
REFERENCES guardians(id)
ON UPDATE CASCADE
ON DELETE CASCADE


(Foreign key : teachers - notifications ) :
ALTER TABLE notifications
ADD CONSTRAINT tnrel
FOREIGN KEY (teacherID)
REFERENCES teachers(id)
ON UPDATE CASCADE
ON DELETE CASCADE

(Foreign key : students - notifications ) :
ALTER TABLE notifications
ADD CONSTRAINT snrel
FOREIGN KEY (studentID)
REFERENCES students(id)
ON UPDATE CASCADE
ON DELETE CASCADE


(Foreign key : scheduledclasses - classes ) :
ALTER TABLE classes
ADD CONSTRAINT screl
FOREIGN KEY (scheduleID)
REFERENCES scheduledclasses(id)
ON UPDATE CASCADE

*/
