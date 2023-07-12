import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { ProfileType } from './profile.js';

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
      description: 'list of profiles associated with the member type',
    },
  }),
});
