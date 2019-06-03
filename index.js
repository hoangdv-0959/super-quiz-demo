const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const bodyParser = require('body-parser');

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

app.get('/questions', (req, res) => {
  const question = getRandomQuestion();
  res.json(question);
});

app.post('/questions/submit/:id/', (req, res) => {
  const questionId = req.params.id;
  const answer = req.body.answer;

  const question = QUESTION_DATA[questionId];
  const success = question.answer === parseInt(answer);
  res.json({success});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
