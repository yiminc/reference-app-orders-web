<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	export let data;

	let promotion = 0;

	const onStart = async () => {
		// await fetch('/api/reset', { method: 'POST' });
		await invalidateAll();
	};

	const onStop = async () => {
		// await fetch('/api/limit', { method: 'POST', body: JSON.stringify({ limit: newLimit }) });
		await invalidateAll();
	};
</script>

<div class="flex flex-col gap-4 items-center justify-start">
	<h1>Store Manager</h1>
	<div class="flex gap-2 w-full">
		<div class="w-full p-4 flex flex-col gap-4 bg-white border border-black rounded">
			<h3 class="text-xl font-bold">Promotions</h3>
				<p>
					Current Promotion: <strong
						>{promotion || 'None'}</strong
					>
				</p>
				<div class="flex items-center gap-2">
					<input type="number" bind:value={promotion} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
					<button on:click={onStart} class="w-full">Start</button>
					<button on:click={onStop} class="w-full">Stop</button>
				</div>
		</div>
	</div>
</div>
