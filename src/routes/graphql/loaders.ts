import { PrismaClient, Profile, User, MemberType, Post } from '@prisma/client';
import DataLoader from 'dataloader';

export type Loaders = {
  users: DataLoader<string, User | undefined>;
  profiles: DataLoader<string, Profile | undefined>;
  profilesByUser: DataLoader<string, Profile | undefined>;
  profilesByMemberType: DataLoader<string, Profile | undefined>;
  posts: DataLoader<string, Post | undefined>;
  postsByUser: DataLoader<string, Post[]>;
  memberTypes: DataLoader<string, MemberType | undefined>;
  userSubscribedTo: DataLoader<string, User[]>;
  subscribedToUser: DataLoader<string, User[]>;
};

export default class LoadersClass {
  constructor(private prisma: PrismaClient) {}

  public createLoaders(): Loaders {
    return {
      users: new DataLoader(this.usersBatch),
      profiles: new DataLoader(this.profilesBatch),
      profilesByUser: new DataLoader(this.profilesByUserBatch),
      posts: new DataLoader(this.postsBatch),
      postsByUser: new DataLoader(this.postsByUserBatch),
      memberTypes: new DataLoader(this.memberTypesBatch),
      profilesByMemberType: new DataLoader(this.profilesByMemberTypeBatch),
      userSubscribedTo: new DataLoader(this.userSubscribedToBatch),
      subscribedToUser: new DataLoader(this.subscribedToUserBatch),
    };
  }

  private usersBatch = async (userIds: ReadonlyArray<string>) => {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds as string[],
        },
      },
    });
    const filledUsers = userIds.map((id) => {
      return users.find((user) => user.id === id);
    });
    if (filledUsers.length !== userIds.length) {
      throw new Error('users length is different to keys length');
    }
    return filledUsers;
  };

  private profilesBatch = async (ids: ReadonlyArray<string>) => {
    const profiles = await this.prisma.profile.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
    });
    const filledProfiles = ids.map((id) => {
      return profiles.find((profile) => profile.id === id);
    });
    if (filledProfiles.length !== ids.length) {
      throw new Error('profiles length is different to keys length');
    }
    return filledProfiles;
  };

  private profilesByUserBatch = async (usersIds: ReadonlyArray<string>) => {
    const profiles = await this.prisma.profile.findMany({
      where: {
        userId: {
          in: usersIds as string[],
        },
      },
    });
    const filledProfiles = usersIds.map((userId) => {
      return profiles.find((profile) => profile.userId === userId);
    });
    if (filledProfiles.length !== usersIds.length) {
      throw new Error('profilesByUser length is different to keys length');
    }
    return filledProfiles;
  };

  private postsBatch = async (ids: ReadonlyArray<string>) => {
    const posts = await this.prisma.post.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
    });
    const filledPosts = ids.map((id) => {
      return posts.find((post) => post.id === id);
    });
    if (filledPosts.length !== ids.length) {
      throw new Error('posts length is different to keys length');
    }
    return filledPosts;
  };

  private postsByUserBatch = async (usersIds: ReadonlyArray<string>) => {
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: {
          in: usersIds as string[],
        },
      },
    });
    const filledPosts = usersIds.map((userId) => {
      return posts.filter((post) => post.authorId === userId);
    });
    if (filledPosts.length !== usersIds.length) {
      throw new Error('postsByUserLoader length is different to keys length');
    }
    return filledPosts;
  };

  private memberTypesBatch = async (ids: ReadonlyArray<string>) => {
    return this.prisma.memberType.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
    });
  };

  private profilesByMemberTypeBatch = async (ids: ReadonlyArray<string>) => {
    const profiles = await this.prisma.profile.findMany({
      where: {
        memberTypeId: { in: ids as string[] },
      },
    });
    const filledProfiles = ids.map((memberTypeId) => {
      return profiles.find((profile) => profile.memberTypeId === memberTypeId);
    });
    if (filledProfiles.length !== ids.length) {
      throw new Error('profilesByMemberType length is different to keys length');
    }
    return filledProfiles;
  };

  private userSubscribedToBatch = async (usersIds: ReadonlyArray<string>) => {
    const users = await this.prisma.user.findMany({
      where: {
        subscribedToUser: {
          some: {
            subscriberId: { in: usersIds as string[] },
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
    const filledUsers = usersIds.map((userId) => {
      return users.filter((user) =>
        user.subscribedToUser.some(
          (subscription) => subscription.subscriberId === userId,
        ),
      );
    });
    if (filledUsers.length !== usersIds.length) {
      throw new Error('userSubscribedTo length is different to keys length');
    }
    return filledUsers;
  };

  private subscribedToUserBatch = async (usersIds: ReadonlyArray<string>) => {
    const users = await this.prisma.user.findMany({
      where: {
        userSubscribedTo: {
          some: {
            authorId: {
              in: usersIds as string[],
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
    const filledUsers = usersIds.map((userId) => {
      return users.filter((user) =>
        user.userSubscribedTo.some((subscription) => subscription.authorId === userId),
      );
    });
    if (filledUsers.length !== usersIds.length) {
      throw new Error('subscribedToUser length is different to keys length');
    }
    return filledUsers;
  };
}
