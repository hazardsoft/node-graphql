import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { FastifyInstance } from 'fastify';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
      description: 'id of an user',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'name of an user',
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'balance of an user',
    },
    profile: {
      type: ProfileType,
      description: "an user's profile",
      resolve: async ({ id: userId }, _args, context: FastifyInstance) => {
        return context.prisma.profile.findUnique({
          where: {
            userId: userId as string,
          },
        });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      description: "an user's posts",
      resolve: async ({ id: userId }, _args, context: FastifyInstance) => {
        return context.prisma.post.findMany({
          where: {
            authorId: userId as string,
          },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      description: 'list of users current user is subscribed to',
      resolve: async ({ id }, _args, context: FastifyInstance) => {
        return context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: id as string,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      description: 'list of users subscribed to the current user',
      resolve: async ({ id }, _args, context: FastifyInstance) => {
        return context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: id as string,
              },
            },
          },
        });
      },
    },
  }),
});

export interface CreateUserArgs {
  dto: {
    name: string;
    balance: number;
  };
}

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  }),
});

export interface ChangeUserArgs {
  id: string;
  dto: {
    name: string;
    balance: number;
  };
}

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  }),
});
