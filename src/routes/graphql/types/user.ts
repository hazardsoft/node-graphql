import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { SubscribersOnAuthorsType } from './subscribers.js';
import { PostType } from './post.js';

export const UserType = new GraphQLObjectType({
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
    profile: {
      type: new GraphQLNonNull(ProfileType),
      description: "an user's profile",
    },
    posts: {
      type: new GraphQLList(PostType),
      description: "an user's posts",
    },
    userSubscribedTo: {
      type: new GraphQLList(SubscribersOnAuthorsType),
      description: "an user's posts",
    },
    subscribedToUser: {
      type: new GraphQLList(SubscribersOnAuthorsType),
      description: "an user's posts",
    },
  }),
});
