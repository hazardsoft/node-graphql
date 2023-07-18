import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { ProfileType } from './profile.js';
import { FastifyInstance } from 'fastify';

export const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'id of a member type',
    },
    discount: {
      type: GraphQLFloat,
      description: 'percentage discount',
    },
    postsLimitPerMonth: {
      type: GraphQLInt,
      description: 'posts limit per month',
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      description: 'list of profiles associated with a member type',
      resolve: async ({ id }, _args, context: FastifyInstance) => {
        return context.prisma.profile.findMany({
          where: {
            memberTypeId: id as string,
          },
        });
      },
    },
  }),
});
