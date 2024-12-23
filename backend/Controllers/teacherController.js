const { validationResult } = require('express-validator');
const dataBase = require('../Database/Config.js');
const bcrypt = require('bcrypt-nodejs');
const {sendEmail, sendNotification} = require('./NotificationAndEmailController');



// Path1: Fetch one Teacher
let oneTeacher = (req, res, next)=>{
    let id = req.params.id;

    query = `SELECT teachers.*,  
    (SELECT COUNT (DISTINCT classes.studentID)
    FROM classes 
    WHERE classes.teacherID = teachers.id 
    ) AS studentsCount,

    (SELECT COUNT (classesreq.teacherCancelReq)
    FROM classesreq 
    WHERE classesreq.teacherID = ${id}
    ) AS CancelationReq
    
    FROM teachers
    WHERE teachers.id=${id}
    `;
    msg="There are no results available to display."
    return next();
}
// Path2: Update Teacher
let updateTeacher = (req, res)=>{
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
    delete bodyData.createdAt;
    delete bodyData.CancelationReq;
    /*
    //////
    if(req.file){
        bodyData.picture = req.file.filename
    }
    //////
    */

    //cloudinary
    if(req.file){
        bodyData.picture = req.file.path
    }

    //PATCH BONUS
    bodyData.bonus = (Number(bodyData.bonus) == bodyData.bonus ? bodyData.bonus : null);
    bodyData.accountNumber = (Number(bodyData.accountNumber) == bodyData.accountNumber ? bodyData.accountNumber : null);
    bodyData.token = (Number(bodyData.token) == bodyData.token ? bodyData.token : null);
    

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
        let query = `UPDATE teachers SET ? WHERE id = ${id}`;
        dataBase.query(query,[bodyData],(error, data)=>{
            if(error || !data){
                return res.json({success:false, msg:"Failed update teacher",error});
            }
            //Config Admin Email
            configAdminEmail = {
                subject : 'A teacher completed his information.',
                html:`
                    <p>Teacher "${bodyData.name}" has completed his information.</p>
                    `
            }
            //Config mail
            configTeacherEmail = {
                to: email,
                subject: 'ورقة - شكرا لإكمال بياناتك!',
                html: `
                <div style="direction:rtl; text-align:right">
                    <p>السلام عليكم و رحمة الله و بركاته,</p>
                    <p>لعل أمورك بخير إن شاء الله</p>
                    <p>سنراجعُها في أسرع وقت، وفي حال كانت هُناك حَاجة لأيةِ معلوماتٍ إضافيةٍ سنتواصلُ معَك.</p>
                    <p>الخطوة التاليةُ التي يجبُ أَنْ تَتَوقَعَها: ستتلقى رسالة منَ المديرِ المباشر لجدولةِ البرنامج التدريبي.</p>
                    <p>جزاك الله خيراً</p>
                </div>
            `
            }
            sendEmail(configTeacherEmail);
            //Config Notification
            notiConfig = {
                type:0,
                admin:1,
                teacherID:bodyData.id,
                guardianID:null,
                studentID:null,
                adminMsg:`Teacher "${bodyData.name}" has completed his information.`,
                teacherMsg:'Your information has been updated successfully.',
                guardianMsg:null
            }
            //Send Notification
            sendNotification(notiConfig);
    
            res.json({success:true, msg:"Great, the data have been successfully updated."});
        })


    });



}
// Path 3: Delete Teacher
let deleteTeacher = (req, res)=>{
    let id = req.params.id;
    //Only admin can Delete any data
    let localID = tokenData.id;
    if(!isAdmin && id !== localID){
        return res.json({success:false, msg:"Soory, you don't have the perimission"});
    }
    let query = `DELETE FROM teachers WHERE id = ${id}`;
    dataBase.query(query, (error, data)=>{
        if(error){
            return res.json({success:false, msg:"Sorry, this teacher could not be deleted; perhaps he has a class."});
        }
        res.json({success:true, msg:"'The teacher has been successfully deleted.'"});
    })
}

let changeTeacherPassword =(req, res)=>{
    let id = req.params.id;

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
    // let id = req.params.id;
    let password = req.body.password; //Current Password
    let newPassword = req.body.newPassword //New Password
    //Step1: Check password is correct
    let query = `SELECT * FROM teachers WHERE id = ?`;
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
                        dataBase.query(`UPDATE teachers SET password = ? WHERE id = ${id}`,[newPassword],(error,data)=>{
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

let uploadFiles = (req, res)=>{
    return res.json({sucess:false, msg:"Failed upload files!"})
}

module.exports = {oneTeacher, updateTeacher, deleteTeacher, changeTeacherPassword, uploadFiles}