import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const signups = pgTable(
  'signups',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    verifyToken: text('verify_token').unique(),
    verifyTokenExpiresAt: timestamp('verify_token_expires_at', {
      withTimezone: true,
    }),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
    surveyCompletedAt: timestamp('survey_completed_at', { withTimezone: true }),
    // building | using | node | curious
    intent: text('intent'),
    chainsUsed: jsonb('chains_used').$type<string[]>(),
    firstThing: text('first_thing'),
    // 0 unverified, 1 email verified, 2 verified + survey, 3 manually flagged
    priorityTier: integer('priority_tier').notNull().default(0),
    status: text('status').notNull().default('pending'),
    source: text('source'),
    utm: jsonb('utm').$type<Record<string, string>>(),
    ipHash: text('ip_hash'),
    country: text('country'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('signups_priority_created_idx').on(t.priorityTier, t.createdAt),
    index('signups_status_idx').on(t.status),
    index('signups_ip_hash_created_idx').on(t.ipHash, t.createdAt),
  ],
);

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  signupId: uuid('signup_id').references(() => signups.id, {
    onDelete: 'cascade',
  }),
  type: text('type').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Signup = typeof signups.$inferSelect;
export type NewSignup = typeof signups.$inferInsert;
export type Event = typeof events.$inferSelect;
