<script lang="ts">
  import { onMount } from 'svelte';
  import { makeId } from './utils';
  import { Button, Tile } from 'carbon-components-svelte';
  import Maximize from 'carbon-icons-svelte/lib/Maximize.svelte';
  import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte';
  import screenfull from 'screenfull';
  import type { createStack } from './cor';
  import type { Types } from '@cornerstonejs/core';
  let content: HTMLDivElement;
  let element: HTMLElement;

  export let image_ids: string[];

  let cur_img = 0;
  let total = 0;
  $: total = image_ids.length;
  let stack: Awaited<ReturnType<typeof createStack>> | null = null;
  let w: number, h: number;
  $: if (w && h) stack?.fixSize();

  let ww = 1;
  let wl = 0;

  onMount(async () => {
    console.log('abobus?');
    const { createStack } = await import('./cor');
    stack = await createStack(makeId(10), content, image_ids, (n) => (cur_img = n));
    stack.viewport.element.addEventListener(stack.Events.IMAGE_RENDERED, ((
      evt: Types.EventTypes.ImageRenderedEvent
    ) => {
      const range = stack?.viewport.getProperties().voiRange;
      if (!range) return;
      const { lower, upper } = range;
      wl = (lower + upper) / 2;
      ww = Math.abs(upper - lower);
    }) as EventListener);
  });

  let icon = Maximize;
</script>

<div
  bind:this={element}
  class="w-full h-full flex flex-col relative"
  on:resize={stack?.fixSize}
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
    <p>WL: {wl} WW: {ww}</p>
    <p>Image {cur_img}/{total}</p>
    <p>Right Click: Zoom</p>
    <p>Mouse Wheel: Stack Scroll</p>
    <div class="flex gap-2 item" />
  </div>
</div>
