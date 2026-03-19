import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getVisibleBlogPosts } from '../utils/content-helpers';

export async function GET(context) {
	const allPosts = await getCollection('blog');
	const posts = getVisibleBlogPosts(allPosts);

	const items = posts.map((post) => ({
		title: post.data.title,
		description: post.data.excerpt || post.data.creativeNote || post.data.title,
		link: `/blog/${post.id}/`,
		pubDate: post.data.publishDate,
		author: post.data.author || 'Whiteport',
	}));

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items,
	});
}
