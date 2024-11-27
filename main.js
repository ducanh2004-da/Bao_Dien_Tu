import express from 'express';
import { engine } from 'express-handlebars';

const app = express();
const port = 3000; // Đảm bảo cổng đã được định nghĩa

// Định nghĩa helper 'section'
const hbs = engine({
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
  },
});

app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('dashboard',{
      layout: 'admin'
    });
});
app.get('/User', (req, res) => {
  res.render('manageUsers', {
      layout: 'admin'
  });
});
app.get('/Categories', (req, res) => {
  res.render('manageCategories', {
      layout: 'admin'
  });
});
app.get('/Tags', (req, res) => {
  res.render('manageTags', {
      layout: 'admin'
  });
});
app.get('/Moderation', (req, res) => {
  res.render('publishingModeration', {
      layout: 'admin'
  });
});
app.get('/ReadAndModeration', (req, res) => {
  res.render('readAndModeration', {
      layout: 'admin'
  });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});