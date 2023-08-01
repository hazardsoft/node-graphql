import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { ProfileType } from './profile.js';
import { GraphQLContext, MemberTypeBody } from '../types.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export const MemberTypeIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: {
      value: MemberTypeId.BASIC,
    },
    [MemberTypeId.BUSINESS]: {
      value: MemberTypeId.BUSINESS,
    },
  },
});

export const MemberType: GraphQLObjectType<MemberTypeBody, GraphQLContext> =
  new GraphQLObjectType<MemberTypeBody, GraphQLContext>({
    name: 'MemberType',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(MemberTypeIdType),
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
          return context.loaders.profilesByMemberType.load(id);
        },
      },
    }),
  });
