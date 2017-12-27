const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql');

const PORT = process.env.PORT || 3000;
const server = express();

const questionType = new GraphQLObjectType({
  name: 'Question',
  description: 'A question from the naturalization civics aid exam.',
  fields: {
    id: {
      type: GraphQLID,
      description: 'The id of the question.',
    },
    question_english: {
      type: GraphQLString,
      description: 'The english translation of the question.',
    },
    question_spanish: {
      type: GraphQLString,
      description: 'The spanish translation of the question.',
    },
    question_chinese: {
      type: GraphQLString,
      description: 'The chinese translation of the question.',
    },
    favorite: {
      type: GraphQLBoolean,
      description: 'Whether or not the question has been saved as a favorite',
    },
  },
});

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    question: {
      type: questionType,
      resolve: () =>
        new Promise(resolve => {
          resolve({
            id: '6',
            question_english: 'blah blah in english',
            question_spanish: 'blah blah in spanish',
            question_chinese: 'blah blah in chinese',
            favorite: true,
          });
        }),
    },
  },
});

const schema = new GraphQLSchema({
  query: queryType,
  // mutation,
  // subscription,
});

const question1 = {
  id: '6',
  question_english: 'blah blah in english',
  question_spanish: 'blah blah in spanish',
  question_chinese: 'blah blah in chinese',
  favorite: true,
};

const question2 = {
  id: '7',
  question_english: 'zzzblah blah in english',
  question_spanish: 'zzzblah blah in spanish',
  question_chinese: 'zzzblah blah in chinese',
  favorite: false,
};

const answer1 = {
  id: '3',
  question_id: '6',
  answer_english: 'answer blah blah in english',
  answer_spanish: 'answer blah blah in spanish',
  answer_chinese: 'answer blah blah in chinese',
};

const answer2 = {
  id: '4',
  question_id: '6',
  answer_english: 'answer zzzblah blah in english',
  answer_spanish: 'answer zzzblah blah in spanish',
  answer_chinese: 'answer zzzblah blah in chinese',
};

const questions = [question1, question2];
const answers = [answer1, answer2];

server.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
