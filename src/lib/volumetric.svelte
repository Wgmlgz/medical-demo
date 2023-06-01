<!-- <script lang="ts">
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
 -->

<script lang="ts">
  import { Dropdown } from 'carbon-components-svelte';
  import type { DropdownItem } from 'carbon-components-svelte/types/Dropdown/Dropdown.svelte';
  import { onMount } from 'svelte';
  let selected_patient_idx = 0;

  let content: HTMLDivElement;
  let items: DropdownItem[] = [
    {
      id: 0,
      text: 'CT-Bone'
    }
  ];
  let onSelect = (selectedItem: CustomEvent<{ selectedId: any; selectedItem: DropdownItem }>) => {};
  onMount(async () => {
    console.log('huh?')
    const t = await import('./cor');
    const { create3d } = t;
    const { options, select } = await create3d(content);

    items = options;
    onSelect = (e) => {
      select(e.detail.selectedItem.text);
    };
  });
</script>

<Dropdown on:select={onSelect} bind:selectedId={selected_patient_idx} {items} />
<div
  class="h-500px w-500px"
  bind:this={content}
  id="viewport-element"
  on:contextmenu|preventDefault={() => {}}
/>
