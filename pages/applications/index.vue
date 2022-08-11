<template>
  <div>
    <h1
      class="mb-3"
      :class="
        !$vuetify.breakpoint.xs
          ? 'font-weight-bold text--enlarged'
          : 'text--normal'
      "
    >
      Список заявок
    </h1>
    <div v-if="$vuetify.breakpoint.xs" class="d-flex justify-end mb-4">
      <span class="text--small cursor--pointer" @click="openMobileFilters"
        >Фильтры<v-icon class="text--default ml-1"
          >mdi-filter-variant</v-icon
        ></span
      >
    </div>
    <v-data-table
      ref="list"
      :headers="applicationTableHeaders"
      :items="applicationTableData"
      :items-per-page="applicationTableOptions.itemsPerPage"
      :must-sort="true"
      :mobile-breakpoint="$vuetify.breakpoint.thresholds.xs"
      :sort-by.sync="applicationTableOptions.sortBy"
      :sort-desc.sync="applicationTableOptions.sortDesc"
      :server-items-length="totalItems"
      hide-default-footer
      class="mb-6"
      :class="
        $vuetify.breakpoint.xs
          ? 'application-table--mobile'
          : 'application-table'
      "
      @update:sort-by="getList"
      @update:sort-desc="getList"
      @click:row="openApplication"
    >
      <template #[`header.type`]="{ header }">
        <span
          v-if="!typeFilterEnabled"
          class="cursor--pointer"
          @click.stop="typeFilterEnabled = !typeFilterEnabled"
          >{{ header.text }}
          <v-icon
            class="text--light"
            :class="typeFilter.length ? 'error--text' : ''"
            small
            >mdi-filter-variant</v-icon
          ></span
        >
        <v-combobox
          v-else
          ref="typeSelect"
          v-model="typeFilter"
          class="table-select"
          :items="sections"
          :autofocus="true"
          item-text="name"
          clearable
          label="Тип кружка"
          :attach="true"
          multiple
          small-chips
          solo
          dense
          @blur="typeFilterEnabled = !typeFilterEnabled"
          @focus="$refs.typeSelect.activateMenu()"
          @change="getList"
        >
          <template #prepend-item>
            <v-list-item @mousedown.prevent @click="selectAllSections">
              <v-icon class="mr-1">
                {{
                  typeFilter && typeFilter.length === sections.length
                    ? 'mdi-checkbox-outline'
                    : 'mdi-checkbox-blank-outline'
                }}
              </v-icon>
              <span class="grey--text text-subtitle-2">Все</span>
            </v-list-item>
          </template>
          <template #selection="{ item, parent }">
            <CustomChip
              class="black--text mt-1 mb-1"
              :color="StatusColor[item.id.toUpperCase()]"
              small
            >
              <span class="mr-2">{{ item.name }}</span>
              <v-icon small @click="parent.selectItem(item)">mdi-close</v-icon>
            </CustomChip>
          </template>
          <template #item="{ item }">
            <v-icon class="mr-0">
              {{
                typeFilter && typeFilter.find((type) => type.id === item.id)
                  ? 'mdi-checkbox-outline'
                  : 'mdi-checkbox-blank-outline'
              }}
            </v-icon>
            <CustomChip class="black--text" color="#F4F5F8" small>{{
              item.name
            }}</CustomChip>
          </template>
        </v-combobox>
      </template>
      <template #[`header.status`]="{ header }">
        <!--        <span @click.stop="statusFilterEnabled = !statusFilterEnabled">-->
        <span
          v-if="!statusFilterEnabled"
          class="cursor--pointer"
          @click.stop="statusFilterEnabled = !statusFilterEnabled"
          >{{ header.text }}
          <v-icon
            class="text--light"
            :class="statusFilter.length ? 'error--text' : ''"
            small
            >mdi-filter-variant</v-icon
          >
        </span>
        <v-combobox
          v-else
          ref="statusSelect"
          v-model="statusFilter"
          class="table-select"
          :items="statuses"
          :autofocus="true"
          label="Статус"
          :attach="true"
          :menu-props="{ bottom: true, offsetY: true }"
          item-text="name"
          clearable
          multiple
          small-chips
          solo
          dense
          @blur="statusFilterEnabled = !statusFilterEnabled"
          @focus="$refs.statusSelect.activateMenu()"
          @change="getList"
          @click.native.stop
          @mousedown.native.stop
        >
          <template #prepend-item>
            <v-list-item @mousedown.prevent @click="selectAllStatuses">
              <v-icon class="mr-1">
                {{
                  statusFilter && statusFilter.length === statuses.length
                    ? 'mdi-checkbox-outline'
                    : 'mdi-checkbox-blank-outline'
                }}
              </v-icon>
              <span class="grey--text text-subtitle-2">Все</span>
            </v-list-item>
          </template>
          <template #selection="{ item, parent }">
            <CustomChip
              class="black--text mt-1 mb-1"
              :color="StatusColor[item.id.toUpperCase()]"
              small
            >
              <span class="mr-2">{{ item.name }}</span>
              <v-icon small @click="parent.selectItem(item)">mdi-close </v-icon>
            </CustomChip>
          </template>
          <template #item="{ item }">
            <v-icon class="mr-0">
              {{
                statusFilter &&
                statusFilter.find((status) => status.id === item.id)
                  ? 'mdi-checkbox-outline'
                  : 'mdi-checkbox-blank-outline'
              }}
            </v-icon>
            <CustomChip
              class="black--text"
              :color="StatusColor[item.id.toUpperCase()]"
              small
              >{{ item.name }}
            </CustomChip>
          </template>
        </v-combobox>
        <!--        </span>-->
      </template>
      <template #[`item.id`]="{ item }">
        <span
          class="font-weight-medium"
          :class="$vuetify.breakpoint.xs ? 'text--light' : ''"
          >{{ item.id }}</span
        >
      </template>
      <template #[`item.type`]="{ item }">
        <span
          class="font-weight-medium"
          :class="$vuetify.breakpoint.xs ? 'font-weight-bold' : ''"
          >{{ item.type_as_string }}</span
        >
      </template>
      <template #[`item.status`]="{ item }">
        <CustomChip
          :color="StatusColor[item.status]"
          small
          class="mb-3 mb-sm-0"
          >{{ item.status_as_string }}</CustomChip
        >
      </template>
      <template #[`item.created_at`]="{ item }">
        <span
          class="font-weight-medium mr-1"
          :class="$vuetify.breakpoint.xs ? 'text--light' : ''"
          >{{ parseDateFromExtended(item.created_at) }}</span
        >
        <span class="font-weight-medium text--light">{{
          parseTimeFromExtended(item.created_at)
        }}</span>
      </template>
      <template #[`item.responsible_name`]="{ item }">
        <template v-if="isAdmin">
          <CustomSelect
            v-if="item.isResponsibleEditing"
            :options="moderators"
            :reduce="(option) => option.id"
            label="name"
            @click.stop
            @cancel="item.isResponsibleEditing = false"
            @input="setResponsible(item, $event)"
          >
            <template #no-options>
              <div class="font-weight-regular text-center py-2">
                Нет результатов
              </div>
            </template>
          </CustomSelect>
          <v-progress-circular
            v-else-if="item.isResponsibleLoading"
            indeterminate
            color="primary"
            size="20"
            width="2"
            class="mx-auto"
          ></v-progress-circular>
          <a
            v-else-if="item.responsible_name"
            class="text-decoration-underline"
            @click.prevent.stop="item.isResponsibleEditing = true"
            >{{ item.responsible_name }}</a
          >
          <v-btn
            v-else
            outlined
            x-small
            @click.stop="item.isResponsibleEditing = true"
            >Назначить</v-btn
          >
        </template>
        <template v-else>
          <div class="font-weight-medium">{{ item.responsible_name }}</div>
        </template>
      </template>
      <template #[`item.client_name`]="{ item }">
        <span class="font-weight-medium truncate-text" style="width: 95%">
          {{ item.client_name }}</span
        >
      </template>
      <template #[`item.comment`]="{ item }">
        <v-text-field
          v-if="item.isCommentEditing"
          v-model="item.commentEditing"
          placeholder="Текст комментария..."
          outlined
          dense
          hide-details
          class="comment-field"
          @click.stop
          @keypress.enter="updateComment(item, item.commentEditing)"
          @keydown.esc="item.isCommentEditing = false"
        ></v-text-field>
        <v-progress-circular
          v-else-if="item.isCommentLoading"
          indeterminate
          color="primary"
          size="20"
          width="2"
          class="mx-auto"
        ></v-progress-circular>
        <div
          v-else
          class="d-flex align-center full-width font-weight-medium"
          style="min-height: 26px"
          @click.stop="editComment(item)"
        >
          {{ item.comment }}
        </div>
      </template>
    </v-data-table>
    <div v-if="totalPages > 1" class="d-flex justify-center align-center mb-10">
      <v-btn
        rounded
        elevation="0"
        class="pg-btn font-weight-reqular mr-6"
        :disabled="applicationTableOptions.page === 1"
        @click="applicationTableOptions.page = 1"
      >
        На первую
      </v-btn>
      <v-pagination
        v-model="applicationTableOptions.page"
        :length="totalPages"
        :total-visible="$options.ROW_AMOUNT"
        circle
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import CustomChip from '@/components/FormElements/CustomChip'
import CustomSelect from '@/components/FormElements/CustomSelect'
import { StatusColor } from '@/constants/Status'
import roles from '@/mixins/roles'
import manuals from '@/mixins/manuals'
import datetime from '@/mixins/datetime'
import updateApplication from '@/mixins/updateApplication'

