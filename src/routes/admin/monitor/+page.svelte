<script lang="ts">
	import { goto } from '$app/navigation';
	import Chart from '$lib/components/chart.svelte';
  import { onDestroy, onMount } from 'svelte';

// {
//   "": {
//       "typesInfo": {
//           "1": {
//               "stats": {
//                   "approximateBacklogCount": "333",
//                   "approximateBacklogAge": "8.622962s",
//                   "tasksAddRate": 12.1273775,
//                   "tasksDispatchRate": 2.1573753
//               }
//           },
//           "2": {
//               "stats": {
//                   "approximateBacklogCount": "2",
//                   "approximateBacklogAge": "0.053375s",
//                   "tasksAddRate": 3.9377244,
//                   "tasksDispatchRate": 3.8986037
//               }
//           }
//       }
//   }
// }

  let fetchInterval: NodeJS.Timeout;
  let labels: string[] = [];
  let orderData: number[] = [];
  let shipmentData: number[] = [];
  let billingData: number[] = [];

  const getStatCount = (stat: any, type = '1'): number => {
    const statCount = stat.versionsInfo?.['']?.typesInfo?.[type]?.stats?.approximateBacklogCount || '0';
    return parseInt(statCount);
  }

  const saveToLocalStorage = (labels: string[], orderData: number[], shipmentData: number[], billingData: number[]) => {
    localStorage.setItem('labels', JSON.stringify(labels))
    localStorage.setItem('orderData', JSON.stringify(orderData))
    localStorage.setItem('shipmentData', JSON.stringify(shipmentData))
    localStorage.setItem('billingData', JSON.stringify(billingData))
  }

  const readFromLocalStorage = () => {
    labels = JSON.parse(localStorage.getItem('labels') || '[]')
    orderData = JSON.parse(localStorage.getItem('orderData') || '[]')
    shipmentData = JSON.parse(localStorage.getItem('shipmentData') || '[]')
    billingData = JSON.parse(localStorage.getItem('billingData') || '[]')
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('labels')
    localStorage.removeItem('orderData')
    localStorage.removeItem('shipmentData')
    localStorage.removeItem('billingData')
  }

  const parseTaskQueueInfo = (stats: any) => {
    if (stats) {
      labels = [...labels, new Date().toLocaleTimeString()]
      const { taskQueues } = stats;
      taskQueues.forEach((stat: any) => {
        if (stat.taskQueue === 'orders') {
          orderData = [...orderData, getStatCount(stat)]
        } else if (stat.taskQueue === 'shipments') {
          shipmentData = [...shipmentData, getStatCount(stat)]
        } else if (stat.taskQueue === 'billing') {
          billingData = [...billingData, getStatCount(stat)]
        }
      })

      saveToLocalStorage(labels, orderData, shipmentData, billingData)
    }
  }

  const getTaskQueueStats = async () => {
    const res = await fetch('/api/monitor')
    const stats = await res.json()
    parseTaskQueueInfo(stats)
  }

  onMount(async () => {
    readFromLocalStorage();
  })

  onDestroy(() => {
    clearInterval(fetchInterval)
  })

  const onStartMonitoring = () => {
    getTaskQueueStats();
    fetchInterval = setInterval(() => {
      getTaskQueueStats();
    }, 1000)
  }

  const onStopMonitoring = () => {
    clearInterval(fetchInterval);
  }

  const onClearMonitoring = () => {
    clearInterval(fetchInterval);
    clearLocalStorage();
    window.location.reload();
  }
</script>

<div class="flex flex-col gap-4 items-center justify-start">
  <div class="flex flex-col md:flex-row justify-between w-full items-center">
    <h1>Backlog Size</h1>
    <div class="flex gap-4 items-center">
      <a href="/admin">Back to Store Manager</a>
      <button on:click={onStartMonitoring} class="w-auto" disabled={!!fetchInterval}>Start</button>
      <button on:click={onStopMonitoring} class="w-auto" disabled={!fetchInterval}>Stop</button>
      <button on:click={onClearMonitoring} class="w-auto">Clear</button>
    </div>
  </div>
	<div class="flex flex-col gap-2 w-full">
		<div class="w-full p-4 flex flex-col gap-4 bg-white border border-black rounded">
      <div class="w-full h-[600px]">
        <Chart {labels} {orderData} {shipmentData} {billingData} />
      </div>
		</div>
	</div>
</div>
