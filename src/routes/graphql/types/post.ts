import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';

export const PostType = new GraphQLObjectType({
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
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
      description: 'id of an user created a post (relation to User)',
    },
  }),
});
