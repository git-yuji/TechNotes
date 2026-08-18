import type { MetadataRoute } from "next";
import { getNotes } from "@/lib/notes";

const siteUrl = "https://notes.yuyu-web.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const notes = await getNotes();

	return [
		{
			url: siteUrl,
		},
		...notes.map((note) => ({
			url: `${siteUrl}/notes/${note.id}`,
			lastModified: note.updatedAt,
		})),
	];
}
