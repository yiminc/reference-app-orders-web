import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const fetchTaskQueue = async (fetch: typeof window.fetch, taskQueue: string) => {
  const response = await fetch(`${env.TEMPORAL_API_URL}/api/v1/namespaces/default/task-queues/${taskQueue}?apiMode=DESCRIBE_TASK_QUEUE_MODE_ENHANCED&reportStats=true`);
  const result = await response.json();
  return { taskQueue, ...result };
}

export const GET: RequestHandler = async ({ fetch }) => {
	try {
    const taskQueues = await Promise.all([fetchTaskQueue(fetch, 'orders'), fetchTaskQueue(fetch, 'shipments'), fetchTaskQueue(fetch, 'billing')]);
    return json({ taskQueues });
	} catch (e) {
		return json({ status: 'error' });
	}
};

