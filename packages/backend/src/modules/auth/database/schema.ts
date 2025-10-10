import { pgTable, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { users } from '../../user/database/schema';

export const identityTable = pgTable('oauth_accounts', {
  id: varchar('id', { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  provider: varchar('provider', { length: 50 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(), // unique id from provider
  userId: varchar('user_id', { length: 36 })
    .references(() => users.id, { onDelete: 'set null' }) // link to local user
    .default(sql`null`),
  email: varchar('email', { length: 255 }),
  profile: jsonb('profile'), // stores provider profile data
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
