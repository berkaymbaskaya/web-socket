const { pool } = require('./Database');
const SaveMessage = async (formData) => {
    let now=Date.now();
    if(formData.message_type!=="file"){
        const query = ` INSERT INTO allmessages (room_id,name,from_id,date,message_text,message_type)
        VALUES ('${formData.room_id}','${formData.username}', '${formData.from}', ${now},'${formData.text}','${formData.message_type}')`;
        console.log("my query",query)
        const result = await pool.query(query); 
        console.log(result)
    }
    else if(formData.message_type=="file"){
        const query = ` INSERT INTO allmessages (room_id,name,from_id,date,message_text,message_type,src)
        VALUES ('${formData.room_id}','${formData.username}', '${formData.from}', ${now},'${formData.text}','${formData.message_type}','${formData.src}')`;
        console.log("my query",query)
        const result = await pool.query(query); 
        console.log(result)
    }

}
module.exports = {
    SaveMessage,
};