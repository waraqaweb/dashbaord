const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt-nodejs');
const dataBase = require('../Database/Config.js');


// Path1: Fetch one Guardian
let oneGuardian = (req, res, next)=>{
    let id = req.params.id;
    query = `SELECT guardians.*,
                (SELECT COUNT(students.guardianID)
                FROM students 
                WHERE students.guardianID = guardians.id 
                ) AS studentsCount,

                (SELECT guardianinvoices.paymentDate
                FROM guardianinvoices
                WHERE guardians.id = guardianinvoices.guardianID
                AND paid = 1 ORDER BY paymentDate DESC LIMIT 1) AS lastPaid
            FROM guardians
            LEFT JOIN students
            ON guardians.id = students.guardianID
            WHERE guardians.id=${id}
    `;
    // query = `SELECT guardians.*,
    //             (SELECT COUNT (DISTINCT classes.studentID)
    //             FROM classes 
    //             WHERE classes.studentID = students.id 
    //             ) AS studentsCount,

    //             (SELECT guardianinvoices.paymentDate
    //             FROM guardianinvoices
    //             WHERE guardians.id = guardianinvoices.guardianID
    //             AND paid = 1 ORDER BY paymentDate DESC LIMIT 1) AS lastPaid
    //         FROM guardians
    //         LEFT JOIN students
    //         ON guardians.id = students.guardianID
    //         WHERE guardians.id=${id}
    // `;
    msg="There are no results available to display."
    return next();
}
// Path2: Update Guardian
let updateGuardian = (req, res)=>{
    // return res.json({body:req.body})
    let id = req.params.id;
    //Only admin can update any data
    let localID = tokenData.id
    if(!isAdmin && id != localID){
        return res.json({success:false, msg:"Soory, you don't have the perimission"});
    }
    
    let email = req.body.email
    let bodyData = req.body;
    delete bodyData.image;
    /*
    //////
    if(req.file){
        bodyData.picture = req.file.filename
    }
    //////
    */

    delete bodyData.createdAt;
    bodyData.hoursPrice = (Number(bodyData.hoursPrice) == bodyData.hoursPrice ? bodyData.hoursPrice : null);
    bodyData.token = (Number(bodyData.token) == bodyData.token ? bodyData.token : null);


    //cloudinary
    if(req.file){
        bodyData.picture = req.file.path
    }
    //check Email not exists in guardian/teachers before
    let query = `SELECT
     (SELECT COUNT(email) FROM guardians WHERE email = ? AND id != ${id}) AS foundGuardian,
     (SELECT COUNT(email) FROM teachers WHERE email = ? AND id != ${id}) AS foundTeacher`
    dataBase.query(query, [email, email], (error, results) => {
        if (error) throw error;
        //If Exist as Guardian OR as Teacher Before
        if(results[0].foundGuardian > 0 || results[0].foundTeacher > 0){
            return res.json({success:false, msg:"This Email already exists!"})
        }

        //Start Update
        let query = `UPDATE guardians SET ? WHERE id = ${id}`;
        dataBase.query(query,[bodyData],(error, data)=>{
            if(error || !data){
                return res.json({success:false, msg:"Failed update Guardian", error:error});
            }
            res.json({success:true, msg:"Great, the data have been successfully updated."});
        })
    });

}
// Path 3: Delete Guardian
let deleteGuardian = (req, res)=>{
    let id = req.params.id;
    //Only admin can Delete any data
    let localID = tokenData.id;
    if(!isAdmin && id !== localID){
        return res.json({success:false, msg:"Soory, you don't have the perimission"});
    }
    let query = `DELETE FROM guardians WHERE id = ${id}`;
    dataBase.query(query, (error, data)=>{
        if(error){
            return res.json({success:false, msg:"Sorry, this guardian could not be deleted; perhaps he has a student."});
        }
        res.json({success:true, msg:"The guardian has been successfully deleted."});
    })
}
// Path 4: Change Guardin Password
let changeGuardianPassword =(req, res)=>{
    let id = req.params.id;
    console.log("/////////// GuardianID of change ", id)

    //Only admin can Delete any data
    let localID = tokenData.id;
    if(!isAdmin && id != localID){
        return res.json({success:false, msg:"Soory, you don't have the perimission"});
    }
    
    // Handel Validator Erorrs
    const formError = validationResult(req);
    if (!formError.isEmpty()) {
        let setError = formError.errors[0].msg;
        return res.json({ success: false, msg: setError });
    }

    //Step1: Check password is correct
        //Step2: Hash password
            //Step3: Change Password (Store)
    let password = req.body.password; //Current Password
    let newPassword = req.body.newPassword //New Password
    //Step1: Check password is correct
    let query = `SELECT * FROM guardians WHERE id = ?`;
    dataBase.query(query,id,(error,data)=>{
        bcrypt.compare(password, data[0].password, (err, isMatch) => {
            if(!isMatch){
                return res.json({success:false, msg:'The current password is an incorrect. Please try again.'})
            }
            //Step2: Hash password
            bcrypt.genSalt(10, (err,salt)=>{
                if(err) throw err;
                bcrypt.hash(newPassword, salt,null, (err, hash)=>{
                    if(err) throw err;
                    if(hash){
                        newPassword = hash;
                        //Step3: Change Password (Store)
                        dataBase.query(`UPDATE guardians SET password = ? WHERE id = ${id}`,[newPassword],(error,data)=>{
                            if(!data){
                                return res.json({ success: false, msg: "Failed change password!" })
                            }
                            res.json({ success: true, msg: "Password changed successfully." })
                        })
                    }
                })
            })
        });
    })
}

module.exports = {oneGuardian, updateGuardian, deleteGuardian, changeGuardianPassword}
