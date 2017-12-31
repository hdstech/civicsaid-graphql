const db = require('../connection.js');
const Sequelize = require('sequelize');
const { QuestionModel } = require('./question');

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

AnswerModel.belongsTo(QuestionModel);

const Answer = db.models.answer;
module.exports = Answer;

module.exports = AnswerModel;
