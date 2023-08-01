import { PrismaClient } from '@prisma/client';
import { createLoaders } from './loaders.js';
import { memberTypeSchema } from '../member-types/schemas.js';
import { Static } from '@sinclair/typebox';
import { postSchema } from '../posts/schemas.js';
import { profileSchema } from '../profiles/schemas.js';
import { userSchema } from '../users/schemas.js';
import { subscriptionSchema } from '../users/schemas.js';

export type GraphQLContext = {
  prisma: PrismaClient;
  loaders: ReturnType<typeof createLoaders>;
};

export type MemberTypeBody = Static<typeof memberTypeSchema>;
export type PostBody = Static<typeof postSchema>;
export type ProfileBody = Static<typeof profileSchema>;
export type UserBody = Static<typeof userSchema>;
export type SubscriptionsBody = Static<typeof subscriptionSchema>;
