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
      resolve: async (_source, { id: memberTypeId }, context: GraphQLContext) => {
        return context.loaders.memberTypes.load(memberTypeId as string);
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
      resolve: async (_source, { id: profileId }, context: GraphQLContext) => {
        return context.loaders.profiles.load(profileId as string);
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
      resolve: async (_source, { id: postId }, context: GraphQLContext) => {
        return context.loaders.posts.load(postId as string);
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

        const getSubsTo1 = (userId: string) => {
          return users.filter((innerUser) =>
            innerUser.subscribedToUser.some(
              (subscription) => subscription.subscriberId === userId,
            ),
          );
        };

        const getSubsFrom1 = (userId: string) => {
          return users.filter((innerUser) =>
            innerUser.subscribedToUser.some(
              (subscription) => subscription.authorId === userId,
            ),
          );
        };

        const getSubsTo2 = (userId: string) => {
          return users.filter((innerUser) =>
            innerUser.userSubscribedTo.some(
              (subscription) => subscription.subscriberId === userId,
            ),
          );
        };

        const getSubsFrom2 = (userId: string) => {
          return users.filter((innerUser) =>
            innerUser.userSubscribedTo.some(
              (subscription) => subscription.authorId === userId,
            ),
          );
        };

        if (includeSubscribedToUser) {
          users.forEach((user) => {
            const subsTo = getSubsTo1(user.id);
            const subsFrom = getSubsFrom1(user.id);
            context.loaders.subscribedToUser.prime(user.id, subsTo);
            context.loaders.userSubscribedTo.prime(user.id, subsFrom);
          });
        }

        if (includeUserSubscribedTo) {
          users.forEach((user) => {
            const subsTo = getSubsTo2(user.id);
            const subsFrom = getSubsFrom2(user.id);
            context.loaders.subscribedToUser.prime(user.id, subsTo);
            context.loaders.userSubscribedTo.prime(user.id, subsFrom);
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
      resolve: async (_source, { id: userId }, context: GraphQLContext) => {
        return context.loaders.users.load(userId as string);
      },
    },
  }),
});
