const db = require('../utils/db');

const getAllCategories = (callback) => {
    db.query('SELECT * FROM categories', callback);
};

const add = (editorId, parentId, newCat, callback) => {
    db.query(
        'INSERT INTO categories(name, parent_id, editorId) VALUE(?,?,?)',
        [newCat.name, parentId, editorId],
        callback
    );
};

const update = (id, Cat, callback) => {
    db.query(
        'UPDATE categories SET name = ? WHERE id = ?',
        [Cat.name, id],
        callback
    );
};

const getCatById = (id, callback) => {
    db.query(
        'SELECT * FROM categories WHERE id = ?',
        [id],
        callback
    );
};

const deletes = (id, callback) => {
    db.query(
        'DELETE FROM categories WHERE id = ?',
        [id],
        callback
    );
};

const getParentCat = (callback) => {
    db.query(
        'SELECT * FROM categories WHERE parent_id IS NULL',
        callback
    );
};

const getEditorCats = (editorId, callback) => {
    db.query(
        'SELECT * FROM categories WHERE editorId = ?',
        [editorId],
        callback
    );
}

module.exports = {
    getAllCategories,
    add,
    update,
    getCatById,
    deletes,
    getParentCat
};
