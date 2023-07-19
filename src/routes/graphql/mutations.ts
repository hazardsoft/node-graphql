import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { PostInputType, PostType } from './types/post.js';
import { FastifyInstance } from 'fastify';
import { UUIDType } from './types/uuid.js';
import { ProfileInputType, ProfileType } from './types/profile.js';
import { UserInputType, UserType } from './types/user.js';
import { SubscribersOnAuthorsType } from './types/subscribers.js';

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        input: {
          type: new GraphQLNonNull(PostInputType),
        },
      },
      resolve: async (_source, { input }, context: FastifyInstance) => {
        return context.prisma.post.create({
          data: input,
        });
      },
    },
    deletePost: {
      type: PostType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, { id: postId }, context: FastifyInstance) => {
        return context.prisma.post.delete({ where: { id: postId as string } });
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        input: {
          type: new GraphQLNonNull(ProfileInputType),
        },
      },
      resolve: async (_source, { input }, context: FastifyInstance) => {
        return context.prisma.profile.create({
          data: input,
        });
      },
    },
    deleteProfile: {
      type: ProfileType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, { id: profileId }, context: FastifyInstance) => {
        return context.prisma.profile.delete({
          where: { id: profileId as string },
        });
      },
    },
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        input: {
          type: new GraphQLNonNull(UserInputType),
        },
      },
      resolve: async (_source, { input }, context: FastifyInstance) => {
        return context.prisma.user.create({
          data: input,
        });
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, { id: userId }, context: FastifyInstance) => {
        return context.prisma.user.delete({
          where: { id: userId as string },
        });
      },
    },
    createSubscription: {
      type: new GraphQLNonNull(UserType),
      args: {
        userId: {
          type: new GraphQLNonNull(GraphQLString),
        },
        authorId: {
          type: new GraphQLNonNull(GraphQLString),
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
    deleteSubscription: {
      type: SubscribersOnAuthorsType,
      args: {
        userId: {
          type: new GraphQLNonNull(GraphQLString),
        },
        authorId: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_source, { userId, authorId }, context: FastifyInstance) => {
        return context.prisma.subscribersOnAuthors.delete({
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
