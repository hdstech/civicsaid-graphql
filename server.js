const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const { Engine } = require('apollo-engine');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { find, filter, sampleSize } = require('lodash');
const { Question, Answer } = require('./db/models');
const { ENGINE_API_KEY } = require('dotenv/config');

const PORT = process.env.PORT || 3000;

// Apollo-engine configuration. Optional configuration commented out for now
const engine = new Engine({
  engineConfig: {
    apiKey: process.env.ENGINE_API_KEY,
    logging: {
      level: 'DEBUG', // Engine Proxy logging level. DEBUG, INFO, WARN or ERROR
    },
  },
  // GraphQL port
  graphqlPort: PORT,

  // GraphQL endpoint suffix - '/graphql' by default
  endpoint: '/graphql',

  // Debug configuration that logs traffic between Proxy and GraphQL server
  dumpTraffic: true,
});

engine.start();

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

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema,
    tracing: true,
    cacheControl: true,
  }),
);

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Node compression to enable gzip compressions for tracing GraphQL queries
app.use(compression());

//
app.use(engine.expressMiddleware());

// Start the server
app.listen(PORT, () => {
  console.log(`Go to http://localhost:${PORT}/graphiql to run queries!`);
});
