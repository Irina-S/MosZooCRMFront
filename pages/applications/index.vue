<template>
  <div>
    <h1 class="font-weight-bold text--enlarged mb-3">Список заявок</h1>
    <v-data-table
      :headers="applicationTableHeaders"
      :items="applicationTableData"
      :items-per-page="applicationTableOptions.itemsPerPage"
      :header-props="{ sortIcon: 'mdi-filter-variant' }"
      :must-sort="true"
      :sort-by.sync="applicationTableOptions.sortBy"
      :sort-desc.sync="applicationTableOptions.sortDesc"
      :server-items-length="totalItems"
      hide-default-footer
      class="application-table mb-6"
      @update:sort-by="getList"
      @update:sort-desc="getList"
    >
      <template #[`item.id`]="{ item }">
        <span class="font-weight-medium" @click="openApplication(item)">{{
          item.id
        }}</span>
      </template>
      <template #[`item.type`]="{ item }">
        <span class="font-weight-medium">{{ item.type_as_string }}</span>
      </template>
      <template #[`item.status`]="{ item }">
        <CustomChip :color="StatusColor[item.status]" small>{{
          item.status_as_string
        }}</CustomChip>
      </template>
      <template #[`item.created_at`]="{ item }">
        <span class="font-weight-medium mr-1">{{
          $dayjs(item.created_at).format('DD.MM.YYYY')
        }}</span>
        <span class="font-weight-medium text--light">{{
          $dayjs(item.created_at).format('HH:MM:ss')
        }}</span>
      </template>
      <template #[`item.responsible_name`]="{ item }">
        <template v-if="isAdmin">
          <CustomSelect
            v-if="item.isResponsibleEditing"
            :items="moderators.items"
            item-value="id"
            item-text="name"
            placeholer="Выберите"
            fixed
            @click.stop
            @keydown.esc="item.isResponsibleEditing = false"
            @change="updateResponsible(item, $event)"
          >
            <template #no-data>
              <div class="font-weight-regular text-center">Нет результатов</div>
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
    <div v-if="totalPages > 1" class="d-flex justify-center align-center">
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
        total-visible="10"
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
import updateApplication from '@/mixins/updateApplication'

export default {
  name: 'ApplicationList',
  components: { CustomChip, CustomSelect },
  mixins: [roles, updateApplication],
  data() {
    return {
      StatusColor,
      sections: [],
      statuses: [],
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
  watch: {
    'applicationTableOptions.page'() {
      this.getList()
    },
  },
  mounted() {
    console.log(`ROLE:${this.role}`)
    this.getStatuses()
    this.getList()
    if (this.isAdmin) {
      this.getModerators()
    }
  },
  methods: {
    async getSections() {
      try {
        const { data } = await this.$api.manuals.getApplicationsTypes()
        this.sections = data.models
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    async getStatuses() {
      try {
        const { data } = await this.$api.manuals.getStatuses()
        this.statuses = data.models
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    async getList() {
      try {
        const { data } = await this.$api.applications.getList({
          page: this.applicationTableOptions.page,
          sort: `${this.applicationTableOptions.sortDesc ? '-' : ''}${
            this.applicationTableOptions.sortBy === 'client_name'
              ? 'users.name'
              : this.applicationTableOptions.sortBy
          }`,
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
      this.$router.push(`applications/${application.id}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.application-table {
  ::v-deep {
    tr {
      display: grid;
      grid-template-columns: 65px 100px 300px 150px 250px 300px auto;
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

      span {
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

    .v-data-table-header__icon {
      opacity: 1 !important;
      margin-left: 4px;
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
</style>
