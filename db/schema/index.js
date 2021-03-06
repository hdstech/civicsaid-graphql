const { makeExecutableSchema } = require('graphql-tools');
const { find, filter, sampleSize } = require('lodash');
const { Question, Answer } = require('../models');

// The GraphQL schema in string form
const typeDefs = `
  type Query {
    question(id: Int!): Question
    answer(id: Int!): Answer
    questions: [Question]
    answers: [Answer]
    category(category: String!): [Question]
    subcategory(subcategory: String!): [Question]
    randomQuestions(limit: Int!): [Question]
   }
  type Question {
    # Question id
    id: Int!
    # Category of the question
    category: String
    # Subcategory of the quesiton
    subcategory: String
    # English version of the question
    q_english: String
    # Spanish version of the question
    q_spanish: String
    # Chinese version of the question
    q_chinese: String
    # Whether or not it's marked as favorite
    is_favorite: Boolean
    # Answers that belong to the question
    answers: [Answer]
   }
  type Answer {
    # Answer id
    id: Int!
    # Category of the answer
    category: String
    # Subcategory of the answer
    subcategory: String
    # English version of the answer
    a_english: String
    # Spanish version of the answer
    a_spanish: String
    # Chinese version of the answer
    a_chinese: String
    # The question this answer belongs too
    question: Question
   }
`;

// The resolvers
const resolvers = {
  Query: {
    questions: () => Question.findAll(),
    answers: () => Answer.findAll(),
    question: (_, args) => Question.find({ where: args }),
    answer: (_, args) => Answer.find({ where: args }),
    category: (_, args) =>
      Question.findAll({
        where: {
          category: args.category,
        },
      }),
    subcategory: (_, args) =>
      Question.findAll({
        where: {
          subcategory: args.subcategory,
        },
      }),
    randomQuestions: (_, args) => {
      const randomIds = Array(args.limit)
        .fill()
        .map(() => Math.floor(Math.random() * 100) + 1);
      return randomIds.map(q_id => Question.find({ where: { id: q_id } }));
    },
  },
  Question: {
    answers: question => question.getAnswers(),
  },
  Answer: {
    question: answer => answer.getQuestion(),
  },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = { schema };
