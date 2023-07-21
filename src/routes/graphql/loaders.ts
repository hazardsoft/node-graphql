import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export type Loaders = {
  users: DataLoader<unknown, unknown, unknown>;
  profiles: DataLoader<unknown, unknown, unknown>;
  profilesByUser: DataLoader<unknown, unknown, unknown>;
  profilesByMemberType: DataLoader<unknown, unknown, unknown>;
  posts: DataLoader<unknown, unknown, unknown>;
  postsByUser: DataLoader<unknown, unknown, unknown>;
  memberTypes: DataLoader<unknown, unknown, unknown>;
  userSubscribedTo: DataLoader<unknown, unknown, unknown>;
  subscribedToUser: DataLoader<unknown, unknown, unknown>;
};

export function createLoaders(prisma: PrismaClient): Loaders {
  const usersLoader = new DataLoader(async (ids) => {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
    });
    if (users.length !== ids.length) {
      throw new Error('users length is different to keys length');
    }
    return users;
  });

  const profilesLoader = new DataLoader(async (ids) => {
    const profiles = await prisma.profile.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
    });
    if (profiles.length !== ids.length) {
      throw new Error('profiles length is different to keys length');
    }
    return profiles;
  });

  const profilesByUserLoader = new DataLoader(async (usersIds) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: {
          in: usersIds as string[],
        },
      },
    });
    const filledProfiles = usersIds.map((userId) => {
      return (
        profiles.find((profile) => profile.userId === userId) ??
        Error(`profile of ${userId as string} not found`)
      );
    });
    if (filledProfiles.length !== usersIds.length) {
      throw new Error('profilesByUser length is different to keys length');
    }
    return filledProfiles;
  });

  const postsLoader = new DataLoader(async (ids) => {
    const posts = await prisma.post.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
    });
    if (posts.length !== ids.length) {
      throw new Error('posts length is different to keys length');
    }
    return posts;
  });

  const postsByUserLoader = new DataLoader(async (usersIds) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: usersIds as string[],
        },
      },
    });
    const filledPosts = usersIds.map((userId) => {
      return (
        posts.filter((post) => post.authorId === userId) ??
        Error(`user ${userId as string} not found`)
      );
    });
    if (filledPosts.length !== usersIds.length) {
      throw new Error('postsByUserLoader length is different to keys length');
    }
    return filledPosts;
  });

  const memberTypesLoader = new DataLoader((ids) => {
    return prisma.memberType.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
    });
  });

  const profilesByMemberTypeLoader = new DataLoader(async (ids) => {
    const profiles = await prisma.profile.findMany({
      where: {
        memberTypeId: { in: ids as string[] },
      },
    });
    const filledProfiles = ids.map((memberTypeId) => {
      return (
        profiles.find((profile) => profile.memberTypeId === memberTypeId) ??
        Error(`profile with ${memberTypeId as string} not found`)
      );
    });
    if (filledProfiles.length !== ids.length) {
      throw new Error('profilesByMemberType length is different to keys length');
    }
    return filledProfiles;
  });

  const userSubscribedToLoader = new DataLoader(async (usersIds) => {
    const users = await prisma.user.findMany({
      where: {
        subscribedToUser: {
          some: {
            subscriberId: {
              in: usersIds as string[],
            },
          },
        },
      },
    });
    const filledUsers = usersIds.map((userId) => {
      return (
        users.filter((user) => user.id === userId) ??
        Error(`user ${userId as string} not found`)
      );
    });
    if (filledUsers.length !== usersIds.length) {
      throw new Error('userSubscribed length is different to keys length');
    }
    return filledUsers;
  });

  const subscribedToUserLoader = new DataLoader(async (usersIds) => {
    const users = await prisma.user.findMany({
      where: {
        userSubscribedTo: {
          some: {
            authorId: { in: usersIds as string[] },
          },
        },
      },
    });
    const filledUsers = usersIds.map((userId) => {
      return (
        users.filter((user) => user.id === userId) ??
        Error(`user ${userId as string} not found`)
      );
    });
    if (filledUsers.length !== usersIds.length) {
      throw new Error('subscribedToUser length is different to keys length');
    }
    return filledUsers;
  });

  return {
    users: usersLoader,
    profiles: profilesLoader,
    profilesByMemberType: profilesByMemberTypeLoader,
    posts: postsLoader,
    postsByUser: postsByUserLoader,
    memberTypes: memberTypesLoader,
    profilesByUser: profilesByUserLoader,
    userSubscribedTo: userSubscribedToLoader,
    subscribedToUser: subscribedToUserLoader,
  };
}
