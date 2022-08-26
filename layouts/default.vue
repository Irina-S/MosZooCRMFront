<template>
  <v-app>
    <v-app-bar class="header flex-grow-0 px-3 px-sm-10 mb-3">
      <img
        src="~/assets/images/atom-logo.png"
        alt="лого"
        class="logo cursor--pointer"
        @click="$router.push('/')"
      />
      <div class="d-flex flex-column align-end mr-4 ml-auto">
        <span v-if="name" class="text--small font-weight-medium">{{
          name
        }}</span>
        <span v-if="role" class="text--x-small text--light">{{
          RoleTitle[role.toUpperCase()]
        }}</span>
      </div>
      <v-menu :offset-y="true" bottom left content-class="user-menu">
        <template #activator="{ attrs, on }">
          <v-avatar
            v-if="name"
            v-bind="attrs"
            color="primary"
            :size="$vuetify.breakpoint.xs ? 24 : 40"
            class="avatar cursor--pointer"
            v-on="on"
            >{{ name[0].toUpperCase() }}</v-avatar
          >
        </template>
        <v-list>
          <v-list-item v-if="isAdmin" to="/settings">
            <v-list-item-icon class="mr-2">
              <img src="@/assets/images/setting-icon.svg" alt="настройки" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Настройки</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="$route.name === 'applications'"
            @click="triggerListExport"
          >
            <v-list-item-icon class="mr-2">
              <v-icon class="logout-icon text--default"
                >mdi-microsoft-excel</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Экспорт</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-icon class="mr-2"
              ><v-icon class="logout-icon text--default"
                >mdi-logout-variant</v-icon
              ></v-list-item-icon
            >
            <v-list-item-content>
              <v-list-item-title>Выход</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <div class="flex-grow-1 px-3 px-sm-10">
      <Nuxt ref="page" />
    </div>
    <Modal></Modal>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { RoleTitle } from '@/constants/Roles'
import roles from '@/mixins/roles'

export default {
  name: 'DefaultLayout',
  mixins: [roles],
  data() {
    return {
      RoleTitle,
    }
  },
  computed: {
    ...mapGetters('user', ['name', 'role']),
  },
  mounted() {
    console.log(this.$refs)
  },
  methods: {
    logout() {
      this.$auth.logout()
    },
    triggerListExport() {
      this.$refs.page.$children[0].exportList()
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  height: 80px;
  background: none !important;
  box-shadow: none !important;

  ::v-deep {
    .v-toolbar__content {
      padding: 0 !important;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.avatar {
  color: #fff;
  box-shadow: 0 4px 4px rgba(191, 184, 206, 0.5),
    2px 2px 15px rgba(191, 184, 206, 0.5);
}

.user-menu {
  box-shadow: 0 4px 4px rgba(191, 184, 206, 0.5),
    2px 2px 15px rgba(191, 184, 206, 0.5) !important;

  ::v-deep {
    .v-list-item--active::before {
      opacity: 0;
    }

    .v-list-item--active:hover::before {
      opacity: 0.04;
    }
  }
}

.logout-icon {
  transform: scaleX(-1);
}

@media (max-width: map-get($grid-breakpoints, 'sm')) {
  .header {
    height: 50px;
    background: none !important;
    box-shadow: none !important;
  }

  .logo {
    width: 70px;
  }
}
</style>
