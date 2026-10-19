import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  numeric,
  date,
  jsonb,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

/** User roles for the department-only placement analytics dashboard. */
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "PROFESSOR"]);

/** Placement status used by historical records and dashboard calculations. */
export const placementStatusEnum = pgEnum("placement_status", [
  "PLACED",
  "UNPLACED",
  "PENDING",
  "NOT_ELIGIBLE",
]);

/** Employment / offer category. */
export const compensationTypeEnum = pgEnum("compensation_type", [
  "PPO",
  "FTE",
  "FTE_PLUS_6_MONTHS",
  "OTHER",
]);

/** Authentication accounts: only ADMIN and PROFESSOR users. */
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("PROFESSOR"),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("users_email_unique_idx").on(sql`lower(${table.email})`)],
);

/** The approximately 70 MME students represented in the historical data. */
export const students = pgTable(
  "students",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    rollNumber: varchar("roll_number", { length: 30 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    batchYear: integer("batch_year").notNull(),
    photoUrl: varchar("photo_url", { length: 2048 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("students_roll_number_unique_idx").on(table.rollNumber),
    index("students_batch_year_idx").on(table.batchYear),
    check("students_batch_year_valid_check", sql`${table.batchYear} >= 2000 AND ${table.batchYear} <= 2200`),
  ],
);

/** Company profile and HR contact information. */
export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    normalizedName: varchar("normalized_name", { length: 150 }).notNull(),
    domain: varchar("domain", { length: 150 }),
    website: varchar("website", { length: 2048 }),
    hrName: varchar("hr_name", { length: 100 }),
    hrPhone: varchar("hr_phone", { length: 30 }),
    hrEmail: varchar("hr_email", { length: 255 }),
    pvrStatus: varchar("pvr_status", { length: 50 }),
    logoUrl: varchar("logo_url", { length: 2048 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("companies_normalized_name_unique_idx").on(sql`lower(${table.normalizedName})`),
    index("companies_name_idx").on(table.name),
  ],
);

/**
 * One record for a student's placement outcome / offer record.
 * A student may have multiple records if multiple offers are tracked.
 * For an UNPLACED or PENDING record, company and CTC fields may be null.
 */
export const placements = pgTable(
  "placements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade", onUpdate: "cascade" }),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    batchYear: integer("batch_year").notNull(),
    ctcLpa: numeric("ctc_lpa", { precision: 8, scale: 2 }),
    salaryMinLpa: numeric("salary_min_lpa", { precision: 8, scale: 2 }),
    salaryMaxLpa: numeric("salary_max_lpa", { precision: 8, scale: 2 }),
    compensationType: compensationTypeEnum("compensation_type").notNull().default("OTHER"),
    status: placementStatusEnum("status").notNull().default("PENDING"),
    offerDate: date("offer_date", { mode: "string" }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("placements_student_id_idx").on(table.studentId),
    index("placements_company_id_idx").on(table.companyId),
    index("placements_batch_year_idx").on(table.batchYear),
    index("placements_status_idx").on(table.status),
    index("placements_batch_status_idx").on(table.batchYear, table.status),
    check("placements_batch_year_valid_check", sql`${table.batchYear} >= 2000 AND ${table.batchYear} <= 2200`),
    check("placements_ctc_nonnegative_check", sql`${table.ctcLpa} IS NULL OR ${table.ctcLpa} >= 0`),
    check(
      "placements_salary_range_valid_check",
      sql`(${table.salaryMinLpa} IS NULL OR ${table.salaryMinLpa} >= 0)
          AND (${table.salaryMaxLpa} IS NULL OR ${table.salaryMaxLpa} >= 0)
          AND (${table.salaryMinLpa} IS NULL OR ${table.salaryMaxLpa} IS NULL OR ${table.salaryMinLpa} <= ${table.salaryMaxLpa})`,
    ),
    check(
      "placements_placed_company_check",
      sql`${table.status} <> 'PLACED' OR ${table.companyId} IS NOT NULL`,
    ),
  ],
);

/** Audit trail for important administrative changes. */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    action: varchar("action", { length: 50 }).notNull(),
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    entityId: uuid("entity_id"),
    details: jsonb("details").$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("audit_logs_user_id_idx").on(table.userId),
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
    index("audit_logs_created_at_idx").on(table.createdAt),
  ],
);

// Drizzle relations are useful for relational queries; database foreign keys
// above remain the source of referential integrity.
export const usersRelations = relations(users, ({ many }) => ({
  auditLogs: many(auditLogs),
}));

export const studentsRelations = relations(students, ({ many }) => ({
  placements: many(placements),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  placements: many(placements),
}));

export const placementsRelations = relations(placements, ({ one }) => ({
  student: one(students, {
    fields: [placements.studentId],
    references: [students.id],
  }),
  company: one(companies, {
    fields: [placements.companyId],
    references: [companies.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
