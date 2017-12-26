const { graphql, buildSchema } = require('graphql');
// import { graphql, buildSchema } from 'graphql';

const schema = buildSchema(`
type Question {
  id: ID,
  question_english: String,
  question_spanish: String,
  question_chinese: String,
  favorite: Boolean,
}

type Answer {
  id: ID,
  question_id: Int,
  answer_english: String,
  answer_spanish: String,
  answer_chinese: String,
}

type Query {
  question: Question
}

type Schema {
  query: Query
}
`);

const resolvers = {
  question: () => ({
    id: '6',
    question_english: 'question in english',
    question_spanish: 'question in spanish',
    question_chinese: 'question in chinese',
    favorite: true,
  }),
};

const query = `
query myFirstQuery {
  question {
    id,
    question_english,
    question_spanish,
    question_chinese,
    favorite,
  }
}
`;

graphql(schema, query, resolvers)
  .then(result => console.log(result))
  .catch(error => console.log(error));
