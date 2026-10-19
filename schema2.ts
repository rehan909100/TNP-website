/**
 * schema2.ts
 * ---------------------------------------------------------------------------
 * Drizzle ORM (PostgreSQL) schema derived directly from the Chen ER diagram:
 *
 *   "Chen ER Diagram: MME Placement Analytics Dashboard, NIT Tiruchirappalli"
 *   (assets/index.html, generated with Graphviz)
 *
 * The diagram defines the following entities, attributes and relationships.
 * Every field below maps 1:1 to a node in that diagram; nothing has been
 * invented. Where the diagram is silent (column lengths, nullability) the
 * smallest reasonable PostgreSQL choice is used and marked with a NOTE.
 *
 * Entities and attributes
 * ---------------------------------------------------------------------------
 *   STUDENT
 *     - roll_number        (primary key, underlined in diagram)
 *     - name
 *     - batch_year
 *     - placement_status
 *
 *   PLACEMENT_OFFER
 *     - offer_id           (primary key, underlined in diagram)
 *     - job_role
 *     - package_LPA
 *     - placement_year
 *     - offer_status
 *     - offer_date
 *     - joining_date
 *
 *   COMPANY
 *     - company_id         (primary key, underlined in diagram)
 *     - name
 *     - domain
 *     - profile
 *     - contact            (composite)
 *         - HR_name
 *         - email
 *         - number
 *         - PVR_status
 *
 *   USER
 *     - user_id            (primary key, underlined in diagram)
 *     - name
 *     - email
 *     - password_hash
 *     - role               (ADMIN | PROFESSOR)
 *     - is_active
 *     NOTE: standalone entity — "Authentication and role-based access only
 *     (no relationships to other entities)". It therefore has no foreign keys
 *     and nothing references it.
 *
 * Relationships
 * ---------------------------------------------------------------------------
 *   RECEIVES : STUDENT 1 -- (0,N) PLACEMENT_OFFER
 *              One student receives zero-to-many offers.
 *   MAKES    : COMPANY 1 -- (0,N) PLACEMENT_OFFER
 *              One company makes zero-to-many offers.
 *
 * As a relational model the two relationships resolve into foreign keys on
 * PLACEMENT_OFFER (the many side of both), so PLACEMENT_OFFER carries
 * student_id and company_id. Because both relationships have a (0,N) minimum
 * of 0 on the offer side, both foreign keys are nullable.
 *
 * Open questions carried over from AGENTS.md (NOT resolved here):
 *   - The exact meaning of "PVR_status" in the diagram is unconfirmed; it is
 *     stored as free-form text for now.
 *   - The diagram does not specify a placement-rate denominator / eligible
 *     student count per batch.
 * ---------------------------------------------------------------------------
 */

import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  date,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

/** USER.role — "(ADMIN | PROFESSOR)" as written in the diagram. */
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "PROFESSOR"]);

/**
 * STUDENT.placement_status.
 * NOTE: the diagram gives the attribute name but not the allowed values.
 * These four values cover the placement outcomes the dashboard must
 * distinguish (placed / not placed / still pending / not eligible).
 */
export const placementStatusEnum = pgEnum("placement_status", [
  "PLACED",
  "UNPLACED",
  "PENDING",
  "NOT_ELIGIBLE",
]);

/**
 * PLACEMENT_OFFER.offer_status.
 * NOTE: the diagram gives the attribute name but not the allowed values.
 * Kept separate from STUDENT.placement_status: a single student may hold
 * several offers whose individual statuses differ.
 */
export const offerStatusEnum = pgEnum("offer_status", [
  "OFFERED",
  "ACCEPTED",
  "DECLINED",
  "REVOKED",
  "PENDING",
]);

/** STUDENT — see diagram entity "STUDENT". */
export const students = pgTable(
  "students",
  {
    // roll_number is the underlined (primary key) attribute in the diagram.
    rollNumber: varchar("roll_number", { length: 30 }).primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    batchYear: integer("batch_year").notNull(),
    placementStatus: placementStatusEnum("placement_status")
      .notNull()
      .default("PENDING"),
  },
  (table) => [
    index("students_batch_year_idx").on(table.batchYear),
    check(
      "students_batch_year_valid_check",
      sql`${table.batchYear} >= 2000 AND ${table.batchYear} <= 2200`,
    ),
  ],
);

