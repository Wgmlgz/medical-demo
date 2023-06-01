<script lang="ts">
  import type { Patient } from './utils';

  export let patient: Patient;
</script>

<div>
  <div class="flex gap-2">
    <p class="font-bold">first name:</p>
    <p>{patient.first_name}</p>
  </div>
  <div class="flex gap-2">
    <p class="font-bold">last name:</p>
    <p>{patient.last_name}</p>
  </div>
  <div class="flex gap-2">
    <p class="font-bold">father name:</p>
    <p>{patient.father_name}</p>
  </div>
  <div class="flex gap-2">
    <p class="font-bold">sex:</p>
    <p>{patient.sex}</p>
  </div>
  <div class="flex gap-2">
    <p class="font-bold">birth date:</p>
    <p>{patient.birth_date.toDateString()}</p>
  </div>




  <div class="flex gap-2">
    <p class="font-bold">insurance:</p>
    <p>{patient.insurance}</p>
  </div>
  <div class="flex gap-2">
    <p class="font-bold">country:</p>
    <p>{patient.country}</p>
  </div>
  <div class="flex gap-2">
    <p class="font-bold">city:</p>
    <p>{patient.city}</p>
  </div>
  <div class="flex gap-2">
    <p class="font-bold">street:</p>
    <p>{patient.street}</p>
  </div>
  <div class="flex gap-2">
    <p class="font-bold">building:</p>
    <p>{patient.building}</p>
  </div>
</div>
