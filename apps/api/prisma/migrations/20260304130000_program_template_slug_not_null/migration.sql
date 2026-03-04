-- Make slug non-nullable.
-- All existing rows must already have a slug set before applying this migration.
ALTER TABLE "ProgramTemplate" ALTER COLUMN "slug" SET NOT NULL;
