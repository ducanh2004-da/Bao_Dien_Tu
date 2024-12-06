module.exports.showMainPage = (req, res) => {
    res.render('subsPage/subscriber_main', { 
        layout: false, 
        user: req.session.user // Truyền session thông tin người dùng vào view 
    });
};
