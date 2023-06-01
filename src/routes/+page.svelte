<script lang="ts">
  import createPanZoom, { type PanZoom } from 'panzoom';
  import { onMount } from 'svelte';
  import { Tabs, Tab, TabContent, Dropdown } from 'carbon-components-svelte';
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

  $: {preview_patient = patients[selected_patient_idx];}
  const scan = () => {
    patient = preview_patient;
  };
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
        {#if preview_patient}
          <PatientComponent patient={preview_patient} />
          <Button on:click={scan}>scan</Button>
        {/if}
      </Tile>
    </Column>

    <Column sm={4} md={5} lg={12}>
      {#if patient}
      <div class="flex gap-10">
        
        <Tomograph />
        <Volumetric />
      </div>
      {/if}
    </Column>
  </Row>
</Grid>
