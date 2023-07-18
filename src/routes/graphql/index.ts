import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { schema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, res) {
      // const query = '{memberTypes{id discount postsLimitPerMonth}}';
      // const query = '{memberType(id: "basic"){id discount postsLimitPerMonth}}';
      // const query = '{memberType(id: "basic"){id discount postsLimitPerMonth profiles{id userId memberTypeId memberType{id discount} user{id name}}}}';

      // const query = '{profiles{id userId memberTypeId memberType{id discount} user{id name}}}';
      // const query = '{profile(id: "53f7ebac-61a1-43c3-bd96-9745789c86db"){id userId memberTypeId memberType{id discount} user{id name}}}';

      // const query = '{posts{id title content author{id name}}}';
      // const query = '{post(id: "dc452dae-20fd-47fb-bde7-6ef18626322c"){id title content author{id name}}}';

      const query = '{users{id name balance profile{userId yearOfBirth memberTypeId} posts{title authorId} userSubscribedTo{subscriberId subscriber{id name} authorId author{id name}} subscribedToUser{subscriberId subscriber{id name} authorId author{id name}}}}';
      // const query = '{user(id: "4e063b4c-a691-42e8-84ec-9e6bc78b9155"){id name balance}}';

      const memberTypes = await graphql({
        schema,
        source: query,
        contextValue: this,
      });
      return memberTypes;
    },
  });
};

export default plugin;
