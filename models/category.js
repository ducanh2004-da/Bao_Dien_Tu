const db = require('../utils/db');
const getAllCategories = (callback) =>{
    db.query('SELECT * FROM categories',callback)
}
const add = (newCat,callback) =>{
    db.query('INSERT INTO categories(name) VALUE(?)',
        [newCat.name], callback);
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
module.exports = {
    getAllCategories,
    add,
    update,
    getCatById,
    deletes
};