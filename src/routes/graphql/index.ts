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
      // const query = 'query {memberTypes{id discount postsLimitPerMonth}}';
      // const query = 'query {memberType(id: "basic"){id discount postsLimitPerMonth}}';
      // const query = 'query {memberType(id: "basic"){id discount postsLimitPerMonth profiles{id userId memberTypeId memberType{id discount} user{id name}}}}';

      // const query = 'query {profiles{id userId memberTypeId memberType{id discount} user{id name}}}';
      // const query = 'query {profile(id: "53f7ebac-61a1-43c3-bd96-9745789c86db"){id userId memberTypeId memberType{id discount} user{id name}}}';

      // const query = 'query {posts{id title content author{id name}}}';
      // const query = 'query {post(id: "dc452dae-20fd-47fb-bde7-6ef18626322c"){id title content author{id name}}}';
      // const query = 'query {post(id: "dc452dae-20fd-47fb-bde7-6ef18626322c"){id title content author{id name}}}';

      // const query = 'query{users{id name balance profile{userId yearOfBirth memberTypeId} posts{title authorId} userSubscribedTo{subscriberId subscriber{id name} authorId author{id name}} subscribedToUser{subscriberId subscriber{id name} authorId author{id name}}}}';
      // const query = 'query{user(id: "4e063b4c-a691-42e8-84ec-9e6bc78b9155"){id name balance}}';

      // const mutation = 'mutation {deletePost(id: "8362cae5-8c09-4e1b-a9a7-1d2338cc2cce"){id title content}}';
      // const mutation = 'mutation {deleteProfile(id: "95d970d1-7fd9-4518-acfe-d2a27b5d8d37"){id userId memberTypeId memberType{id discount}}}';
      // const mutation = 'mutation {deleteUser(id: "71d7b515-a5b8-4257-ba01-689d3961fb41"){id name balance posts{title content} profile{userId yearOfBirth}}}'

      const query = req.body.query;
      const vars = req.body.variables;

      const result = await graphql({
        schema,
        source: query,
        variableValues: vars,
        contextValue: this,
      });
      return result;
    },
  });
};

export default plugin;
