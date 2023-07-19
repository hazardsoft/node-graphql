import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { FastifyInstance } from 'fastify';
import { UUIDType } from './uuid.js';
import { MemberTypeId, MemberTypeType } from './memberType.js';
import { UserType } from './user.js';

export const ProfileType = new GraphQLObjectType({
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
      resolve: async ({ userId }, args, context: FastifyInstance) => {
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
      resolve: async ({ memberTypeId }, _args, context: FastifyInstance) => {
        return context.prisma.memberType.findUnique({
          where: {
            id: memberTypeId as string,
          },
        });
      },
    },
    memberTypeId: {
      type: new GraphQLNonNull(MemberTypeId),
      description: 'id of a member type (relation to MemberType)',
    },
  }),
});

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
