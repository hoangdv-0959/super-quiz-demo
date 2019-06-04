const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const bodyParser = require('body-parser');

const multer  = require('multer');
const fs = require('fs');

// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
  }
});

app.use('/uploads', express.static('uploads'));

const upload = multer({ storage: storage });

const QUESTION_DATA = {
  '001': {
    question: '1 + 1 = ?',
    answer: 2
  },
  '002': {
    question: '10 / 2 = ?',
    answer: 5
  },
  '003': {
    question: '2 * 3 = ?',
    answer: 6
  },
  '004': {
    question: '100 / 25 = ?',
    answer: 4
  }
};

const getRandomQuestion = () => {
  const keys = Object.keys(QUESTION_DATA);
  const key = keys[ keys.length * Math.random() << 0];
  const question = QUESTION_DATA[key];
  return {
    question: question.question,
    id: key,
  };
};

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.get('/admin', (req, res) => {
  res.redirect('/admin.html');
});

app.get('/questions', (req, res) => {
  const question = getRandomQuestion();
  res.json(question);
});

app.post('/questions', (req, res) => {
  const id = Date.now() + '';
  QUESTION_DATA[id] = req.body;
  res.json(QUESTION_DATA[id]);
});

app.post('/questions/submit/:id/', (req, res) => {
  const questionId = req.params.id;
  const answer = req.body.answer;

  const question = QUESTION_DATA[questionId];
  const success = question.answer === parseInt(answer);
  res.json({success});
});

// List all file
app.get('/files', (req, res) =>{
  fs.readdir('./uploads/', (err, files) => {
    const data = [];
    files.forEach(file => {
      if (file === '.keepme') {
        return;
      }
      data.push({
        name: file,
        path: `uploads/${file}`
      });
    });
    res.json(data)
  });
});

// Uploading a Single File
app.post('/upload', upload.single('my_file'), (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({
      message: 'Please upload a file',
    })
  }
  res.send({
    success: true,
    filePath: file.path,
    size: formatBytes(file.size),
  })
});

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
