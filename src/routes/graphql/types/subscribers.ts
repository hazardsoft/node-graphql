import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { GraphQLContext, SubscriptionsBody } from '../types.js';

export const SubscribersOnAuthorsType = new GraphQLObjectType<
  SubscriptionsBody,
  GraphQLContext
>({
  name: 'SubscribersOnAuthors',
  fields: () => ({
    subscriber: {
      type: new GraphQLNonNull(UserType),
      description: 'subscriber profile (relation to User)',
      resolve: async ({ subscriberId }, _args, context: GraphQLContext) => {
        return context.prisma.user.findUnique({
          where: { id: subscriberId },
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
          where: { id: authorId },
        });
      },
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
      description: 'id of an author (relation to User)',
    },
  }),
});
