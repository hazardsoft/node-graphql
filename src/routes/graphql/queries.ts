import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { MemberTypeIdType, MemberType } from './types/memberType.js';
import { ProfileType } from './types/profile.js';
import { UUIDType } from './types/uuid.js';
import { PostType } from './types/post.js';
import { UserType } from './types/user.js';
import { GraphQLContext } from './types.js';

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_source, _args, context: GraphQLContext) => {
        return context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: {
          type: new GraphQLNonNull(MemberTypeIdType),
        },
      },
      resolve: async (
        _source,
        { id: memberTypeId }: { id: string },
        context: GraphQLContext,
      ) => {
        return context.loaders.memberType.load(memberTypeId);
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_source, _args, context: GraphQLContext) => {
        return context.prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
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
        return context.loaders.profile.load(profileId);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_source, _args, context: GraphQLContext) => {
        return context.prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
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
        return context.loaders.post.load(postId);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_source, _args, context: GraphQLContext, info) => {
        const parsedInfo = parseResolveInfo(info) as ResolveTree;
        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          parsedInfo,
          UserType,
        );

        const includeSubscribedToUser = Boolean(fields['subscribedToUser']);
        const includeUserSubscribedTo = Boolean(fields['userSubscribedTo']);

        const users = await context.prisma.user.findMany({
          include: {
            subscribedToUser: includeSubscribedToUser,
            userSubscribedTo: includeUserSubscribedTo,
          },
        });

        if (includeSubscribedToUser) {
          users.forEach((user) => {
            const subscribers = users.filter((u) =>
              u.subscribedToUser.some((sub) => sub.subscriberId === user.id),
            );
            context.loaders.subscribedToUser.prime(user.id, subscribers);
          });
        }

        if (includeUserSubscribedTo) {
          users.forEach((user) => {
            const authors = users.filter((u) =>
              u.userSubscribedTo.some((sub) => sub.authorId === user.id),
            );
            context.loaders.userSubscribedTo.prime(user.id, authors);
          });
        }

        return users;
      },
    },
    user: {
      type: UserType,
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
        return context.loaders.user.load(userId);
      },
    },
  }),
});
