<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let orderCount = 0;
	let promotionId = ''

	type Promotion = { id: string; count: number; totalCount: number; };
	let promotions: Promotion[] = [];

	const onStart = async () => {
		promotions = [{ id: promotionId, count: orderCount/2, totalCount: orderCount }, ...promotions];
		await fetch('/api/batch-orders', { method: 'POST', body: JSON.stringify({ orders: orderCount, id: promotionId }) });
		saveToLocalStorage(promotions);
		orderCount = 0;
		promotionId = '';
	};

	const fetchBatchOrder = async (id: string) => {
		const response = await fetch(`/api/batch-order`, { method: 'POST', body: JSON.stringify({ id }) });
		const result = await response.json();
	}

	const saveToLocalStorage = (promotions: Promotion[]) => {
    localStorage.setItem('promotions', JSON.stringify(promotions))
  }

  const readFromLocalStorage = () => {
    promotions = JSON.parse(localStorage.getItem('promotions') || '[]')
  }

  const onClear = () => {
    localStorage.removeItem('promotions')
		window.location.reload();
  }


	onMount(async () => {
		readFromLocalStorage();
	});
</script>

<div class="flex flex-col gap-4 items-center justify-start">
	<h1>Store Manager</h1>
	<div class="w-full p-4 flex flex-col gap-4 bg-white border border-black rounded">
		<h3 class="text-xl font-bold">Analytics</h3>
		<div class="flex justify-between">
			<p>Monitor backlog of orders, deliveries and payments</p>
			<button on:click={() => goto('/admin/monitor')} class="w-48">Monitor</button>
		</div>
	</div>
	<div class="flex flex-col gap-2 w-full">
		<div class="w-full p-4 flex flex-col gap-4 bg-white border border-black rounded">
			<h3 class="text-xl font-bold">Promotions</h3>
			<div class="flex justify-between">
			<div class="flex items-center gap-2">
				<input placeholder="Promotion Name" bind:value={promotionId} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5" />
				<input type="number" bind:value={orderCount} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2.5" />
				<button on:click={onStart} disabled={!promotionId || !orderCount}>Start</button>
			</div>
			<button on:click={onClear} disabled={!promotions.length}>Clear All</button>
			</div>
		</div>
		{#each promotions as promotion}
			<div class="w-full p-4 flex flex-col gap-4 bg-white border border-black rounded">
				<div class="flex flex-col gap-2">
					<h3 class="text-xl font-bold">{promotion.id}</h3>
					<!-- {#await fetchBatchOrder(promotion.id) then data} -->
					<progress class="w-full" value={promotion.count} max={promotion.totalCount}></progress>
					<!-- {/await} -->
				</div>
			</div>
		{/each}
	</div>
</div>
