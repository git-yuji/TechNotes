DELETE FROM note_tags
WHERE note_id IN (
	SELECT id
	FROM notes
	WHERE title = 'Cloudflare WorkersへNext.jsをデプロイする方法'
		AND memo = '一般化した動作確認用データです。'
		AND source_file IS NULL
);

DELETE FROM notes
WHERE title = 'Cloudflare WorkersへNext.jsをデプロイする方法'
	AND memo = '一般化した動作確認用データです。'
	AND source_file IS NULL;
