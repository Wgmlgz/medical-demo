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
  import { patients_example } from '$lib/utils';
  import Patient from '$lib/patient.svelte';
  import Volumetric from '$lib/volumetric.svelte';
  import Tomograph from '$lib/tomograph.svelte';

  const patients = patients_example;
  let selected_patient_idx = 0;
</script>

<Grid>
  <Row>
    <Column>
      <Tile>
        <h1>Patients1</h1>
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
        <Patient patient={patients[selected_patient_idx]} />
        <Button>scan</Button>
      </Tile>
    </Column>

    <Column sm={4} md={5} lg={12}>
      <Tabs>
        <Tab label="Tomographic scan" />
        <Tab label="Volume Renderer" />
        <svelte:fragment slot="content">
          <TabContent>
            <Tomograph />
          </TabContent>
          <TabContent class="border-white border-2 border-solid ">
            <Volumetric />
          </TabContent>
        </svelte:fragment>
      </Tabs>
    </Column>
  </Row>
</Grid>
