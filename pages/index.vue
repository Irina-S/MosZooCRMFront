<template>
  <div>
    <h1 class="font-weight-bold text--enlarged mb-3">Список заявок</h1>
    <v-data-table
      :headers="requestTableHeaders"
      :items="requestTableData"
      :items-per-page="10"
      :header-props="{ sortIcon: 'mdi-filter-variant' }"
      hide-default-footer
      class="request-table mb-6"
    >
      <template #[`item.id`]="{ item }">
        <span class="font-weight-medium">{{ item.id }}</span>
      </template>
      <template #[`item.type`]="{ item }">
        <span class="font-weight-medium">{{ item.type }}</span>
      </template>
      <template #[`item.status`]="{ item }">
        <CustomChip :color="StatusColor[item.status.type]" small>{{
          item.status.text
        }}</CustomChip>
      </template>
      <template #[`item.date`]="{ item }">
        <span class="font-weight-medium mr-1">{{ item.date }}</span>
        <span class="font-weight-medium text--light">{{ item.time }}</span>
      </template>
      <template #[`item.responsible`]="{ item }">
        <template v-if="$route.query.employee === 'responsible'">
          <div class="font-weight-medium">Мария Христорождественская</div>
        </template>
        <template v-else>
          <CustomSelect
            v-if="item.isResponsibleEditing"
            :items="employees"
            item-value="name"
            item-text="name"
            placeholer="Выберите"
            fixed
            @keydown.esc="item.isResponsibleEditing = false"
            @change="setResponsible(item, $event)"
          >
            <template #no-data>
              <div class="font-weight-regular text-center">Нет результатов</div>
            </template>
          </CustomSelect>
          <a
            v-else-if="item.responsible"
            class="text-decoration-underline"
            @click.prevent="item.isResponsibleEditing = true"
            >{{ item.responsible }}</a
          >
          <v-btn
            v-else
            outlined
            x-small
            @click="item.isResponsibleEditing = true"
            >Назначить</v-btn
          >
        </template>
      </template>
      <template #[`item.applicant`]="{ item }">
        <span class="font-weight-medium truncate-text" style="width: 95%">
          {{ item.applicant }}</span
        >
      </template>
      <template #[`item.comment`]="{ item }">
        <v-text-field
          v-if="item.isCommentEditing"
          v-model="item.comment"
          placeholder="Текст комментария..."
          outlined
          dense
          hide-details
          class="comment-field"
          @keypress.enter="item.isCommentEditing = false"
        ></v-text-field>
        <span
          v-else
          class="full-width font-weight-medium"
          style="min-height: 26px"
          @click="item.isCommentEditing = true"
          >{{ item.comment }}</span
        >
      </template>
    </v-data-table>
    <div class="d-flex justify-center align-center">
      <v-btn
        rounded
        elevation="0"
        class="pg-btn font-weight-reqular mr-6"
        :disabled="page === 1"
        @click="page = 1"
      >
        На первую
      </v-btn>
      <v-pagination
        v-model="page"
        :length="35"
        total-visible="10"
        circle
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CustomChip from '@/components/FormElements/CustomChip'
import CustomSelect from '@/components/FormElements/CustomSelect'
import { StatusColor } from '@/constants/Status'

