const Joi = require('./joiExtensions');

const userSchema = Joi.object({
    username: Joi.string().min(3).max(50).optional().trim().escapeHTML(),
    email: Joi.string().email().required().trim().escapeHTML(),
    password: Joi.string().min(8).max(255).required().trim().escapeHTML(),
    penName: Joi.string().max(100).optional().trim().escapeHTML(),
    birthday: Joi.date().optional(),
    otp_code: Joi.string().length(6).optional().escapeHTML(),
    otp_expires_at: Joi.date().iso().optional()
});

const validatePost = (req, res, next) => {
    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        // Khi có lỗi, render trang lỗi với thông báo
        return res.status(400).render('error/joi', {
            message: "Dữ liệu không hợp lệ",
            details: error.details.map(err => err.message)
        });
    }
    next();
};

module.exports = validatePost;
