<script lang="ts">
  import { onMount } from 'svelte';

  let content: HTMLDivElement;
  onMount(async () => {
    const t = await import('./cor');
    const { create } = t;
    create(content);
  });
</script>

<div
  class="h-500px w-500px"
  bind:this={content}
  id="cornerstone-element"
  on:contextmenu|preventDefault={() => {}}
/>
<p>Left Click: Pan</p>
<p>Right Click: Zoom</p>
<p>Mouse Wheel: Stack Scroll</p>
