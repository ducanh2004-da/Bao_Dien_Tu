const db = require('../utils/db');
const getAllCategories = (callback) =>{
    db.query('SELECT * FROM categories',callback)
}
<<<<<<< HEAD
const add = (newCat,callback) =>{
    db.query('INSERT INTO categories(name) VALUE(?)',
        [newCat.name], callback);
=======
const add = (editorId,parentId,newCat,callback) =>{
    db.query('INSERT INTO categories(name,parent_id,editorId) VALUE(?,?,?)',
        [newCat.name,parentId,editorId], callback);
>>>>>>> 1095213 (Hoan thien dang ki dang nhap,admin,guest,editor,writer)
}
const update = (id,Cat,callback) =>{
    db.query('UPDATE categories SET name = ? WHERE id = ? ',
        [Cat.name,id],callback
    )
}
const getCatById = (id,callback) =>{
    db.query('SELECT * FROM categories WHERE id = ?',
        [id],callback)
}
const deletes = (id,callback) =>{
    db.query('DELETE FROM categories WHERE id = ?',
        [id],callback
    )
}
<<<<<<< HEAD
=======
const getParentCat = (callback) => {
    db.query("SELECT * FROM categories WHERE parent_id IS NULL", callback);
}
>>>>>>> 1095213 (Hoan thien dang ki dang nhap,admin,guest,editor,writer)
module.exports = {
    getAllCategories,
    add,
    update,
    getCatById,
<<<<<<< HEAD
    deletes
=======
    deletes,
    getParentCat
>>>>>>> 1095213 (Hoan thien dang ki dang nhap,admin,guest,editor,writer)
};