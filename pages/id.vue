<template>
  <div>
    <h1 class="font-weight-bold text--enlarged mb-3">Заявка № {{ id }}</h1>
    <div class="request-info mb-4">
      <div class="text--light">Тип кружка</div>
      <div class="font-weight-medium">{{ request.type }}</div>
      <div class="text--light">Статус</div>
      <div>
        <CustomChip :color="StatusColor[request.status.type]">{{
          request.status.text
        }}</CustomChip>
      </div>
      <div class="text--light">Дата</div>
      <div class="font-weight-medium">
        <span>{{ request.date }}</span>
        <span class="text--light">{{ request.time }}</span>
      </div>
      <div class="text--light">Ответственный</div>
      <div class="font-weight-medium position--relative">
        <CustomSelect
          v-if="isResponsibleEditing"
          :items="employees"
          item-value="name"
          item-text="name"
          placeholer="Выберите"
          class="position--absolute bg--gray"
          :style="{
            top: 0,
            left: 0,
          }"
          @keydown.esc="isResponsibleEditing = false"
          @change="setResponsible"
        >
          <template #no-data>
            <div class="font-weight-regular text-center">Нет результатов</div>
          </template>
        </CustomSelect>
        <a
          v-else-if="request.responsible"
          class="text-decoration-underline"
          @click.prevent="isResponsibleEditing = true"
          >{{ request.responsible }}</a
        >
        <v-btn v-else outlined small @click="isResponsibleEditing = true"
          >Назначить</v-btn
        >
      </div>
      <div class="text--light">Комментарий</div>
      <div>
        <v-text-field
          v-model="request.comment"
          placeholder="Текст комментария..."
          outlined
          hide-details
          class="comment-field"
        ></v-text-field>
      </div>
      <div class="text--light">ФИО заявителя</div>
      <div class="font-weight-medium">{{ request.requesterName }}</div>
      <div class="text--light">ФИО ребенка</div>
      <div class="font-weight-medium">{{ request.childName }}</div>
      <div class="text--light">
        ФИО сопровождающего<br />
        (для кюбз)
      </div>
      <div class="font-weight-medium">{{ request.maintanerName || '-' }}</div>
      <div class="text--light">Электронная почта</div>
      <div class="font-weight-medium">{{ request.email }}</div>
      <div class="text--light">Телефон</div>
      <div class="font-weight-medium">{{ request.phone }}</div>
      <div class="text--light">Приложение</div>
      <div class="d-flex flex-wrap align-start">
        <v-chip
          v-for="file in request.files"
          :key="file.id"
          to="/"
          target="_blank"
          class="mr-2 mb-2"
          >{{ file.name }}</v-chip
        >
      </div>
      <div class="request-info__row">
        <v-checkbox
          v-model="request.agreeProccessing"
          disabled
          hide-details
          class="d-inline-flex mt-0 pa-0"
        >
          <template #label>
            <div class="text--small ml-2 pt-1">
              Согласие на обработку и распространение персональных данных
            </div>
          </template>
        </v-checkbox>
      </div>
      <div class="request-info__row">
        <v-checkbox
          v-model="request.agreeePolicy"
          disabled
          hide-details
          class="d-inline-flex mt-0 pa-0"
        >
          <template #label>
            <div class="text--small ml-2 pt-1">
              Ознакомлен с политикой обработки персональных данных
            </div>
          </template>
        </v-checkbox>
      </div>
      <div class="request-info__row">
        <v-checkbox
          v-model="request.agreeRules"
          disabled
          hide-details
          class="d-inline-flex mt-0 pa-0"
        >
          <template #label>
            <div class="text--small ml-2 pt-1">
              Я ознакомлен и согласен с правилами и положениями КДФ «Пони –
              Клуб»
            </div>
          </template>
        </v-checkbox>
      </div>
      <div class="text--light">IP</div>
      <div class="font-weight-medium">{{ request.ip }}</div>
      <div class="text--light">Браузер</div>
      <div class="font-weight-medium">{{ request.browser }}</div>
    </div>
    <div class="d-flex align-center">
      <v-btn to="/" depressed color="primary" small class="mr-6">
        Закрыть
      </v-btn>
      <span class="text--light"
        >При закрытии все изменения будут сохранены</span
      >
    </div>
  </div>
</template>

<script>
import CustomChip from '@/components/FormElements/CustomChip'
import CustomSelect from '@/components/FormElements/CustomSelect'
import { StatusColor } from '@/constants/Status'

export default {
  name: 'SingleRequestPage',
  components: { CustomChip, CustomSelect },
  data() {
    return {
      StatusColor,
      id: 122,
      request: {
        type: 'Пони-клуб',
        status: {
          type: 'NEW',
          text: 'Новая',
        },
        date: '17.06.2022',
        time: '09:00:07',
        comment: '',
        requesterName: 'Григориев Вячеслав Вячеславович',
        childName: 'Григориева Виктория Вячеславовна',
        maintanerName: null,
        email: 'vech100@mail.ru',
        phone: '+7 965 800 66 55',
        files: [
          { id: 1, name: 'Заявление лист1.pdf (60.3kB)' },
          { id: 2, name: 'Заявление лист2.pdf (73.1kB)' },
        ],
        agreeProccessing: true,
        agreeePolicy: true,
        agreeRules: true,
        ip: '192.168.0.15',
        browser: 'Google Chrome',
      },
      employees: [
        { id: 1, name: 'Мария Христорождественская' },
        { id: 2, name: 'Светлана Петрановская' },
      ],
      isResponsibleEditing: false,
    }
  },
  head() {
    return {
      title: 'Заявка',
    }
  },
  methods: {
    setResponsible(value) {
      this.request.responsible = value.name
      this.isResponsibleEditing = false
    },
  },
}
</script>

<style lang="scss" scoped>
.request-info {
  width: min(700px, 80%);
  display: grid;
  grid-template-columns: 200px auto;
  grid-gap: 16px;

  &__row {
    grid-column-start: 1;
    grid-column-end: 3;
  }
}
</style>
