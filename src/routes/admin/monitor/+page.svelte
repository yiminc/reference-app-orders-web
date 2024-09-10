<script lang="ts">
	import Chart from '$lib/components/chart.svelte';
import { onDestroy, onMount } from 'svelte';

  let data;
  let fetchInterval: NodeJS.Timeout;

  let labels: string[] = [];
  let orderData: number[] = [];
  let shipmentData: number[] = [];
  let billingData: number[] = [];

  const getTaskQueueStats = async () => {
    const res = await fetch('/api/monitor')
    data = await res.json()
    console.log(data)
    labels = [...labels, new Date().toLocaleTimeString()]
    orderData = [...orderData, Math.floor(Math.random() * 100)]
    shipmentData = [...shipmentData, Math.floor(Math.random() * 200)]
    billingData = [...billingData, Math.floor(Math.random() * 40)]
  }

  onMount(async () => {
    getTaskQueueStats();
    fetchInterval = setInterval(() => {
      getTaskQueueStats();
    }, 1000)
  })

  onDestroy(() => {
    clearInterval(fetchInterval)
  })
</script>

<div class="flex flex-col gap-4 items-center justify-start">
  <div class="flex justify-between w-full items-center">
    <h1>Backlog Size</h1>
    <a href="/admin">Back to Store Manager</a>
  </div>
	<div class="flex flex-col gap-2 w-full">
		<div class="w-full p-4 flex flex-col gap-4 bg-white border border-black rounded">
      <div class="w-full h-[600px]">
        <Chart {labels} {orderData} {shipmentData} {billingData} />
      </div>
		</div>
	</div>
</div>
