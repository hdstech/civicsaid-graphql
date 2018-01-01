const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { find, filter } = require('lodash');
const { Question, Answer } = require('./db/models');

const PORT = process.env.PORT || 3000;

// The GraphQL schema in string form
const typeDefs = `
  type Query {
    question(id: Int!): Question
    answer(id: Int!): Answer
    questions: [Question]
    answers: [Answer]
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

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(PORT, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});
