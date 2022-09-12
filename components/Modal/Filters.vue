<template>
  <ModalWrapper
    ref="wrapper"
    :size="$vuetify.breakpoint.xs ? 'fullscreen' : 'normal'"
    v-on="$listeners"
  >
    <template #default>
      <div class="modal-header align-self-stretch mb-6">
        <h2 class="modal-title text--normal">Фильтры</h2>
      </div>
      <div
        class="modal-content flex-grow-1 align-self-stretch pr-2 scroll-container"
      >
        <div class="mb-4">
          <div class="text--small mb-1">Тип кружка</div>
          <div class="d-flex flex-column align-start">
            <v-checkbox
              v-for="t in options.types"
              :key="t.id"
              v-model="type"
              :label="t.name"
              :value="t"
              hide-details
              class="mt-0"
            >
              <template #label>
                <span class="text--small text--default">{{ t.name }}</span>
              </template>
            </v-checkbox>
          </div>
        </div>
        <div v-scroll-to-top-on-focus>
          <div class="text--small mb-1">Статус</div>
          <v-combobox
            ref="statusFilter"
            v-model="status"
            :items="options.statuses"
            attach="#status-filter-menu"
            item-text="name"
            placeholder="Выберите"
            clearable
            persistent-placeholder
            multiple
            small-chips
            outlined
            hide-details
            dense
          >
            <template #selection="{ item, parent }">
              <CustomChip
                class="text--default mt-1 mb-1"
                :color="StatusColor[item.id.toUpperCase()]"
                small
              >
                <span class="mr-2">{{ item.name }}</span>
                <v-icon small @click.stop="parent.selectItem(item)"
                  >mdi-close</v-icon
                >
              </CustomChip>
            </template>
            <template #item="{ item }">
              <v-badge
                :color="StatusColor[item.id.toUpperCase()]"
                inline
                class="mr-1"
              ></v-badge>
              <span class="text--small">{{ item.name }}</span>
              <v-icon
                v-if="statusFilter.includes(item)"
                class="ml-auto"
                color="success"
              >
                mdi-check
              </v-icon>
            </template>
          </v-combobox>
          <div id="status-filter-menu" class="status-filter__menu"></div>
        </div>
      </div>
      <div class="modal-footer align-self-stretch d-flex mt-7">
        <v-btn small class="flex-grow-1" @click="clear"> Очистить все </v-btn>
        <v-btn
          small
          color="primary"
          class="flex-grow-1 ml-3 ml-sm-7"
          @click="save"
        >
          Сохранить
        </v-btn>
      </div>
    </template>
  </ModalWrapper>
</template>

<script>
import { StatusColor } from '@/constants/Status'
import CustomChip from '@/components/FormElements/CustomChip'

export default {
  name: 'ModalFilters',
  components: { CustomChip },
  directives: {
    'scroll-to-top-on-focus': {
      inserted(el) {
        el.querySelector('input').addEventListener('focus', () => {
          const scrollContainer = el.closest('.scroll-container')
          const { y: verticalOffset } = el.getBoundingClientRect()
          setTimeout(() => {
            scrollContainer.scrollTo({
              top: verticalOffset - 90,
              left: 0,
              behavior: 'smooth',
            })
          }, 500)
        })
      },
    },
  },
  props: {
    filter: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      StatusColor,
      statusFilter: [],
      typeFilter: [],
    }
  },
  mounted() {
    this.status = this.filter.status
    this.type = this.filter.type
  },
  methods: {
    clear() {
      this.status = []
      this.type = []
    },
    save() {
      this.$attrs.resolve({
        status: this.status,
        type: this.type,
      })
      this.$refs.wrapper.close()
    },
    onAppendClick(evt) {
      this.$refs.statusFilter.$refs.input.blur()
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  .v-autocomplete:not(.v-input--is-focused).v-select--chips input {
    max-height: unset !important;
  }
}

.status-filter {
  &__menu {
    ::v-deep {
      .v-menu__content {
        position: static !important;
        max-width: unset !important;
        min-width: unset !important;
        width: 100%;
      }
    }
  }
}
</style>
