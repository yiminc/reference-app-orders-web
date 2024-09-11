import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
	const { id } = await request.json();

	try {
		const response = await fetch(`${env.ORDER_API_URL}/batch-orders/${id}`);
		const promotion = await response.json();
		console.log('Promotion: ', promotion);
		return json({ status: 'ok', promotion });
	} catch (e) {
		return json({ status: 'error' });
	}
};
