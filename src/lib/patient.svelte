<script lang="ts">
  import type { Patient } from './utils';

  export let patient: Patient;
</script>

<div>
  <div class="flex gap-2">
    <p class="font-bold">first_name:</p>
    <p>{patient.first_name}</p>
  </div>
  <div class="flex gap-2">
    <p class="font-bold">last_name:</p>
    <p>{patient.last_name}</p>
  </div>
  <div class="flex gap-2">
    <p class="font-bold">father_name:</p>
    <p>{patient.father_name}</p>
  </div>
  <div class="flex gap-2">
    <p class="font-bold">sex:</p>
    <p>{patient.sex}</p>
  </div>
</div>
