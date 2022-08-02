<template>
  <div>
    <div class="d-flex align-center mb-7">
      <v-icon @click="$router.push('/')" class="text--default mr-3 mt-n1"
        >mdi-chevron-left</v-icon
      >
      <h1 class="font-weight-bold text--enlarged">Список кружков</h1>
    </div>
    <v-row class="justify-space-between">
      <v-col v-for="setting in namedSettings" :key="setting.id" cols="4">
        <nuxt-link
          :to="`/settings/${setting.id}`"
          class="settings-item d-flex flex-column justify-center align-center rounded-lg elevation-2 cursor--pointer text-decoration-none"
        >
          <img
            :src="sectionIcons[setting.type]"
            :alt="settings.name"
            class="settings-item__img mb-5"
          />
          <span class="settings-item__title font-weight-medium">{{
            setting.name
          }}</span>
        </nuxt-link>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import manuals from '@/mixins/manuals'

export default {
  name: 'SettingsPage',
  mixins: [manuals],
  data() {
    return {
      sectionIcons: {
        kubz: require('@/assets/images/sections/kubz.png'),
        pony_club: require('@/assets/images/sections/pony_club.png'),
        kraski_mira: require('@/assets/images/sections/kraski_mira.png'),
      },
      settings: [],
    }
  },
  head() {
    return { title: 'Настройки' }
  },
  mounted() {
    this.getSections()
    this.getList()
  },
  computed: {
    namedSettings() {
      return this.settings.map((setting) => ({
        ...setting,
        name:
          this.sections.find((section) => section.id === setting.type)?.name ??
          '',
      }))
    },
  },
  methods: {
    async getList() {
      try {
        const { data } = await this.$api.settings.getList()
        this.settings = data.models
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.settings-item {
  flex: calc((100% - 16px * 2) / 3) 0 0;
  min-height: 180px;
  background: #f4f5f8;
  transition: 0.3s;

  &__img {
    transition: 0.3s;
  }

  &__title {
    color: $text-color;
    transition: 0.3s;
  }

  &:hover {
    background: $button-color-primary;
    color: #fff;

    .settings-item__img {
      filter: invert(100%);
    }

    .settings-item__title {
      color: #fff;
    }
  }
}
</style>
