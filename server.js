const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const { Engine } = require('apollo-engine');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { schema } = require('./db/schema');
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
  graphqlPort: PORT,

  // Debug configuration that logs traffic between Proxy and GraphQL server
  // dumpTraffic: true,
});

engine.start();

// Initialize the app
const app = express();

// Apollo engine middleware needs to be first so that it traces each query
// before any other middleware touches them
app.use(engine.expressMiddleware());

// Node compression to enable gzip compressions for tracing GraphQL queries
app.use(compression());

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

// GraphiQL visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(PORT, () => {
  console.log(`Go to http://localhost:${PORT}/graphiql to run queries!`);
});
