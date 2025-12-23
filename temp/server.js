const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let users = [];
try {
  users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
} catch (e) {
  users = [];
}

function save() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    console.error('保存数据失败', e);
  }
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// GET /admin/v1/users
// 支持 query: page, pageSize, keyword, status
app.get('/admin/v1/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const keyword = (req.query.keyword || '').toString().trim().toLowerCase();
  const status = req.query.status;

  let list = users.slice();
  if (keyword) {
    list = list.filter(
      (u) =>
        (u.nickname && u.nickname.toLowerCase().includes(keyword)) ||
        (u.phone && u.phone.includes(keyword))
    );
  }
  if (status && status !== 'all') {
    list = list.filter((u) => u.status === status);
  }

  const total = list.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageList = list.slice(start, end);

  res.json({
    code: 0,
    msg: 'ok',
    data: {
      total,
      list: pageList,
    },
  });
});

// POST /admin/v1/users/:id/status
app.post('/admin/v1/users/:id/status', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body || {};
  const u = users.find((x) => x.id === id);
  if (!u) {
    return res.status(404).json({ code: 1, msg: 'user not found', data: {} });
  }
  u.status = status;
  save();
  return res.json({ code: 0, msg: 'ok', data: { updated: true } });
});

// GET single user (optional)
app.get('/admin/v1/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const u = users.find((x) => x.id === id);
  if (!u) {
    return res.status(404).json({ code: 1, msg: 'user not found', data: {} });
  }
  return res.json({ code: 0, msg: 'ok', data: u });
});

// simple health
app.get('/health', (req, res) => {
  res.send('ok');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Temp backend started at http://localhost:${PORT}`);
  console.log('Admin users endpoint: GET /admin/v1/users');
});