export default {
  name: 'RequestList',
  components: { CustomChip, CustomSelect },
  data() {
    return {
      StatusColor,
      employees: [
        { id: 1, name: 'Мария Христорождественская' },
        { id: 2, name: 'Светлана Петрановская' },
      ],
      requestTableHeaders: [
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
          sortable: false,
          class: 'text-no-wrap',
        },
        {
          text: 'Дата',
          value: 'date',
          sortable: false,
          class: 'text-no-wrap',
        },
        {
          text: 'Ответственный',
          value: 'responsible',
          sortable: true,
          class: 'text-no-wrap',
          cellClass: 'position--relative',
        },
        {
          text: 'ФИО заявителя',
          value: 'applicant',
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
      requestTableData: [
        {
          id: 122,
          type: 'Пони-клуб',
          status: {
            type: 'NEW',
            text: 'Новая',
          },
          date: '17.06.2022',
          time: '09:00:07',
          responsible: null,
          applicant: 'Константинопольский Константин Константинович',
          comment: '',
          isCommentEditing: false,
          isResponsibleEditing: false,
        },
        {
          id: 121,
          type: 'Пони-клуб',
          status: {
            type: 'NEW',
            text: 'Новая',
          },
          date: '17.06.2022',
          time: '08:45:09',
          responsible: null,
          applicant: 'Константинопольский Константин Константинович',
          comment: '',
          isCommentEditing: false,
          isResponsibleEditing: false,
        },
        {
          id: 120,
          type: 'Краски мира',
          status: {
            type: 'APPROVED',
            text: 'Приглашение на занятие',
          },
          date: '16.06.2022',
          time: '12:44:02',
          responsible: 'Светлана Петрановская',
          applicant: 'Смирнов Петр Анатольевич',
          comment: 'Текст комментария к заявке может быть дл...',
          isCommentEditing: false,
          isResponsibleEditing: false,
        },
        {
          id: 119,
          type: 'Краски мира',
          status: {
            type: 'ACCEPTED',
            text: 'Принята',
          },
          date: '16.06.2022',
          time: '12:09:07',
          responsible: 'Мария Христорождественская ',
          applicant: 'Григориев Василий Васильевич',
          comment: '',
          isCommentEditing: false,
          isResponsibleEditing: false,
        },
        {
          id: 118,
          type: 'КЮБЗ',
          status: {
            type: 'APPROVED',
            text: 'Одобрена (по итогам в/и)',
          },
          date: '16.06.2022',
          time: '12:09:07',
          responsible: 'Виктория Викторова',
          applicant: 'Федоров Роман Евгеньевич',
          comment: 'Текст комментария к заявке может быть дл...',
          isCommentEditing: false,
          isResponsibleEditing: false,
        },
        {
          id: 117,
          type: 'КЮБЗ',
          status: {
            type: 'DENIED',
            text: 'Отклонена (гр. укомплектована)',
          },
          date: '16.06.2022',
          time: '09:03:01',
          responsible: 'Мария Христорождественская ',
          applicant: 'Григориев Виктор Викторович',
          comment: '',
          isCommentEditing: false,
          isResponsibleEditing: false,
        },
        {
          id: 116,
          type: 'Краски мира',
          status: {
            type: 'NEW',
            text: 'Новая',
          },
          date: '15.06.2022',
          time: '09:03:01',
          responsible: null,
          applicant: 'Котов Дмитрий Витальевич',
          comment: '',
          isCommentEditing: false,
          isResponsibleEditing: false,
        },
        {
          id: 115,
          type: 'Пони-клуб',
          status: {
            type: 'DOCUMENTS_REQUEST',
            text: 'Запрос документов',
          },
          date: '15.06.2022',
          time: '09:03:01',
          responsible: null,
          applicant: 'Котов Дмитрий Витальевич',
          comment: '',
          isCommentEditing: false,
          isResponsibleEditing: false,
        },
        {
          id: 114,
          type: 'Пони-клуб',
          status: {
            type: 'DUPLICATED',
            text: 'Дубликат',
          },
          date: '15.06.2022',
          time: '09:03:01',
          responsible: 'Мария Христорождественская ',
          applicant: 'Котов Дмитрий Витальевич',
          comment: '',
          isCommentEditing: false,
          isResponsibleEditing: false,
        },
        {
          id: 113,
          type: 'Пони-клуб',
          status: {
            type: 'APPROVED',
            text: 'Приглашение на занятие',
          },
          date: '15.06.2022',
          time: '09:03:01',
          responsible: 'Мария Христорождественская ',
          applicant: 'Котов Дмитрий Витальевич',
          comment: '',
          isCommentEditing: false,
          isResponsibleEditing: false,
        },
      ],
      page: 1,
    }
  },
  head() {
    return {
      title: 'Список заявок',
    }
  },
  computed: {
    ...mapGetters('user', ['role']),
  },
  mounted() {
    console.log(`ROLE:${this.role}`)
  },
  methods: {
    setResponsible(request, value) {
      request.responsible = value.name
      request.isResponsibleEditing = false
    },
  },
}
</script>

<style lang="scss" scoped>
.request-table {
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
      color: $text-color-light !important;
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
