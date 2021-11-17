<template>
  <VAppBar class="flex-grow-0 white pl-2 pr-2">
    <nav class="nav_wr d-flex justify-center align-center flex-grow-1"
         :class="{'justify-space-between': isAuthenticated}">
      <div class="d-flex align-center">
        <RouterLink :to="{name: 'HomePage'}"
                    class="d-inline-flex ml-0">
          <img alt="Vue logo"
               src="@/images/logo.svg"/>
        </RouterLink>
      </div>
      <ul v-if="isAuthenticated"
          class="d-flex align-center">
        <template>
          <li>
            <RouterLink :to="{name: 'DashboardPage'}">
              {{ $t('TheHeader.panel') }}
            </RouterLink>
          </li>
          <li>
            <VBtn :to="{name: 'PollCreatePage'}"
                  icon
                  class="blue--text text--darken-1 ml-3"
                  plain>
              <VIcon>mdi-plus-circle</VIcon>
            </VBtn>
          </li>
          <li>
            <VMenu>
              <template v-slot:activator="{ on, attrs }">
                <VBtn
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  class="account_btn grey--text text--darken-3 text-lowercase">
                  <VIcon>
                    mdi-account-circle
                  </VIcon>
                  {{ me.email }}
                  <VIcon>
                    mdi-menu-down
                  </VIcon>
                </VBtn>
              </template>
              <VList>
                <VListItem>
                  <VBtn :to="{ name: 'DashboardPage', query: { tab: 'polls' } }"
                        class="black--text"
                        plain>
                    {{ $t('TheHeader.myVoting') }}
                  </VBtn>
                </VListItem>
                <VListItem>
                  <VBtn :to="{ name: 'DashboardPage', query: { tab: 'emails-lists' } }"
                        class="black--text"
                        plain>
                    {{ $t('TheHeader.lists') }}
                  </VBtn>
                </VListItem>
                <VListItem>
                  <VBtn @click="logout"
                        class="black--text"
                        plain>
                    {{ $t('Common.logout') }}
                  </VBtn>
                </VListItem>
              </VList>
            </VMenu>
          </li>
        </template>
      </ul>
    </nav>
  </VAppBar>
</template>

<script>
/**
 * The mapState helper
 * @see https://vuex.vuejs.org/guide/state.html#the-mapstate-helper
 */
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'TheHeader',

  /**
   * The components that the component can use.
   * @see https://vuejs.org/v2/guide/components-registration.html
   */
  components: {},

  /**
   * Computed Properties
   * @see https://vuejs.org/v2/guide/computed.html#Computed-Properties
   */
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/authenticated',
    }),

    ...mapState({
      me(state) {
        return state.auth.me;
      },
    }),
  },

  /**
   * The methods the component can use.
   * @see https://vuejs.org/v2/api/#methods
   */
  methods: {
    login() {
      this.$router.push({ name: 'LoginPage' });
    },

    async logout() {
      await this.$store.dispatch('auth/logout');
      await this.$router.push({ name: 'LoginPage' });
    },
  },
};
</script>

<style lang="scss" scoped>
.account_btn {
  border-color: #E9E9E9;
}

.nav_wr {
  a {
    color: $black-c;
    font-weight: 500;
  }
}
</style>
