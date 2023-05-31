<script lang="ts">
  import { onMount } from 'svelte';

  onMount(async () => {
    await import('./cor');
  });
</script>

{@html `
  <div id="demo-title-container">
      <h1 id="demo-title">
        <!-- Insert demo title here during demo -->
      </h1>
    </div>
    <div id="demo-description-container">
      <p id="demo-description">
        <!-- Insert demo title here during demo -->
      </p>
    </div>
    <div id="demo-toolbar">
      <!-- Insert buttons/dropdowns/etc here during demo -->
    </div>
    <div id="content"></div>
`}
