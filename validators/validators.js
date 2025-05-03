// validators/validator.js
const Joi = require('./joiExtensions');
const customJoi = require('./joiExtensions');

// Schema cho Post (User)
const userSchema = Joi.object({
  username: Joi.string().min(3).max(50).optional().trim().escapeHTML(),
  email: Joi.string().email().required().trim().escapeHTML(),
  password: Joi.string().min(5).max(255).required().trim().escapeHTML(),
  penName: Joi.string().max(100).optional().trim().escapeHTML(),
  birthday: Joi.date().optional(),
  otp_code: Joi.string().length(6).optional().escapeHTML(),
  otp_expires_at: Joi.date().iso().optional(),
  _csrf: Joi.string().required()
});

// Schema cho search query (tìm kiếm nội dung)
const searchQuerySchema = customJoi.object({
  q: customJoi.string()
    .trim()
    .escapeHTML()
    .max(100)
    .pattern(/^[A-Za-z0-9_\-\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Search query chỉ được chứa chữ, số, dấu gạch dưới (_), gạch ngang (-) và khoảng trắng',
      'string.max': 'Search query không được vượt quá 100 ký tự',
      'any.required': 'Tham số q là bắt buộc cho tìm kiếm'
    }),
  page: customJoi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.base': 'Tham số page phải là số',
      'number.min': 'Page phải lớn hơn hoặc bằng 1'
    })
});

// Schema cho pagination (chỉ page) dùng trong category/tag
const pageQuerySchema = customJoi.object({
  page: customJoi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.base': 'Tham số page phải là số',
      'number.min': 'Page phải lớn hơn hoặc bằng 1'
    })
});

// Middleware validate cho POST người dùng
const validatePost = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).render('error/joi', {
      message: 'Dữ liệu không hợp lệ',
      details: error.details.map(err => err.message)
    });
  }
  next();
};

// Middleware validate cho search route
const validateSearch = (req, res, next) => {
  const { error } = searchQuerySchema.validate(req.query, { abortEarly: false });
  if (error) {
    return res.status(400).render('error/joi', {
      message: 'Dữ liệu tìm kiếm không hợp lệ',
      details: error.details.map(err => err.message)
    });
  }
  next();
};

// Middleware validate cho pagination route (category, tag)
const validatePage = (req, res, next) => {
  const { error } = pageQuerySchema.validate(req.query, { abortEarly: false });
  if (error) {
    return res.status(400).render('error/joi', {
      message: 'Tham số trang không hợp lệ',
      details: error.details.map(err => err.message)
    });
  }
  next();
};

module.exports = {
  validatePost,
  validateSearch,
  validatePage
};
