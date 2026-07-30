INSERT INTO tags (name) VALUES
  ('Next.js'),
  ('Cloudflare')
ON CONFLICT(name) DO NOTHING;

INSERT INTO notes (title, category_id, content, memo)
SELECT
  'Cloudflare WorkersへNext.jsをデプロイする方法',
  categories.id,
  '## 概要

Next.jsアプリケーションをOpenNextアダプターでCloudflare Workersへデプロイする手順を確認するためのテストノートです。

## 確認コマンド

```bash
npm run build
npm run preview
```',
  '一般化した動作確認用データです。'
FROM categories
WHERE categories.name = '学習'
  AND NOT EXISTS (
    SELECT 1
    FROM notes
    WHERE notes.title = 'Cloudflare WorkersへNext.jsをデプロイする方法'
  );

INSERT INTO note_tags (note_id, tag_id)
SELECT notes.id, tags.id
FROM notes
JOIN tags ON tags.name IN ('Next.js', 'Cloudflare')
WHERE notes.title = 'Cloudflare WorkersへNext.jsをデプロイする方法'
ON CONFLICT(note_id, tag_id) DO NOTHING;
