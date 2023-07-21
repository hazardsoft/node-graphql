import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { GraphQLContext } from '../context.js';

export const SubscribersOnAuthorsType = new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: () => ({
    subscriber: {
      type: new GraphQLNonNull(UserType),
      description: 'subscriber profile (relation to User)',
      resolve: async ({ subscriberId }, _args, context: GraphQLContext) => {
        return context.prisma.user.findUnique({
          where: { id: subscriberId as string },
        });
      },
    },
    subscriberId: {
      type: new GraphQLNonNull(UUIDType),
      description: 'id of a subscriber (relation to User)',
    },
    author: {
      type: new GraphQLNonNull(UserType),
      description: 'author profile (relation to User)',
      resolve: async ({ authorId }, _args, context: GraphQLContext) => {
        return context.prisma.user.findUnique({
          where: { id: authorId as string },
        });
      },
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
      description: 'id of an author (relation to User)',
    },
  }),
});
