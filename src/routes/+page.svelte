<script lang="ts">
  import createPanZoom, { type PanZoom } from 'panzoom';
  import { onMount } from 'svelte';
  import { Tabs, Tab, TabContent, Dropdown, FileUploaderButton } from 'carbon-components-svelte';
  import { Grid, Row, Column } from 'carbon-components-svelte';
  import { Tile } from 'carbon-components-svelte';

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

  const patients = patients_example;
  let selected_patient_idx = 0;
  let selected_tab = 0;

  let preview_patient: Patient | null = null;
  let patient: Patient | null = null;

  $: {
    preview_patient = patients[selected_patient_idx];
    image_ids = [];
  }
  const scan = async (file: File) => {
    const { preloadImage, stackImageIds, volumeImageIds } = await import('$lib/cor');

    patient = preview_patient;
    // const t = [, stackImageIds, volumeImageIds];
    image_ids = await preloadImage(file)
  };

  let image_ids: string[] | null = null;
  // let files: File[];
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
          <Button
            on:click={async () => {
              if (!preview_patient) return;
              const response = await fetch(preview_patient.url);
              let data = await response.blob();
              let metadata = {
                type: 'image/jpeg'
              };
              let file = new File([data], preview_patient.url);
              scan(file);
            }}>Scan</Button
          >
          <!-- <FileUploaderButton
            on:change={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const files = e.detail;
              const file = files[0];
              scan(file);
            }}
            labelText="scan"
          /> -->
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
