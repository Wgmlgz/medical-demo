<script lang="ts">
  import 'uno.css';
  // import 'virtual:unocss-devtools'
  import 'carbon-components-svelte/css/g90.css';

  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    SkipToContent,
    Content
  } from 'carbon-components-svelte';

  let isSideNavOpen = false;
</script>

<Header company="PAWLIN" platformName="Medical demo" bind:isSideNavOpen>
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>
  <HeaderNav>
    <HeaderNavItem href="/" text="Link 1" />
    <HeaderNavItem href="/" text="Link 2" />
    <HeaderNavItem href="/" text="Link 3" />
    <HeaderNavMenu text="Menu">
      <HeaderNavItem href="/" text="Link 1" />
      <HeaderNavItem href="/" text="Link 2" />
      <HeaderNavItem href="/" text="Link 3" />
    </HeaderNavMenu>
  </HeaderNav>
</Header>

<Content>
  <slot />
</Content>


<style lang="scss">
  
</style>