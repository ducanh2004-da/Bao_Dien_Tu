const db = require('../utils/db');

const getAllPosts = (callback) => {
    db.query('SELECT * FROM posts', callback);
};
const updatePublished = (id,callback) =>{
    db.query("UPDATE posts SET statusName = 'Published' WHERE id = ? ",
        [id],callback
    )
}
const getPostById = (id,callback) =>{
    db.query("SELECT * FROM posts WHERE id = ?",
        [id],callback
    )
}
const updatePost = (id, post, callback) =>{
    db.query('UPDATE posts SET title = ?, abstract = ?, content = ? WHERE id = ? ',
        [post.title,post.abstract,post.content,id],callback
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
    deletes,
    getPostById,
    updatePost
};