const User = require('../models/user');
const Category = require('../models/category');
const Post =require('../models/post');

module.exports.showAll = (req,res) =>{
    User.getAllUser((err,users)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Lấy danh sách danh mục
        Category.getAllCategories((err, categories) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            Post.getAllPosts((err, posts) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
            res.render('admin/home',{
                posts,users,
                categories,
                user: req.session.user
            })
        })
    })
}
)}
module.exports.viewPost = (req,res) =>{
    Post.getAllPosts((err, posts) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
    res.render('admin/showPost',{posts: posts[0]});
    })
}
module.exports.acceptPost = (req,res) =>{
    const id = req.params.id;
    Post.updatePublished(id,(err)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/admin');
    })
}
module.exports.notAcceptPost = (req,res) =>{
    const id = req.params.id;
    Post.deletes(id,(err)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/admin');
    })
}
module.exports.viewEditCategory = (req,res) =>{
    const id = req.params.id;
    Category.getCatById(id,(err,category)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('admin/editCategory',{category: category[0]})
    })
}
module.exports.viewAddCategory = (req,res) =>{
<<<<<<< HEAD
    res.render('admin/addCategory', { layout:false });
}
module.exports.addCategory = (req,res) =>{
    const newCat = req.body;
=======
    User.getEditor((err,user)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        Category.getParentCat((err,category)=>{
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.render('admin/addCategory', 
                { 
                    layout:false ,
                    user:user,
                    category:category
    
                });
        })
    })
}
module.exports.addCategory = (req,res) =>{
    const newCat = req.body;
    const editorId = req.body.editorId === "" ? null : req.body.editorId;
    const parentId = req.body.parentId === "" ? null : req.body.parentId;
>>>>>>> 1095213 (Hoan thien dang ki dang nhap,admin,guest,editor,writer)
    if (!newCat || !newCat.name) {
        return res.status(400).json({ error: 'All fields are required' });
    }

<<<<<<< HEAD
    Category.add(newCat,(err)=>{
=======
    Category.add(editorId,parentId,newCat,(err)=>{
>>>>>>> 1095213 (Hoan thien dang ki dang nhap,admin,guest,editor,writer)
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/admin');
    })
}
module.exports.EditCategory = (req,res) =>{
    const id = req.params.id;
    const cat = req.body;
    Category.update(id,cat,(err)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/admin');
    })
}
module.exports.deleteCategory = (req,res) =>{
    const id = req.params.id;
    Category.deletes(id,(err)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/admin');
    })
}
module.exports.viewUser = (req,res) =>{
    const id = req.params.id;
    User.findUser(id,(err,users)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('admin/showUser',{users: users[0]})
    })
}
module.exports.viewEditUser = (req,res) =>{
    const id = req.params.id;
    User.findUser(id,(err,user)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('admin/editUser',{user: user[0]})
    })
}
module.exports.deleteUser = (req,res) =>{
    const id = req.params.id;
    User.deletes(id,(err)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/admin');
    })
}

module.exports.EditUser = (req,res) =>{
    const id = req.params.id;
    const user = req.body;
    User.updateRole(id,user,(err)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/admin');
    })
}

module.exports.viewEditPost = (req,res) =>{
    const id = req.params.id;
    Post.getPostById(id,(err,post)=>{
        if(err){
            return res.status(500).json({ error: err.message });
        }
        res.render('admin/editPost',{post:post[0]})
    })

}
module.exports.EditPost = (req,res) =>{
    const id = req.params.id;
    const post = req.body;
    Post.updatePost(id,post,(err)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/admin');
    })
<<<<<<< HEAD
}
=======
}
>>>>>>> 1095213 (Hoan thien dang ki dang nhap,admin,guest,editor,writer)
