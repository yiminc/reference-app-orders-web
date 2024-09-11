import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async () => {
	try {
		const response = await fetch(`${env.FRAUD_API_URL}/maintenance`, {
			method: 'POST'
		});
		return json({ status: 'ok', body: response });
	} catch (e) {
		return json({ status: 'error' });
	}
};
