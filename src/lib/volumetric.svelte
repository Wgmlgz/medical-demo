<script lang="ts">
  import { Button, Dropdown, Tile } from 'carbon-components-svelte';
  import type { DropdownItem } from 'carbon-components-svelte/types/Dropdown/Dropdown.svelte';
  import screenfull from 'screenfull';
  import Maximize from 'carbon-icons-svelte/lib/Maximize.svelte';
  import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte';
  import { onMount } from 'svelte';
  import { makeId } from './utils';
  import type { onWindowFn } from './sus_tool';
  import { Scatter } from 'svelte-chartjs';
  import annotationPlugin from 'chartjs-plugin-annotation';
  import _ from 'lodash';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale
  } from 'chart.js';

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    annotationPlugin
  );

  const data = {
    datasets: [
      {
        label: 'Dataset 1',
        data: [],
        borderColor: '#fff',
        backgroundColor: '#fff',
        showLine: true,
        pointRadius: 0
      }
    ]
  };
  let wl = 0;

  export let image_ids: string[];

  let selected_patient_idx = 0;

  let content: HTMLDivElement;
  let options: DropdownItem[] = [
    {
      id: 0,
      text: 'CT-AAA'
    }
  ];
  let selectPreset: (presetName: string) => void;
  let loadFile: (files: readonly File[]) => Promise<void>;
  let fixSize: () => void = () => {};
  let element: HTMLElement;
  let info: string = '';
  const onWindow: onWindowFn = (cur_wl, scale, arr) => {
    wl = cur_wl;
    const chunks = _.chunk(arr, 2);
    info = `WL: ${Math.round(wl)} scale:${Math.round(scale * 100) / 100}`;
    data.datasets[0].data = chunks;
  };
  let w: number, h: number;
  $: if (w && h) fixSize();
  onMount(async () => {
    const t = await import('./cor');
    const { createVolume } = t;
    ({ options, selectPreset, loadFile, fixSize } = await createVolume(
      makeId(10),
      content,
      image_ids,
      onWindow
    ));
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
      <Dropdown
        class="grow"
        titleText="Preset"
        on:select={(e) => selectPreset(e.detail.selectedItem.text)}
        bind:selectedId={selected_patient_idx}
        items={options}
      />
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
  <div class="grow h-full" bind:this={content} on:contextmenu|preventDefault={() => {}} />

  <div class="absolute bottom-10px left-10px flflex gap-2 flex-col">
    <pre>{info}</pre>
    <p>Click the image to rotate it.</p>
    <p>Middle Click: adjust window</p>
    <p>Right Click: Zoom</p>
    <div class="flex gap-2 item" />
  </div>

  <div class="absolute bottom-10px right-10px flex gap-2">
    <Scatter
      {data}
      height="100px"
      width="200px"
      options={{
        responsive: false,
        animation: {
          duration: 0
        },
        scales: {
          x: {
            min: -1000,
            max: 1000,
            ticks: {
              color: '#fff'
            },
            grid: {
              display: false
            }
          },
          y: {
            min: 0,
            max: 1,
            ticks: {
              color: '#fff'
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          annotation: {
            annotations: {
              box1: {
                type: 'line',
                xMin: wl,
                xMax: wl,
                yMin: 0,
                yMax: 1,
                borderWidth: 3,
                borderColor: '#0353e9'
              }
            }
          }
        }
      }}
    />
  </div>
</div>