/**
 * COMPANY — see diagram entity "COMPANY".
 * The composite "contact" attribute is flattened into columns prefixed with
 * contact_ (HR_name, email, number, PVR_status).
 */
export const companies = pgTable(
  "companies",
  {
    // company_id is the underlined (primary key) attribute in the diagram.
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    domain: varchar("domain", { length: 150 }),
    profile: varchar("profile", { length: 150 }),

    // --- composite attribute: contact -------------------------------------
    contactHrName: varchar("contact_hr_name", { length: 100 }),
    // NOTE: the diagram calls this "email"; prefixed to avoid ambiguity with
    // USER.email. HR contact email, not a login identity.
    contactEmail: varchar("contact_email", { length: 255 }),
    // NOTE: "number" as drawn; stored as text to preserve formatting/country
    // codes rather than as an integer.
    contactNumber: varchar("contact_number", { length: 30 }),
    // NOTE: "PVR_status" — exact meaning unconfirmed (see header). Stored as
    // free-form text so the real value set can be discovered during import.
    contactPvrStatus: varchar("contact_pvr_status", { length: 50 }),
  },
  (table) => [index("companies_name_idx").on(table.name)],
);

/**
 * PLACEMENT_OFFER — see diagram entity "PLACEMENT_OFFER".
 * It is the many-side of both RECEIVES and MAKES, so the two foreign keys live
 * here and are nullable (both relationships have a 0 minimum).
 */
export const placementOffers = pgTable(
  "placement_offers",
  {
    // offer_id is the underlined (primary key) attribute in the diagram.
    id: uuid("id").defaultRandom().primaryKey(),

    // RECEIVES: STUDENT 1 -- (0,N) PLACEMENT_OFFER
    studentRollNumber: varchar("student_roll_number", { length: 30 }).references(
      () => students.rollNumber,
      { onDelete: "cascade", onUpdate: "cascade" },
    ),

    // MAKES: COMPANY 1 -- (0,N) PLACEMENT_OFFER
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),

    jobRole: varchar("job_role", { length: 150 }),
    packageLpa: numeric("package_lpa", { precision: 8, scale: 2 }),
    placementYear: integer("placement_year").notNull(),
    offerStatus: offerStatusEnum("offer_status").notNull().default("PENDING"),
    offerDate: date("offer_date", { mode: "string" }),
    joiningDate: date("joining_date", { mode: "string" }),
  },
  (table) => [
    index("placement_offers_student_roll_number_idx").on(table.studentRollNumber),
    index("placement_offers_company_id_idx").on(table.companyId),
    index("placement_offers_placement_year_idx").on(table.placementYear),
    index("placement_offers_offer_status_idx").on(table.offerStatus),
    check(
      "placement_offers_placement_year_valid_check",
      sql`${table.placementYear} >= 2000 AND ${table.placementYear} <= 2200`,
    ),
    check(
      "placement_offers_package_nonnegative_check",
      sql`${table.packageLpa} IS NULL OR ${table.packageLpa} >= 0`,
    ),
  ],
);

/**
 * USER — see diagram entity "USER".
 * Standalone authentication entity: no foreign keys, no inbound references.
 */
export const users = pgTable(
  "users",
  {
    // user_id is the underlined (primary key) attribute in the diagram.
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("PROFESSOR"),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    uniqueIndex("users_email_unique_idx").on(sql`lower(${table.email})`),
  ],
);

// ---------------------------------------------------------------------------
// Drizzle relations mirroring the diagram's RECEIVES and MAKES relationships.
// ---------------------------------------------------------------------------

export const studentsRelations = relations(students, ({ many }) => ({
  // RECEIVES: STUDENT 1 -- (0,N) PLACEMENT_OFFER
  placementOffers: many(placementOffers),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  // MAKES: COMPANY 1 -- (0,N) PLACEMENT_OFFER
  placementOffers: many(placementOffers),
}));

export const placementOffersRelations = relations(placementOffers, ({ one }) => ({
  student: one(students, {
    fields: [placementOffers.studentRollNumber],
    references: [students.rollNumber],
  }),
  company: one(companies, {
    fields: [placementOffers.companyId],
    references: [companies.id],
  }),
}));

// USER has no relations in the diagram.
