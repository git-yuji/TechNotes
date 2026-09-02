export type MarkdownHeading = {
	id: string;
	level: 2 | 3;
	text: string;
	offset: number;
};

function getHeadingText(source: string) {
	return source
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
		.replace(/`+([^`]+)`+/g, "$1")
		.replace(/<([^>]+)>/g, "$1")
		.replace(/[\*_~]/g, "")
		.replace(/\\([\\`*{}\[\]()#+\-.!_>~])/g, "$1")
		.trim();
}

function getHeadingSlug(text: string) {
	return (
		text
			.normalize("NFKC")
			.toLocaleLowerCase("ja-JP")
			.replace(/\s+/g, "-")
			.replace(/[^\p{Letter}\p{Number}_-]/gu, "")
			.replace(/-+/g, "-")
			.replace(/^-|-$/g, "") || "section"
	);
}

export function extractMarkdownHeadings(markdown: string): MarkdownHeading[] {
	const headings: MarkdownHeading[] = [];
	const slugCounts = new Map<string, number>();
	let fence: { marker: "`" | "~"; length: number } | undefined;
	let offset = 0;

	for (const sourceLine of markdown.split("\n")) {
		const line = sourceLine.endsWith("\r") ? sourceLine.slice(0, -1) : sourceLine;
		const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/);

		if (fence) {
			if (
				fenceMatch &&
				fenceMatch[1][0] === fence.marker &&
				fenceMatch[1].length >= fence.length &&
				line.slice(fenceMatch[0].length).trim() === ""
			) {
				fence = undefined;
			}
		} else if (fenceMatch) {
			fence = {
				marker: fenceMatch[1][0] as "`" | "~",
				length: fenceMatch[1].length,
			};
		} else {
			const headingMatch = line.match(/^ {0,3}(#{2,3})(?:[\t ]+|$)(.*)$/);

			if (headingMatch) {
				const text = getHeadingText(headingMatch[2].replace(/[\t ]+#+[\t ]*$/, ""));

				if (text) {
					const baseSlug = getHeadingSlug(text);
					const count = (slugCounts.get(baseSlug) ?? 0) + 1;
					slugCounts.set(baseSlug, count);
					headings.push({
						id: count === 1 ? baseSlug : `${baseSlug}-${count}`,
						level: headingMatch[1].length as 2 | 3,
						text,
						offset,
					});
				}
			}
		}

		offset += sourceLine.length + 1;
	}

	return headings;
}
