const db = require('../connection.js');
const Sequelize = require('sequelize');
const AnswerModel = require('./answer');

const QuestionModel = db.define('question', {
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
  created_at: { type: Sequelize.DATE },
  updated_at: { type: Sequelize.DATE },
});

QuestionModel.hasMany(AnswerModel);

const Question = db.models.question;
module.exports = Question;

module.exports = QuestionModel;
