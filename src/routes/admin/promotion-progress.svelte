<script lang="ts">
	// import { onDestroy, onMount } from 'svelte';

  export let id: string;

  // let promotion: any;
  // let fetchInterval: NodeJS.Timeout;

	// const fetchBatchOrder = async () => {
	// 	const response = await fetch(`/api/batch-order`, {
	// 		method: 'POST',
	// 		body: JSON.stringify({ id })
	// 	});
	// 	const result = await response.json();
  //   promotion = result.promotion
  //   if (promotion.completed_activities >= promotion.total_activities) {
  //     clearInterval(fetchInterval);
  //     fetchInterval = null;
  //   }
	// };

  // onMount(() => {
  //   fetchBatchOrder();
	// 	fetchInterval = setInterval(() => {
	// 		fetchBatchOrder();
	// 	}, 1000);
  // })

  // onDestroy(() => {
  //   clearInterval(fetchInterval);
  //   fetchInterval = null;
  // })

  // $: progress = promotion?.completed_activities / promotion?.total_activities * 100;
</script>

  <div class="flex w-full">
    <h3 class="text-xl font-bold">{id}</h3>
  </div>
