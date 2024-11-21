const db = require('../utils/db');

const getAllPosts = (callback) => {
    db.query('SELECT * FROM posts', callback);
};
const updatePublished = (id,callback) =>{
    db.query("UPDATE posts SET statusName = 'Published' WHERE id = ? ",
        [id],callback
    )
}
const deletes = (id,callback) =>{
    db.query('DELETE FROM posts WHERE id = ?',
        [id],callback
    )
}
module.exports = {
    getAllPosts, 
    updatePublished,
    deletes
};