<script lang="ts">
  import createPanZoom, { type PanZoom } from 'panzoom';
  import { onMount } from 'svelte';
  import { Tabs, Tab, TabContent, Dropdown, FileUploaderButton } from 'carbon-components-svelte';
  import { Grid, Row, Column } from 'carbon-components-svelte';
  import { Tile } from 'carbon-components-svelte';
  import { ProgressBar } from 'carbon-components-svelte';
  import {
    Form,
    FormGroup,
    Checkbox,
    RadioButtonGroup,
    RadioButton,
    Select,
    SelectItem,
    Button
  } from 'carbon-components-svelte';
  import { patients_example, type Patient } from '$lib/utils';
  import PatientComponent from '$lib/patient.svelte';
  import Volumetric from '$lib/volumetric.svelte';
  import Tomograph from '$lib/tomograph.svelte';
  import axios from 'axios';

  const patients = patients_example;
  let selected_patient_idx = 0;
  let selected_tab = 0;

  let preview_patient: Patient | null = null;
  let patient: Patient | null = null;
  let progress = {
    value: null as number | null,
    status: 'active' as 'active' | 'finished' | 'error',
    helperText: ''
  };

  $: {
    preview_patient = patients[selected_patient_idx];
    image_ids = [];
    progress.value = null;
  }
  const onProgress = (x: number) => (progress.value = x);
  const onError = (s: string) => {
    progress.helperText = s;
    progress.status = 'error';
  };
  const scan: typeof import('$lib/cor')['preloadImage'] = async (files) => {
    const { preloadImage, stackImageIds, volumeImageIds } = await import('$lib/cor');
    try {
      patient = preview_patient;
      image_ids = await preloadImage(files, (x) => onProgress(x * 0.5 + 0.5));
      progress.status = 'finished';
      return image_ids;
    } catch (e: unknown) {
      if (typeof e === 'object' && e) {
        if ('message' in e && typeof e.message === 'string') onError(e.message);
        if ('error' in e && typeof e.error === 'string') onError(e.error);
      }
      return [];
    }
  };

  const scanCur = async () => {
    if (!preview_patient) return;
    progress.helperText = '';
    progress.status = 'active';
    onProgress(0);
    const response = await axios.get(preview_patient.url, {
      responseType: 'blob',
      onDownloadProgress(p) {
        onProgress((p.progress ?? 0) * 0.5);
      }
    });
    const { data } = response;
    onProgress(0.5);
    if (!(data instanceof Blob)) {
      onError('invalid response');
      return;
    }
    // let data = response.;
    let metadata = {
      type: 'image/jpeg'
    };
    let files = [new File([data], preview_patient.url)];
    await scan(files);
  };
  let image_ids: string[] | null = null;

  // onMount(async () => {
  //   scanCur()
  // })
</script>

<Grid>
  <Row>
    <Column>
      <Tile>
        <h1>Patients</h1>
        <Dropdown
          titleText="Select patient"
          bind:selectedId={selected_patient_idx}
          items={patients.map((p, idx) => ({
            id: idx,
            text: `${p.first_name} ${p.last_name} ${p.father_name}`
          }))}
        />
      </Tile>
    </Column>
  </Row>
  <Row class="mt-2">
    <Column sm={4} md={3} lg={4}>
      <Tile>
        {#if preview_patient !== null}
          <PatientComponent patient={preview_patient} />
          <Button on:click={scanCur}>Scan</Button>
          <!-- <FileUploaderButton
            multiple
            on:change={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const files = e.detail;
              const file = files[0];
              await scan(files, (x) => (progress.value = x));
            }}
            labelText="scan"
          /> -->
          {#if progress.value !== null}
            <ProgressBar
              value={progress.value * 100}
              status={progress.status}
              labelText="Load status"
              helperText={progress.helperText || `${Math.floor(progress.value * 100 * 100) / 100}%`}
            />
          {/if}

          <!-- <Button on:click={scan}>scan</Button> -->
        {/if}
      </Tile>
    </Column>

    <Column sm={4} md={5} lg={12}>
      <!-- {#if patient} -->
      <div class="flex gap-10 w-full h-800px">
        {#if image_ids && image_ids.length}
          <Tomograph {image_ids} />
          <Volumetric {image_ids} />
        {/if}
      </div>
      <!-- {/if} -->
    </Column>
  </Row>
</Grid>
