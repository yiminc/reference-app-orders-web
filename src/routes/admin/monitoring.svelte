<script lang="ts">
	import Chart from '$lib/components/chart.svelte';
	import { onDestroy, onMount } from 'svelte';

	let fetchInterval: NodeJS.Timeout;
	let labels: string[] = [];
	let orderData: number[] = [];
	let shipmentData: number[] = [];
	let billingData: number[] = [];
	let batchData: number[] = [];

	let refresh = 0;

	const saveToLocalStorage = (
		labels: string[],
		orderData: number[],
		shipmentData: number[],
		billingData: number[],
		batchData: number[]
	) => {
		localStorage.setItem('labels', JSON.stringify(labels));
		localStorage.setItem('orderData', JSON.stringify(orderData));
		localStorage.setItem('shipmentData', JSON.stringify(shipmentData));
		localStorage.setItem('billingData', JSON.stringify(billingData));
		localStorage.setItem('batchData', JSON.stringify(batchData));
	};

	const readFromLocalStorage = () => {
		labels = JSON.parse(localStorage.getItem('labels') || '[]');
		orderData = JSON.parse(localStorage.getItem('orderData') || '[]');
		shipmentData = JSON.parse(localStorage.getItem('shipmentData') || '[]');
		billingData = JSON.parse(localStorage.getItem('billingData') || '[]');
		batchData = JSON.parse(localStorage.getItem('batchData') || '[]');
	};

	const clearLocalStorage = () => {
		labels = [];
		orderData = [];
		shipmentData = [];
		billingData = [];
		batchData = [];
		localStorage.removeItem('labels');
		localStorage.removeItem('orderData');
		localStorage.removeItem('shipmentData');
		localStorage.removeItem('billingData');
		localStorage.removeItem('batchData');
	};

	const parseTaskQueueInfo = (stats: any) => {
		const taskQueues = stats?.taskQueues;
		if (taskQueues) {
			labels = [...labels, new Date().toLocaleTimeString()];
			taskQueues.forEach((stat: any) => {
				if (stat.taskQueue === 'orders') {
					orderData = [...orderData, stat.totalBacklogSize];
				} else if (stat.taskQueue === 'shipments') {
					shipmentData = [...shipmentData, stat.totalBacklogSize];
				} else if (stat.taskQueue === 'billing') {
					billingData = [...billingData, stat.totalBacklogSize];
				} else if (stat.taskQueue === 'batchOrders') {
					batchData = [...batchData, stat.totalBacklogSize];
				}
			});
			saveToLocalStorage(labels, orderData, shipmentData, billingData, batchData);
		}
	};

	const getTaskQueueStats = async () => {
		const res = await fetch('/api/monitor');
		const stats = await res.json();
		parseTaskQueueInfo(stats);
	};

	onMount(async () => {
		readFromLocalStorage();
	});

	onDestroy(() => {
		clearInterval(fetchInterval);
	});

	const onStartMonitoring = () => {
		getTaskQueueStats();
		fetchInterval = setInterval(() => {
			getTaskQueueStats();
		}, 1000);
	};

	const onStopMonitoring = () => {
		clearInterval(fetchInterval);
		fetchInterval = null;
	};

	const onClearMonitoring = () => {
		clearInterval(fetchInterval);
		fetchInterval = null;
		clearLocalStorage();
		refresh = Date.now();
	};
</script>

<div class="flex flex-col gap-4 items-center justify-start w-full">
  <div class="w-full p-4 flex flex-col gap-4 bg-white border border-black rounded">
    <div class="flex justify-between w-full items-center">
      <h1>Backlog Size</h1>
      <div class="flex gap-4 items-center">
        <button on:click={onStartMonitoring} class="w-auto" disabled={!!fetchInterval}>Start</button>
        <button on:click={onStopMonitoring} class="w-auto" disabled={!fetchInterval}>Stop</button>
        <button on:click={onClearMonitoring} class="w-auto">Clear</button>
      </div>
    </div>
		<div class="w-full h-[400px]">
			<Chart {labels} {orderData} {shipmentData} {billingData} {refresh} />
		</div>
	</div>
</div>
