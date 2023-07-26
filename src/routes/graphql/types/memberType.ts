import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { ProfileType } from './profile.js';
import { GraphQLContext } from '../context.js';

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
      value: 'business',
    },
  },
});

export const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(MemberTypeId),
      description: 'id of a member type',
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'percentage discount',
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'posts limit per month',
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(ProfileType)),
      description: 'list of profiles associated with a member type',
      resolve: async ({ id }, _args, context: GraphQLContext) => {
        return context.loaders.profilesByMemberType.load(id as string);
      },
    },
  }),
});
