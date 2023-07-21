import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeId, MemberTypeType } from './memberType.js';
import { UserType } from './user.js';
import { GraphQLContext } from '../context.js';

export const ProfileType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
      description: 'id of a profile',
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'if an user is a male',
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'an user birth year',
    },
    user: {
      type: new GraphQLNonNull(UserType),
      description: 'an user (relation to User)',
      resolve: async ({ userId }, _args, context: GraphQLContext) => {
        return context.prisma.user.findUnique({
          where: {
            id: userId as string,
          },
        });
      },
    },
    userId: {
      type: new GraphQLNonNull(UUIDType),
      description: 'id of an user (relation to User)',
    },
    memberType: {
      type: new GraphQLNonNull(MemberTypeType),
      description: 'member type of an user (relation to MemberType)',
      resolve: async ({ memberTypeId }, _args, context: GraphQLContext) => {
        return context.loaders.memberTypes.load(memberTypeId);
      },
    },
    memberTypeId: {
      type: new GraphQLNonNull(MemberTypeId),
      description: 'id of a member type (relation to MemberType)',
    },
  }),
});

export interface CreateProfileArgs {
  dto: {
    userId: string;
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
  };
}

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    memberTypeId: {
      type: new GraphQLNonNull(MemberTypeId),
    },
  }),
});

export interface ChangeProfileArgs {
  id: string;
  dto: {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
  };
}

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    memberTypeId: {
      type: MemberTypeId,
    },
  }),
});
