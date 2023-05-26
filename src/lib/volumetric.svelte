<script lang="ts">
  import { onMount } from 'svelte';

  let w: number;
  let h: number;
  let resize: (x: number, y: number) => void = () => {};
  let canvas: HTMLCanvasElement;
  let gui_container: HTMLElement;

  $: resize(w, h);
  onMount(async () => {
    const { init } = await import('./tree');
    const { onResize } = await init(canvas, gui_container);
    resize = onResize;
  });
</script>

<div class="relative aspect-ratio-1/1">
  <div
    bind:clientWidth={w}
    bind:clientHeight={h}
    class="w-full h-full"
    on:resize={(e) => {
      console.log(e);
    }}
  >
    <canvas bind:this={canvas} width="100" height="100" />
  </div>
<div class="absolute top-0 right-0" bind:this={gui_container} />

</div>

