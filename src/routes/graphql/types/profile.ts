import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeType } from './memberType.js';
import { UserType } from './user.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
      description: 'id of a profile',
    },
    isMale: {
      type: GraphQLBoolean,
      description: 'if an user is a male',
    },
    yearOfBirth: {
      type: GraphQLInt,
      description: 'an user birth year',
    },
    user: {
      type: new GraphQLNonNull(UserType),
      description: 'an user (relation to User)',
    },
    userId: {
      type: new GraphQLNonNull(UUIDType),
      description: 'id of an user (relation to User)',
    },
    memberType: {
      type: new GraphQLNonNull(MemberTypeType),
      description: 'member type of an user (relation to MemberType)',
    },
    memberTypeId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'id of a member type (relation to MemberType)',
    },
  }),
});
