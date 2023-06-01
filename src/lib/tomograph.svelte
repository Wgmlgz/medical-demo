<script lang="ts">
  import { onMount } from 'svelte';
  import { makeId } from './utils';

  let content: HTMLDivElement;
  onMount(async () => {
    console.log('abobus?');
    const t = await import('./cor');
    const { create } = t;
    create(makeId(10), content);
  });
</script>

<div>
  <div
    class="h-500px w-500px"
    bind:this={content}
    id="cornerstone-element"
    on:contextmenu|preventDefault={() => {}}
  />
  <p>Left Click: Pan</p>
  <p>Right Click: Zoom</p>
  <p>Mouse Wheel: Stack Scroll</p>
</div>
