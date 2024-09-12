<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let labels: string[] = [];
	export let orderData: number[] = [];
	export let shipmentData: number[] = [];
	export let billingData: number[] = [];
	export let batchData: number[] = [];
	export let refresh: number;

	let container: HTMLCanvasElement;
	let chart: typeof Chart;

	$: data = {
		labels,
		datasets: [
			{
				label: 'Orders',
				data: orderData,
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1
			},
			{
				label: 'Shipments',
				data: shipmentData,
				fill: false,
				borderColor: 'rgb(192, 75, 75)',
				tension: 0.1
			},
			{
				label: 'Billing',
				data: billingData,
				fill: false,
				borderColor: 'rgb(128, 64, 192)',
				tension: 0.1
			},
			// {
			// 	label: 'Promotions',
			// 	data: batchData,
			// 	fill: false,
			// 	borderColor: 'rgb(128, 192, 75)',
			// 	tension: 0.1
			// }
		]
	};
	$: config = {
		type: 'line',
		data: data,
		options: {
			borderRadius: '30',
			responsive: true,
			cutout: '95%',
			spacing: 2,
			plugins: {
				legend: {
					position: 'bottom',
					display: true,
					labels: {
						usePointStyle: true,
						padding: 20,
						font: {
							size: 14
						}
					}
				},
				title: {
					display: false,
					text: 'Backlog Pressure'
				}
			}
		}
	};

	onMount(() => {
		const ctx = container.getContext('2d');
		chart = new Chart(ctx, config);
	});

	$: addData(labels);

	$: {
		if (refresh) {
			chart.destroy();
			const ctx = container.getContext('2d');
			chart = new Chart(ctx, config);
		}
	}

	function addData(labels) {
		if (chart) {
			chart.data.labels = labels;
			chart.data.datasets.forEach((dataset) => {
				if (dataset.label === 'Orders') {
					dataset.data = orderData;
				} else if (dataset.label === 'Shipments') {
					dataset.data = shipmentData;
				} else if (dataset.label === 'Billing') {
					dataset.data = billingData;
				} else if (dataset.label === 'Promotions') {
					dataset.data = batchData;
				}
			});
			chart.update();
		}
	}
</script>

<canvas bind:this={container} />
