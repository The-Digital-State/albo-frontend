<template>
  <VApp>
    <TheHeader/>
    <VMain>
      <VContainer fill-width fluid pa-0 ma-0
                  class="main_wr d-flex">
        <RouterView/>
      </VContainer>
    </VMain>
    <TheFooter/>
  </VApp>
</template>

<script>

// Components
import TheHeader from '@/views/components/TheHeader';
import TheFooter from '@/views/components/TheFooter';

export default {
  /**
   * The name of the loaded component.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'App',

  /**
   * The components that the component can use.
   * @see https://vuejs.org/v2/guide/components-registration.html
   */
  components: {
    TheFooter,
    TheHeader,
  },
};
</script>
