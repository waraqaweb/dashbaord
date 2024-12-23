const dataBase = require('../Database/Config.js');
let nextDbProccess = (req, res)=>{
    dataBase.query(query, (error, data)=>{
        if (error || !data.length) {
            return res.json({success:false, msg:msg, error:error});
        }
        return res.json({success:true, rows: data});
    })
}

module.exports = {nextDbProccess}