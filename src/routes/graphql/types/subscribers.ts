import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';

export const SubscribersOnAuthorsType = new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: () => ({
    subsriber: {
      type: new GraphQLNonNull(UserType),
      description: 'subscriber profile (relation to User)',
    },
    subscriberId: {
      type: new GraphQLNonNull(UUIDType),
      description: 'id of a subscriber (relation to User)',
    },
    author: {
      type: new GraphQLNonNull(UserType),
      description: 'author profile (relation to User)',
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
      description: 'id of an author (relation to User)',
    },
  }),
});
