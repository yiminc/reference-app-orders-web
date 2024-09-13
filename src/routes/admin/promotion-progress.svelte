<script lang="ts">
	// import { onDestroy, onMount } from 'svelte';

  export let promotion: [string, number];
</script>

<div class="flex items-center justify-between w-full">
  <h3 class="text-xl font-bold">{promotion[0]}</h3>
  <p>{promotion[1]}</p>
</div>
