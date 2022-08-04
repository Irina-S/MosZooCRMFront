<template>
  <ModalWrapper
    ref="wrapper"
    :size="$vuetify.breakpoint.xs ? 'fullscreen' : 'normal'"
    v-on="$listeners"
  >
    <template>
      <div class="modal-header align-self-stretch mb-6">
        <h2 class="modal-title text--normal">Фильтры</h2>
      </div>
      <div class="modal-content flex-grow-1 align-self-stretch">
        <div class="mb-4">
          <div class="text--small mb-1">Тип кружка</div>
          <div>
            <v-checkbox
              v-for="type in options.types"
              :key="type.id"
              v-model="typeFilter"
              :label="type.name"
              :value="type"
              hide-details
              class="mt-0"
            >
              <template #label>
                <span class="text--small text--default">{{ type.name }}</span>
              </template>
            </v-checkbox>
          </div>
        </div>
        <div>
          <div class="text--small mb-1">Статус</div>
          <v-combobox
            v-model="statusFilter"
            :items="options.statuses"
            item-text="name"
            placeholder="Выберите"
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
                <v-icon small @click="parent.selectItem(item)"
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
  props: {
    filters: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  components: { CustomChip },
  data() {
    return {
      StatusColor,
      statusFilter: [],
      typeFilter: [],
    }
  },
  methods: {
    clear() {
      this.statusFilter = []
      this.typeFilter = []
    },
    save() {
      this.$attrs.resolve({
        statusFilter: this.statusFilter,
        typeFilter: this.typeFilter,
      })
      this.$refs.wrapper.close()
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
</style>
