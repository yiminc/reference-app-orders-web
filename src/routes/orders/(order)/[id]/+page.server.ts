import { env } from '$env/dynamic/private';

export const load = async ({ params, depends }) => {
	depends('data:order')
	const { id } = params;

	const orderResponse = await fetch(`${env.ORDER_API_URL}/orders/${id}`);
	console.log(orderResponse);
	const order = await orderResponse.json();

	return { order };
};
