import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { GraphQLContext, PostBody } from '../types.js';

export const PostType: GraphQLObjectType<PostBody, GraphQLContext> =
  new GraphQLObjectType<PostBody, GraphQLContext>({
    name: 'Post',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(UUIDType),
        description: 'id of a post',
      },
      title: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'title of a post',
      },
      content: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'content of a post',
      },
      author: {
        type: new GraphQLNonNull(UserType),
        description: 'an user created a post (relation to User)',
        resolve: async ({ authorId }, _args, context: GraphQLContext) => {
          return context.prisma.user.findUnique({
            where: {
              id: authorId,
            },
          });
        },
      },
      authorId: {
        type: new GraphQLNonNull(UUIDType),
        description: 'id of an user created a post (relation to User)',
      },
    }),
  });

export interface CreatePostArgs {
  dto: {
    authorId: string;
    title: string;
    content: string;
  };
}

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    authorId: {
      type: new GraphQLNonNull(UUIDType),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export interface ChangePostArgs {
  id: string;
  dto: {
    title: string;
    content: string;
  };
}

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  }),
});
