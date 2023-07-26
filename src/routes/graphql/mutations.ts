import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import {
  ChangePostInput,
  CreatePostInput,
  PostType,
  CreatePostArgs,
  ChangePostArgs,
} from './types/post.js';
import { UUIDType } from './types/uuid.js';
import {
  ChangeProfileArgs,
  ChangeProfileInput,
  CreateProfileArgs,
  CreateProfileInput,
  ProfileType,
} from './types/profile.js';
import {
  ChangeUserArgs,
  ChangeUserInput,
  CreateUserArgs,
  CreateUserInput,
  UserType,
} from './types/user.js';
import { GraphQLContext } from './types.js';

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: {
          type: new GraphQLNonNull(CreatePostInput),
        },
      },
      resolve: async (_source, args: CreatePostArgs, context: GraphQLContext) => {
        return context.prisma.post.create({
          data: args.dto,
        });
      },
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(ChangePostInput),
        },
      },
      resolve: async (_source, args: ChangePostArgs, context: GraphQLContext) => {
        return context.prisma.post.update({
          where: {
            id: args.id,
          },
          data: args.dto,
        });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (
        _source,
        { id: postId }: { id: string },
        context: GraphQLContext,
      ) => {
        await context.prisma.post.delete({ where: { id: postId } });
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: {
          type: new GraphQLNonNull(CreateProfileInput),
        },
      },
      resolve: async (_source, args: CreateProfileArgs, context: GraphQLContext) => {
        return context.prisma.profile.create({
          data: args.dto,
        });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(ChangeProfileInput),
        },
      },
      resolve: async (_source, args: ChangeProfileArgs, context: GraphQLContext) => {
        return context.prisma.profile.update({
          where: {
            id: args.id,
          },
          data: args.dto,
        });
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (
        _source,
        { id: profileId }: { id: string },
        context: GraphQLContext,
      ) => {
        await context.prisma.profile.delete({
          where: { id: profileId },
        });
      },
    },
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: {
          type: new GraphQLNonNull(CreateUserInput),
        },
      },
      resolve: async (_source, args: CreateUserArgs, context: GraphQLContext) => {
        return context.prisma.user.create({
          data: args.dto,
        });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(ChangeUserInput),
        },
      },
      resolve: async (_source, args: ChangeUserArgs, context: GraphQLContext) => {
        return context.prisma.user.update({
          where: {
            id: args.id,
          },
          data: args.dto,
        });
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (
        _source,
        { id: userId }: { id: string },
        context: GraphQLContext,
      ) => {
        await context.prisma.user.delete({
          where: { id: userId },
        });
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(UserType),
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (
        _source,
        { userId, authorId }: { userId: string; authorId: string },
        context: GraphQLContext,
      ) => {
        return context.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId: authorId,
              },
            },
          },
        });
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (
        _source,
        { userId, authorId }: { userId: string; authorId: string },
        context: GraphQLContext,
      ) => {
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
      },
    },
  }),
});
