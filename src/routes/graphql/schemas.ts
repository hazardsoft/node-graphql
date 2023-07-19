import { Type } from '@fastify/type-provider-typebox';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { MemberTypeId, MemberTypeType } from './types/memberType.js';
import { FastifyInstance } from 'fastify';
import { ProfileType } from './types/profile.js';
import { PostType } from './types/post.js';
import { UUIDType } from './types/uuid.js';
import { UserType } from './types/user.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const query = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      resolve: async (_source, _args, context: FastifyInstance) => {
        return context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberTypeType,
      args: {
        id: {
          type: new GraphQLNonNull(MemberTypeId),
        },
      },
      resolve: async (_source, { id: memberTypeId }, context: FastifyInstance) => {
        return context.prisma.memberType.findUnique({
          where: {
            id: memberTypeId as string,
          },
        });
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_source, _args, context: FastifyInstance) => {
        return context.prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, { id: profileId }, context: FastifyInstance) => {
        return context.prisma.profile.findUnique({
          where: {
            id: profileId as string,
          },
        });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_source, _args, context: FastifyInstance) => {
        return context.prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, { id: postId }, context: FastifyInstance) => {
        return context.prisma.post.findUnique({
          where: {
            id: postId as string,
          },
        });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_source, _args, context: FastifyInstance) => {
        return context.prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, { id: userId }, context: FastifyInstance) => {
        return context.prisma.user.findUnique({
          where: {
            id: userId as string,
          },
        });
      },
    },
  }),
});

export const schema = new GraphQLSchema({
  query,
});
