import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { FastifyInstance } from 'fastify';
import { MemberTypeId, MemberTypeType } from './types/memberType.js';
import { ProfileType } from './types/profile.js';
import { UUIDType } from './types/uuid.js';
import { PostType } from './types/post.js';
import { UserType } from './types/user.js';

export const query = new GraphQLObjectType({
  name: 'Query',
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
        return context.loaders.memberTypes.load(memberTypeId);
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
        return context.loaders.profiles.load(profileId);
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
        return context.loaders.posts.load(postId);
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
        return context.loaders.users.load(userId);
      },
    },
  }),
});
