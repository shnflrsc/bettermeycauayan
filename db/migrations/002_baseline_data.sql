-- OpenLGU Baseline Data — Seed reference records
-- Migration: 002_baseline_data.sql
--
-- Contains only manually maintained reference data:
-- - Terms (3 Sangguniang Panlungsod terms)
-- - Persons, memberships, committees populated by data migration script
--
-- Run AFTER 001_initial_schema.sql and BEFORE data migration script.

INSERT INTO terms (id, term_number, ordinal, name, start_date, end_date, year_range) VALUES
  ('sp_6', 6, '6th', '6th Sangguniang Panlungsod', '2019-06-30', '2022-06-29', '2019-2022'),
  ('sp_7', 7, '7th', '7th Sangguniang Panlungsod', '2022-06-30', '2025-06-29', '2022-2025'),
  ('sp_8', 8, '8th', '8th Sangguniang Panlungsod', '2025-06-30', '2028-06-29', '2025-2028');

INSERT INTO schema_migrations (name) VALUES ('001_initial_schema.sql');
INSERT INTO schema_migrations (name) VALUES ('002_baseline_data.sql');
