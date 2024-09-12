<script lang="ts">
	import { onMount } from 'svelte';
	import PromotionProgress from './promotion-progress.svelte';
	import Monitoring from './monitoring.svelte';

	let orderCount = 0;
	let promotionId = '';

	let promotions: string[] = [];

	const onStart = async () => {
		promotions = [...promotions, promotionId];
		await fetch('/api/batch-orders', {
			method: 'POST',
			body: JSON.stringify({ orders: orderCount, id: promotionId })
		});
		saveToLocalStorage(promotions);
		orderCount = 0;
		promotionId = '';
	};

	const saveToLocalStorage = (promotions: string[]) => {
		localStorage.setItem('promotions', JSON.stringify(promotions));
	};

	const readFromLocalStorage = () => {
		promotions = JSON.parse(localStorage.getItem('promotions') || '[]');
	};

	const onClear = () => {
		localStorage.removeItem('promotions');
		promotions = [];
	};

	onMount(async () => {
		readFromLocalStorage();
	});
</script>

<div class="flex flex-col gap-4 items-center justify-start">
	<h1>Store Manager</h1>
	<div class="w-full gap-2 flex flex-col xl:flex-row">
		<Monitoring />
		<div class="flex flex-col gap-2 w-full">
			<div class="w-full p-4 flex flex-col gap-4 bg-white border border-black rounded">
				<div class="flex justify-between w-full items-center">
					<h1>Promotions</h1>
					<button on:click={onClear} disabled={!promotions.length}>Clear All</button>
				</div>
				<div class="flex justify-between mb-4">
					<div class="flex items-center gap-2">
						<input
							placeholder="Promotion Name"
							bind:value={promotionId}
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5"
						/>
						<input
							type="number"
							bind:value={orderCount}
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2.5"
						/>
						<button on:click={onStart} disabled={!promotionId || !orderCount}>Start</button>
					</div>
				</div>
				{#each promotions as id}
					<PromotionProgress {id} />
				{/each}
			</div>
		</div>
	</div>
</div>
