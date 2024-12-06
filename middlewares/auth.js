// Kiểm tra xem người dùng đã đăng nhập hay chưa (sử dụng session)
module.exports.isUser = function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/api');
    }
    next();
};

//Kiểm tra admin
module.exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.user.role === 'admin') return next();
    res.status(403).send('Access Denied! Wrong Role');
}
//kiểm tra editor
module.exports.isEditor = (req, res, next) => {
    if (req.session.user && req.user.role === 'editor') return next();
    res.status(403).send('Access Denied! Wrong Role');
}
//kiểm tra phóng viên
module.exports.isWriter = (req, res, next) => {
    if (req.session.user && req.user.role === 'writer') return next();
    res.status(403).send('Access Denied! Wrong Role');
}
//kiểm tra người dùng đã đăng kí
module.exports.isSubscriber = (req, res, next) => {
    if (req.session.user && req.user.role === 'subscriber') return next();
    res.status(403).send('Access Denied! Wrong Role');
}