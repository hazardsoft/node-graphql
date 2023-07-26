import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { MemberTypeBody, PostBody, ProfileBody, UserBody } from './types.js';

export function createLoaders(prisma: PrismaClient) {
  return {
    user: new DataLoader<string, UserBody>(async (userIds) => {
      const relatedUsers = await prisma.user.findMany({
        where: {
          id: {
            in: [...userIds],
          },
        },
      });
      const users: Record<string, UserBody> = {};
      relatedUsers.forEach((u) => (users[u.id] = u));
      return userIds.map((userId) => users[userId] ?? null);
    }),
    profile: new DataLoader<string, ProfileBody>(async (profileIds) => {
      const relatedProfiles = await prisma.profile.findMany({
        where: {
          id: {
            in: [...profileIds],
          },
        },
      });
      const profiles: Record<string, ProfileBody> = {};
      relatedProfiles.forEach((p) => (profiles[p.id] = p));
      return profileIds.map((profileId) => profiles[profileId] ?? null);
    }),
    post: new DataLoader<string, PostBody>(async (postIds) => {
      const relatedPosts = await prisma.post.findMany({
        where: {
          id: {
            in: [...postIds],
          },
        },
      });
      const posts: Record<string, PostBody> = {};
      relatedPosts.forEach((p) => (posts[p.id] = p));
      return postIds.map((postId) => posts[postId] ?? null);
    }),
    memberType: new DataLoader<string, MemberTypeBody>(async (memberTypeIds) => {
      const relatedMemberTypes = await prisma.memberType.findMany({
        where: {
          id: {
            in: [...memberTypeIds],
          },
        },
      });
      const memberTypes: Record<string, MemberTypeBody> = {};
      relatedMemberTypes.forEach((m) => (memberTypes[m.id] = m));
      return memberTypeIds.map((memberTypeId) => memberTypes[memberTypeId]);
    }),
    profileByUser: new DataLoader<string, ProfileBody>(async (usersIds) => {
      const relatedProfiles = await prisma.profile.findMany({
        where: {
          userId: {
            in: [...usersIds],
          },
        },
      });
      const profiles: Record<string, ProfileBody> = {};
      relatedProfiles.forEach((p) => (profiles[p.userId] = p));
      return usersIds.map((userId) => profiles[userId] ?? null);
    }),
    postsByUser: new DataLoader<string, PostBody[]>(async (usersIds) => {
      const relatedPosts = await prisma.post.findMany({
        where: {
          authorId: {
            in: [...usersIds],
          },
        },
      });
      const posts: Record<string, PostBody[]> = {};
      relatedPosts.forEach((p) =>
        posts[p.authorId] ? posts[p.authorId].push(p) : (posts[p.authorId] = [p]),
      );
      return usersIds.map((userId) => posts[userId] ?? []);
    }),
    profilesByMemberType: new DataLoader<string, ProfileBody[]>(
      async (memberTypesIds) => {
        const relatedProfiles = await prisma.profile.findMany({
          where: {
            memberTypeId: {
              in: [...memberTypesIds],
            },
          },
        });
        const profiles: Record<string, ProfileBody[]> = {};
        relatedProfiles.forEach((p) =>
          profiles[p.memberTypeId]
            ? profiles[p.memberTypeId].push(p)
            : (profiles[p.memberTypeId] = [p]),
        );
        return memberTypesIds.map((memberTypeId) => profiles[memberTypeId] ?? []);
      },
    ),
    userSubscribedTo: new DataLoader<string, UserBody[]>(async (subscribersIds) => {
      const relatedUsers = await prisma.user.findMany({
        where: {
          subscribedToUser: {
            some: {
              subscriberId: {
                in: [...subscribersIds],
              },
            },
          },
        },
        include: {
          subscribedToUser: {
            select: {
              subscriberId: true,
            },
          },
        },
      });
      return subscribersIds.map((subscriberId) => {
        return relatedUsers.filter((user) => {
          return user.subscribedToUser.some((sub) => sub.subscriberId === subscriberId);
        });
      });
    }),
    subscribedToUser: new DataLoader<string, UserBody[]>(async (authorsIds) => {
      const relatedUsers = await prisma.user.findMany({
        where: {
          userSubscribedTo: {
            some: {
              authorId: {
                in: [...authorsIds],
              },
            },
          },
        },
        include: {
          userSubscribedTo: {
            select: {
              authorId: true,
            },
          },
        },
      });
      return authorsIds.map((authorId) => {
        return relatedUsers.filter((user) => {
          return user.userSubscribedTo.some((sub) => sub.authorId === authorId);
        });
      });
    }),
  };
}
