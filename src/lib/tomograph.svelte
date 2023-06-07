<script lang="ts">
  import { onMount } from 'svelte';
  import { makeId } from './utils';
  import { Button, Tile } from 'carbon-components-svelte';
  import Maximize from 'carbon-icons-svelte/lib/Maximize.svelte';
  import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte';
  import screenfull from 'screenfull';

  let content: HTMLDivElement;
  let element: HTMLElement;

  export let image_ids: string[];
  let loadFile: (file: File) => Promise<void>;

  let fixSize: () => void = () => {};
  let w: number, h: number;
  $: if (w && h) fixSize();
  onMount(async () => {
    console.log('abobus?');
    const t = await import('./cor');
    const { createStack } = t;
    ({ loadFile, fixSize } = await createStack(makeId(10), content, image_ids));
    // loadFile = loadFile
  });

  let icon = Maximize;
</script>

<div
  bind:this={element}
  class="w-full h-full flex flex-col relative"
  on:resize={fixSize}
  bind:clientWidth={w}
  bind:clientHeight={h}
>
  <Tile class="w-full">
    <div class="flex w-full gap-2 items-end">
      <Button
        style="margin-left: auto"
        kind="secondary"
        {icon}
        iconDescription="Toggle fullscreen"
        on:click={async () => {
          await screenfull.toggle(element);
          icon = screenfull.isFullscreen ? Minimize : Maximize;
        }}
      />
    </div>
  </Tile>

  <div
    class="grow h-full"
    bind:this={content}
    id="cornerstone-element"
    on:contextmenu|preventDefault={() => {}}
  />

  <div class="absolute bottom-10px left-10px flex gap-2 flex-col">
    <p>Left Click: Pan</p>
    <p>Right Click: Zoom</p>
    <p>Mouse Wheel: Stack Scroll</p>
    <div class="flex gap-2 item" />
  </div>
</div>
