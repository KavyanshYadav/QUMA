import { sql } from 'drizzle-orm';
import { pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id', { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text('email').notNull(),
  display_name: text('display_name').notNull(),
});
