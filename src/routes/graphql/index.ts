import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import { schema } from './schemas.js';
import { config } from './config.js';
import depthLimit from 'graphql-depth-limit';
import { createLoaders } from './loaders.js';
import { GraphQLContext } from './types.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const query = req.body.query;
      const vars = req.body.variables;

      try {
        const depthLimitErrors = validate(schema, parse(query), [
          depthLimit(config.depthLimit),
        ]);
        if (depthLimitErrors && depthLimitErrors.length) {
          return { errors: depthLimitErrors };
        }

        const result = await graphql({
          schema,
          source: query,
          variableValues: vars,
          contextValue: <GraphQLContext>{ loaders: createLoaders(prisma), prisma },
        });
        return result;
      } catch (e) {
        return { errors: [e] };
      }
    },
  });
};

export default plugin;
