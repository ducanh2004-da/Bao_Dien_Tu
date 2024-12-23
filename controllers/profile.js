const User = require('../models/user');

module.exports.show = (req,res) =>{
    const user = req.session.user;
    // Định dạng ngày thành 'YYYY-MM-DD'
    User.findById(req.session.user.id,(err,user)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (user.birthday) {
            const formattedBirthday = new Date(user.birthday).toISOString().split('T')[0];
            user.birthday = formattedBirthday; 
        }
        res.render('user/profile',{
            layout: false, 
            user: user
        })
    })
}

module.exports.viewEdit = (req,res) =>{
    res.render('user/editProfile',{
        layout: false, 
        user: req.session.user
    })
}

module.exports.Edit = (req,res) =>{
    const id = req.session.user.id;
    const user = req.body;
    User.editUser(id,user,(err)=>{
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('/profile');
    })
}