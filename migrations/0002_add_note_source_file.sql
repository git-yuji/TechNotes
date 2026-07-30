ALTER TABLE notes ADD COLUMN source_file TEXT;

CREATE UNIQUE INDEX notes_source_file_idx
ON notes(source_file)
WHERE source_file IS NOT NULL;
