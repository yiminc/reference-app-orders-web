<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

  export let id: string;

  let promotion: any;
  let fetchInterval: NodeJS.Timeout;

	const fetchBatchOrder = async () => {
		const response = await fetch(`/api/batch-order`, {
			method: 'POST',
			body: JSON.stringify({ id })
		});
		const result = await response.json();
    promotion = result.promotion
    if (promotion.completed_activities >= promotion.total_activities) {
      clearInterval(fetchInterval);
      fetchInterval = null;
    }
	};

  onMount(() => {
    fetchBatchOrder();
		fetchInterval = setInterval(() => {
			fetchBatchOrder();
		}, 1000);
  })

  onDestroy(() => {
    clearInterval(fetchInterval);
    fetchInterval = null;
  })

  $: progress = promotion?.completed_activities / promotion?.total_activities * 100;
</script>

<div class="w-full">
  <div class="flex flex-col gap-2">
    <div class="flex justify-between">
      <h3 class="text-xl font-bold">{id}</h3>
    </div>
    <div class="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700" role="progressbar" aria-valuenow={promotion?.completed_activities.toString() || ""} aria-valuemin="0" aria-valuemax={promotion?.total_activities.toString() || 100}>
      <div class="flex flex-col justify-center rounded-full overflow-hidden bg-green-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500" style="width: {progress}%"></div>
    </div>
    </div>
</div>
