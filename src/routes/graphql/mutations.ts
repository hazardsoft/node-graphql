import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { ChangePostInput, CreatePostInput, PostType } from './types/post.js';
import { FastifyInstance } from 'fastify';
import { UUIDType } from './types/uuid.js';
import { ChangeProfileInput, CreateProfileInput, ProfileType } from './types/profile.js';
import { ChangeUserInput, CreateUserInput, UserType } from './types/user.js';

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
      resolve: async (_source, { dto }, context: FastifyInstance) => {
        return context.prisma.post.create({
          data: dto,
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
      resolve: async (_source, { id, dto }, context: FastifyInstance) => {
        return context.prisma.post.update({
          where: {
            id: id as string,
          },
          data: dto,
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
      resolve: async (_source, { id: postId }, context: FastifyInstance) => {
        await context.prisma.post.delete({ where: { id: postId as string } });
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: {
          type: new GraphQLNonNull(CreateProfileInput),
        },
      },
      resolve: async (_source, { dto }, context: FastifyInstance) => {
        return context.prisma.profile.create({
          data: dto,
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
      resolve: async (_source, { id, dto }, context: FastifyInstance) => {
        return context.prisma.profile.update({
          where: {
            id: id as string,
          },
          data: dto,
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
      resolve: async (_source, { id: profileId }, context: FastifyInstance) => {
        await context.prisma.profile.delete({
          where: { id: profileId as string },
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
      resolve: async (_source, { dto }, context: FastifyInstance) => {
        return context.prisma.user.create({
          data: dto,
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
      resolve: async (_source, { id, dto }, context: FastifyInstance) => {
        return context.prisma.user.update({
          where: {
            id: id as string,
          },
          data: dto,
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
      resolve: async (_source, { id: userId }, context: FastifyInstance) => {
        await context.prisma.user.delete({
          where: { id: userId as string },
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
      resolve: async (_source, { userId, authorId }, context: FastifyInstance) => {
        return context.prisma.user.update({
          where: {
            id: userId as string,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId: authorId as string,
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
      resolve: async (_source, { userId, authorId }, context: FastifyInstance) => {
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId as string,
              authorId: authorId as string,
            },
          },
        });
      },
    },
  }),
});
