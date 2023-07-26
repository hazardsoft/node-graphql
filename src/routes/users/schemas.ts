import { Type } from '@fastify/type-provider-typebox';

export const userFields = {
  id: Type.String({
    format: 'uuid',
  }),
  name: Type.String(),
  balance: Type.Number(),
};

export const subscriptionFields = {
  subscriberId: Type.String({
    format: 'uuid',
  }),
  authorId: Type.String({
    format: 'uuid',
  }),
};

export const userSchema = Type.Object({
  ...userFields,
});

export const subscriptionSchema = Type.Object({
  ...subscriptionFields,
});

export const getUserByIdSchema = {
  params: Type.Object(
    {
      userId: userFields.id,
    },
    {
      additionalProperties: false,
    },
  ),
};

export const createUserSchema = {
  body: Type.Object(
    {
      name: userFields.name,
      balance: userFields.balance,
    },
    {
      additionalProperties: false,
    },
  ),
};

export const changeUserByIdSchema = {
  params: getUserByIdSchema.params,
  body: Type.Partial(
    Type.Object({
      name: userFields.name,
      balance: userFields.balance,
    }),
    {
      additionalProperties: false,
    },
  ),
};
