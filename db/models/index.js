const db = require('../connection.js');
const Sequelize = require('sequelize');

const QuestionModel = db.define(
  'question',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    category: { type: Sequelize.STRING },
    subcategory: { type: Sequelize.STRING },
    q_english: { type: Sequelize.STRING },
    q_spanish: { type: Sequelize.STRING },
    q_chinese: { type: Sequelize.STRING },
    is_favorite: { type: Sequelize.BOOLEAN },
  },
  {
    timestamps: false,
  },
);

const AnswerModel = db.define('answer', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  category: { type: Sequelize.STRING },
  subcategory: { type: Sequelize.STRING },
  a_english: { type: Sequelize.STRING },
  a_spanish: { type: Sequelize.STRING },
  a_chinese: { type: Sequelize.STRING },
  question_id: { type: Sequelize.INTEGER },
  created_at: { type: Sequelize.DATE },
  updated_at: { type: Sequelize.DATE },
});

// QuestionModel.hasMany(AnswerModel);
// AnswerModel.belongsTo(QuestionModel);

const Question = db.models.question;
const Answer = db.models.answer;

module.exports = Question;
module.exports = Answer;
