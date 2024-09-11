import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ fetch }) => {
	try {
		const response = await fetch(`${env.ORDER_API_URL}/backlog-stats`);
		const taskQueues = await response.json();
		return json({ status: 'ok', taskQueues });
	} catch (e) {
		return json({ status: 'error' });
	}
};