export default {
  name: 'ApplicationList',
  components: { CustomChip, CustomSelect },
  mixins: [roles, manuals, datetime, updateApplication],
  ROW_AMOUNT: 10,
  data() {
    return {
      StatusColor,
      applicationTableOptions: {
        page: 1,
        itemsPerPage: 15,
        sortBy: 'id',
        sortDesc: true,
        multiSort: false,
      },
      applicationTableHeaders: [
        {
          text: 'Номер',
          value: 'id',
          sortable: true,
          class: 'text-no-wrap',
        },
        {
          text: 'Тип кружка',
          value: 'type',
          sortable: false,
          class: 'text-no-wrap',
        },
        {
          text: 'Статус',
          value: 'status',
          sortable: true,
          class: 'text-no-wrap',
        },
        {
          text: 'Дата',
          value: 'created_at',
          sortable: true,
          class: 'text-no-wrap',
        },
        {
          text: 'Ответственный',
          value: 'responsible_name',
          class: 'text-no-wrap',
          cellClass: 'position--relative',
          sortable: false,
        },
        {
          text: 'ФИО заявителя',
          value: 'client_name',
          sortable: true,
          class: 'text-no-wrap',
        },
        {
          text: 'Комментарий',
          value: 'comment',
          sortable: false,
          class: 'text-no-wrap',
          cellClass: 'd-flex',
        },
      ],
      applicationTableData: [],
      statusFilter: [],
      statusFilterEnabled: false,
      typeFilter: [],
      typeFilterEnabled: false,
      loading: false,
      totalItems: 0,
      totalPages: 0,
    }
  },
  head() {
    return {
      title: 'Список заявок',
    }
  },
  // computed: {
  // statusNames() {
  //   return this.statuses.map((status) => ({
  //     text: status.name,
  //     value: status.id,
  //   }))
  // },
  // sectionNames() {
  //   return this.sections.map((section) => ({
  //     text: section.name,
  //     value: section.id,
  //   }))
  // },
  // },
  watch: {
    'applicationTableOptions.page'() {
      this.getList()
    },
  },
  mounted() {
    this.getStatuses()
    this.getSections()
    this.getList()
    if (this.isAdmin) {
      this.getModerators()
    }
  },
  methods: {
    async getList() {
      try {
        const { data } = await this.$api.applications.getList({
          page: this.applicationTableOptions.page,
          sort: `${this.applicationTableOptions.sortDesc ? '-' : ''}${
            this.applicationTableOptions.sortBy === 'client_name'
              ? 'users.name'
              : this.applicationTableOptions.sortBy
          }`,
          'filter[status]':
            this.statusFilter?.map((item) => item.id).join(',') || '',
          'filter[type]':
            this.typeFilter?.map((item) => item.id).join(',') || '',
        })
        this.applicationTableData = data.models.map((item) => ({
          ...item,
          status: item.status.toUpperCase(),
          isResponsibleEditing: false,
          isResponsibleLoading: false,
          isCommentEditing: false,
          isCommentLoading: false,
          commentEditing: '',
        }))
        this.totalItems = data.meta.total
        this.totalPages = data.meta.total_pages
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    editComment(application) {
      application.commentEditing = application.comment
      application.isCommentEditing = true
    },
    openApplication(application) {
      this.$router.push(`/applications/${application.id}`)
    },
    async setResponsible(application, responsible) {
      await this.updateResponsible(application, responsible)
      this.getList()
    },
    // removeItemFromTypeFilter(name) {
    //   this.typeFilter = this.typeFilter.filter((type) => type.item !== name)
    //   this.getList()
    // },
    // removeItemFromStatusFilter(name) {
    //   this.statusFilter = this.statusFilter.filter(
    //     (status) => status.item !== name
    //   )
    //   this.getList()
    // },
    selectAllStatuses() {
      if ((this.statusFilter?.length || 0) < this.statuses?.length) {
        this.statusFilter = [...this.statuses]
      } else {
        this.statusFilter = []
      }
      this.getList()
    },
    selectAllSections() {
      if ((this.typeFilter?.length || 0) < this.sections?.length) {
        this.typeFilter = [...this.sections]
      } else {
        this.typeFilter = []
      }
      this.getList()
    },
    async openMobileFilters() {
      const filters = await this.$modal.show('filters', {
        filters: {
          typeFilter: this.typeFilter,
          statusFilter: this.statusFilter,
        },
        options: { types: this.sections, statuses: this.statuses },
      })
      if (filters) {
        this.typeFilter = filters.typeFilter
        this.statusFilter = filters.statusFilter
        this.getList()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.table-select {
  z-index: 1;
  min-width: 330px;

  ::v-deep {
    .v-list-item {
      min-height: 30px;
    }

    .v-list-item--link::before {
      display: none;
    }
  }
}

.application-table {
  ::v-deep {
    .v-data-table__wrapper {
      min-height: 400px;
    }

    .v-data-table-header__icon {
      opacity: 1 !important;
      margin-left: 4px;
    }

    tr {
      display: grid;
      grid-template-columns: 65px 100px 300px 150px 280px 300px auto;
      align-items: center;
      border-radius: 10px;
      margin-bottom: 10px;
    }

    tbody tr {
      background: $button-color-default;
      transition: 0.3s;

      &:hover {
        background: $button-color-default !important;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        cursor: pointer;
      }
    }

    th {
      font-weight: 500 !important;
      padding: 7px 12px !important;
      border-bottom: none !important;

      &.sortable.active .v-data-table-header__icon {
        color: $button-color-error !important;
      }

      > span {
        color: $text-color-light !important;
      }
    }

    td {
      display: flex;
      align-items: center;
      padding: 3px 20px 3px 12px !important;
      white-space: nowrap !important;
      border-bottom: none !important;
    }
  }
}

.pg-btn {
  &.v-btn {
    &.v-btn--disabled.v-btn--has-bg.theme--light {
      background-color: $button-color-default !important;
    }
  }
}

@media (max-width: map-get($grid-breakpoints, 'sm')) {
  .application-table--mobile {
    ::v-deep {
      .v-data-table-header__icon {
        opacity: 1 !important;
      }

      th {
        padding: 0 !important;
        border: none !important;
      }

      td {
        font-size: 12px !important;
      }

      .v-data-table__mobile-table-row {
        display: grid;
        grid-template-columns: 35px auto 120px;
        grid-template-rows: repeat(3, auto);
        gap: 10px 0;
        padding: 8px 10px;
        margin-bottom: 10px;
        background: $medium-gray !important;
        border-radius: 10px;

        > :nth-child(1) {
          grid-column-start: 1;
          grid-column-end: 2;
          grid-row-start: 1;
          grid-row-end: 2;
        }

        > :nth-child(2) {
          grid-column-start: 2;
          grid-column-end: 3;
          grid-row-start: 1;
          grid-row-end: 2;
        }

        > :nth-child(3) {
          grid-column-start: 1;
          grid-column-end: 4;
          grid-row-start: 2;
          grid-row-end: 3;
        }

        > :nth-child(4) {
          grid-column-start: 3;
          grid-column-end: 4;
          grid-row-start: 1;
          grid-row-end: 2;
        }

        > :nth-child(5) {
          grid-column-start: 1;
          grid-column-end: 4;
          grid-row-start: 3;
          grid-row-end: 4;
        }

        > :nth-child(6),
        > :nth-child(7) {
          display: none !important;
        }
      }

      .v-data-table__mobile-row {
        min-height: unset !important;
        padding: 0 !important;
        border: none !important;
      }

      .v-data-table__mobile-row__header {
        display: none !important;
      }

      .v-data-table__mobile-row__cell {
        flex-grow: 1 !important;
        padding: 0 !important;
        text-align: left !important;
      }
    }
  }

  .pg-btn {
    display: none;
  }
}
</style>
