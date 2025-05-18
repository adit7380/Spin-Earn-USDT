import { pgTable, text, serial, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  telegramId: text("telegram_id").notNull().unique(),
  username: text("username"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  coins: integer("coins").notNull().default(0),
  usdtWallet: text("usdt_wallet"),
  referralCode: text("referral_code").notNull(),
  referrerId: integer("referrer_id").references(() => users.id),
  lastSpin: timestamp("last_spin", { mode: 'date' }),
  spinsLeft: integer("spins_left").notNull().default(100),
  referralEarnings: integer("referral_earnings").notNull().default(0),
  totalEarned: decimal("total_earned", { precision: 10, scale: 4 }).notNull().default("0"),
  banned: boolean("banned").notNull().default(false),
  createdAt: timestamp("created_at", { mode: 'date' }).notNull().defaultNow(),
});

// Withdrawals table
export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 4 }).notNull(),
  usdtWallet: text("usdt_wallet").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at", { mode: 'date' }).notNull().defaultNow(),
  processedAt: timestamp("processed_at", { mode: 'date' }),
});

// Ads table
export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  watchTime: integer("watch_time").notNull(), // in seconds
  reward: integer("reward").notNull(), // coin reward
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: 'date' }).notNull().defaultNow(),
});

// Ad views table
export const adViews = pgTable("ad_views", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  adId: integer("ad_id").notNull().references(() => ads.id),
  createdAt: timestamp("created_at", { mode: 'date' }).notNull().defaultNow(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(), // can be negative for withdrawals
  type: text("type").notNull(), // spin, ad, referral, withdrawal
  sourceId: integer("source_id"), // id of the related resource (spin, ad, etc.)
  createdAt: timestamp("created_at", { mode: 'date' }).notNull().defaultNow(),
});

// Spin results table
export const spinResults = pgTable("spin_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  reward: integer("reward").notNull(),
  createdAt: timestamp("created_at", { mode: 'date' }).notNull().defaultNow(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  totalEarned: true,
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertAdSchema = createInsertSchema(ads).omit({
  id: true,
  createdAt: true,
});

export const insertAdViewSchema = createInsertSchema(adViews).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertSpinResultSchema = createInsertSchema(spinResults).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;

export type Ad = typeof ads.$inferSelect;
export type InsertAd = z.infer<typeof insertAdSchema>;

export type AdView = typeof adViews.$inferSelect;
export type InsertAdView = z.infer<typeof insertAdViewSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type SpinResult = typeof spinResults.$inferSelect;
export type InsertSpinResult = z.infer<typeof insertSpinResultSchema>;
