const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { find, filter } = require('lodash');

const PORT = process.env.PORT || 3000;

// Some fake data
const questions = [
  {
    id: 6,
    question_english: 'blah blah in english',
    question_spanish: 'blah blah in spanish',
    question_chinese: 'blah blah in chinese',
    favorite: true,
  },
  {
    id: 7,
    question_english: 'zzzblah blah in english',
    question_spanish: 'zzzblah blah in spanish',
    question_chinese: 'zzzblah blah in chinese',
    favorite: false,
  },
];

const answers = [
  {
    id: 3,
    question_id: 6,
    answer_english: 'answer blah blah in english',
    answer_spanish: 'answer blah blah in spanish',
    answer_chinese: 'answer blah blah in chinese',
  },
  {
    id: 4,
    question_id: 6,
    answer_english: 'answer zzzblah blah in english',
    answer_spanish: 'answer zzzblah blah in spanish',
    answer_chinese: 'answer zzzblah blah in chinese',
  },
];

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
    # English version of the question
    question_english: String
    # Spanish version of the question
    question_spanish: String
    # Chinese version of the question
    question_chinese: String
    # Answers that belong to the question
    answers: [Answer]
    # Whether or not it's marked as favorite
    favorite: Boolean
   }
  type Answer {
    # Answer id
    id: Int!
    # English version of the answer
    answer_english: String
    # Spanish version of the answer
    answer_spanish: String
    # Chinese version of the answer
    answer_chinese: String
    # The question this answer belongs too
    question: Question
   }
`;

// The resolvers
const resolvers = {
  Query: {
    questions: () => questions,
    answers: () => answers,
    question: (_, args) => find(questions, { id: args.id }),
    answer: (_, args) => find(answers, { id: args.id }),
  },
  Question: {
    answers: question => filter(answers, { question_id: question.id }),
  },
  Answer: {
    question: answer => find(questions, { id: answer.question_id }),
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
