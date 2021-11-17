<template>
  <div>
    <div class="mb-5 mt-10">
      <h1 class="text-h4">Профиль</h1>
    </div>
    <div class="white pa-5">
      <div>
        <VContainer>
          <VRow>
            <VCol cols="8">
              <VTextField
                v-model="email"
                label="email@bebebe@be"
                filled
                append-icon="mdi-lock-outline"
                disabled/>
            </VCol>
            <VCol cols="8">
              <div>
                <p>Вы авторизированы при помощи аккаунта Microsoft</p>
                <VBtn>Выйти</VBtn>
              </div>
            </VCol>
          </VRow>
        </VContainer>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  /**
   * The name of the loaded component.
   * @see https://vuejs.org/v2/api/#name
   */
  name: 'ProfilePage',

  /**
   * The components that the component can use.
   * @see https://vuejs.org/v2/guide/components-registration.html
   */
  components: {},

  /**
   * The data that can be used by the component.
   * @returns {Object} The view-model data.
   */
  data() {
    return {
      email: '',
    };
  },

  /**
   * The methods the page can use.
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {},
};
</script>
