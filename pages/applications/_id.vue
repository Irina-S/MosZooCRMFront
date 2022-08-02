<template>
  <div>
    <!-- <v-stepper
      v-if="application"
      value="0"
      alt-labels
      flat
      class="status-timeline mb-5"
    >
      <v-stepper-header>
        <v-stepper-step step="1" :complete="steps[0]">
          <span class="font-weight-bold text--default mb-1">Принята</span>
          </v-stepper-step
        >
        <v-stepper-step step="2" :complete="steps[1]">
          <span class="font-weight-bold text--default mb-1"
            >Проверка заявки</span
          >
        </v-stepper-step>

        <v-stepper-step step="3" :complete="steps[2]">
          <span class="font-weight-bold text--default mb-1"
            >Проверка документов</span
          >
        </v-stepper-step>

        <v-stepper-step step="4" :complete="steps[3]">
          <span class="font-weight-bold text--default mb-1"
            >Прохождение в/и</span
          >
        </v-stepper-step>

        <v-stepper-step step="5" :complete="steps[4]">
          <span class="font-weight-bold text--default mb-1"
            >Решение принято</span
          >
        </v-stepper-step>

        <v-stepper-step step="6" :complete="steps[5]">
          <span class="font-weight-bold text--default mb-1">Отработана</span>
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper> -->
    <div v-if="application" class="position--relative">
      <h1 class="font-weight-bold text--enlarged mb-3">
        Заявка № {{ application.id }}
      </h1>
      <div class="application-info mb-4">
        <div class="text--light">Тип кружка</div>
        <div class="font-weight-medium">{{ application.type_as_string }}</div>
        <div class="text--light">Статус</div>
        <div>
          <CustomChip :color="StatusColor[application.status]">{{
            application.status_as_string
          }}</CustomChip>
        </div>
        <div class="text--light">Дата</div>
        <div class="font-weight-medium">
          <span>{{ parseDateFromExtended(application.created_at) }}</span>
          <span class="text--light">{{
            parseTimeFromExtended(application.created_at)
          }}</span>
        </div>
        <div class="text--light">Ответственный</div>
        <div>
          <template v-if="isAdmin">
            <CustomSelect
              v-if="application.isResponsibleEditing"
              :options="moderators"
              label="name"
              has-gray-bg
              @click.stop
              @cancel="application.isResponsibleEditing = false"
              @input="setResponsible(application, $event)"
            >
              <template #no-options>
                <div class="font-weight-regular text-center py-2">
                  Нет результатов
                </div>
              </template>
            </CustomSelect>
            <a
              v-else-if="application.responsible_name"
              class="font-weight-medium text-decoration-underline"
              @click.prevent.stop="application.isResponsibleEditing = true"
              >{{ application.responsible_name }}</a
            >
            <v-btn
              v-else
              outlined
              small
              @click.prevent.stop="application.isResponsibleEditing = true"
              >Назначить</v-btn
            >
          </template>
          <template v-else>
            <div class="font-weight-medium">
              {{ application.responsible_name || '-' }}
            </div>
          </template>
        </div>
        <div class="text--light">Комментарий</div>
        <div>
          <v-textarea
            v-model="application.comment"
            placeholder="Текст комментария..."
            no-resize
            rows="3"
            outlined
            hide-details
            class="comment-field comment-textarea mb-2"
          ></v-textarea>
        </div>
        <template
          v-if="
            isAdmin ||
            (['pony_club'].includes(application.type) &&
              application.possible_next_statuses &&
              application.possible_next_statuses.includes(
                Status.INVITATION_TO_ENTRANCE_EXAMINATIONS
              ))
          "
        >
          <div class="text--light">Дата и время в/и*</div>
          <div class="d-flex justify-space-between">
            <CustomDatePicker v-model="examinations.date" class="mr-2" />
            <CustomTimePicker v-model="examinations.time" />
          </div>
        </template>
        <template
          v-if="
            isAdmin ||
            (['pony_club'].includes(application.type) &&
              application.possible_next_statuses &&
              (application.possible_next_statuses.includes(
                Status.INVITATION_TO_ENTRANCE_EXAMINATIONS
              ) ||
                application.possible_next_statuses.includes(
                  Status.APPROVED_BY_EXAMINATIONS
                )))
          "
        >
          <div class="text--light">Группа в/и*</div>
          <div>
            <v-select
              v-model="examinations.group"
              :items="groups"
              :menu-props="{
                bottom: true,
                offsetY: true,
                class: 'group-select__menu',
              }"
              item-text="name"
              item-value="id"
              placeholder="Выберите"
              outlined
              dense
              hide-details
              class="group-select"
            />
          </div>
        </template>
        <template
          v-if="
            isAdmin ||
            (['kubz', 'kraski_mira'].includes(application.type) &&
              application.possible_next_statuses &&
              application.possible_next_statuses.includes(
                Status.INVITATION_TO_CLASS
              ))
          "
        >
          <div class="text--light">Дата и время занятия</div>
          <div class="d-flex justify-space-between">
            <CustomDatePicker v-model="classes.date" class="mr-2" />
            <CustomTimePicker v-model="classes.time" />
          </div>
        </template>
        <template
          v-if="
            isAdmin ||
            (['kubz', 'kraski_mira'].includes(application.type) &&
              application.possible_next_statuses &&
              application.possible_next_statuses.includes(
                Status.INVITATION_TO_CLASS
              ))
          "
        >
          <div class="text--light">Группа занятия</div>
          <div>
            <v-select
              v-model="classes.group"
              :items="groups"
              :menu-props="{
                bottom: true,
                offsetY: true,
                class: 'group-select__menu',
              }"
              item-text="name"
              item-value="id"
              placeholder="Выберите"
              outlined
              dense
              hide-details
              class="group-select"
            ></v-select>
          </div>
        </template>
        <div class="text--light">ФИО заявителя</div>
        <div class="font-weight-medium">
          {{ application.client_name || '-' }}
        </div>
        <div class="text--light">ФИО ребенка</div>
        <div class="font-weight-medium">
          {{ application.child_name || '-' }}
        </div>
        <div class="text--light">
          ФИО сопровождающего<br />
          (для кюбз)
        </div>
        <div class="font-weight-medium">
          {{ application.accompanynig_person || '-' }}
        </div>
        <div class="text--light">Электронная почта</div>
        <div class="font-weight-medium">{{ application.email }}</div>
        <div class="text--light">Телефон</div>
        <div class="font-weight-medium">
          {{ formatPhone(application.phone) }}
        </div>
        <!-- <div class="text--light">Приложение</div>
        <div class="d-flex flex-wrap align-start">
          <v-chip
            v-for="file in application.files"
            :key="file.id"
            to="/"
            target="_blank"
            class="mr-2 mb-2"
            >{{ file.name }}</v-chip
          >
        </div> -->
        <div class="application-info__row">
          <v-checkbox
            v-model="agreement"
            disabled
            hide-details
            class="d-inline-flex mt-0 pa-0"
          >
            <template #label>
              <div class="text--small text--default ml-2 pt-1">
                Я даю Согласие на обработку и распространение персональных
                данных
              </div>
            </template>
          </v-checkbox>
        </div>
        <div class="application-info__row">
          <v-checkbox
            v-model="agreement"
            disabled
            hide-details
            class="d-inline-flex mt-0 pa-0"
          >
            <template #label>
              <div class="text--small text--default ml-2 pt-1">
                Я ознакомлен с политикой обработки персональных данных
              </div>
            </template>
          </v-checkbox>
        </div>
        <div
          v-for="checkbox in checkboxes[application.type]"
          :key="checkbox.model"
          class="application-info__row"
        >
          <v-checkbox
            v-model="agreement"
            disabled
            hide-details
            class="d-inline-flex mt-0 pa-0"
          >
            <template #label>
              <div
                class="application-info__agreement text--small text--default ml-2 pt-1"
                v-html="checkbox.label"
              ></div>
            </template>
          </v-checkbox>
        </div>
        <div class="text--light">IP</div>
        <div class="font-weight-medium">{{ application.IP }}</div>
        <div class="text--light">Браузер</div>
        <div class="font-weight-medium">{{ application.browser }}</div>
      </div>
      <div class="d-flex align-center mb-4">
        <v-btn color="primary" small class="mr-6" @click="saveApplication">
          Сохранить
        </v-btn>
        <v-btn to="/" small> Закрыть </v-btn>
      </div>
      <div
        v-if="
          (isAdmin && application.responsible_name) ||
          (isModerator && application.possible_next_statuses.length)
        "
        class="application-actions position--absolute rounded-lg bg--gray pt-4 px-3 pb-6"
      >
        <div class="mb-4">Выберите вариант решения по заявке</div>
        <div class="d-flex align-start flex-wrap">
          <template v-if="isAdmin">
            <v-btn
              v-for="(status, key) in StatusBtnText"
              v-show="key !== application.status"
              :key="key"
              :color="StatusBtnColor[key]"
              outlined
              small
              class="font-weight-medium border--normal mr-3 mb-3"
              @click="updateStatus(key)"
            >
              {{ status }}
            </v-btn>
          </template>
          <template v-else>
            <v-btn
              v-for="(status, key) in StatusBtnText"
              v-show="application.possible_next_statuses.includes(Status[key])"
              :key="key"
              :color="StatusBtnColor[key]"
              outlined
              small
              class="font-weight-medium border--normal mr-3 mb-3"
              @click="updateStatus(key)"
            >
              {{ status }}
            </v-btn>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomChip from '@/components/FormElements/CustomChip'
import CustomSelect from '@/components/FormElements/CustomSelect'
import CustomDatePicker from '@/components/FormElements/CustomDatePicker'
import CustomTimePicker from '@/components/FormElements/CustomTimePicker'
import {
  Status,
  StatusColor,
  StatusBtnColor,
  StatusBtnText,
} from '@/constants/Status'
import roles from '@/mixins/roles'
import manuals from '@/mixins/manuals'
import checkboxes from '@/mixins/checkboxes'
import datetime from '@/mixins/datetime'
import updateApplication from '@/mixins/updateApplication'
import prepareParams from '@/mixins/prepareParams'

export default {
  name: 'ApplicationPage',
  components: { CustomChip, CustomSelect, CustomDatePicker, CustomTimePicker },
  mixins: [
    roles,
    manuals,
    checkboxes,
    datetime,
    updateApplication,
    prepareParams,
  ],
  data() {
    return {
      Status,
      StatusColor,
      StatusBtnColor,
      StatusBtnText,
      agreement: true,
      application: null,
      examinations: {
        date: null,
        time: null,
        group: null,
      },
      classes: {
        date: null,
        time: null,
        group: null,
      },
    }
  },
  head() {
    return {
      title: `Заявка №${this.$route.params.id}`,
    }
  },
  mounted() {
    if (this.isAdmin) {
      this.getModerators()
    }
    this.getGroups()
    this.getApplication()
  },
  methods: {
    async getApplication() {
      try {
        const data = await this.$api.applications.get(this.$route.params.id)
        this.application = {
          ...data,
          status: data.status.toUpperCase(),
          responsible: null,
          isResponsibleEditing: false,
        }
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    formatPhone(value) {
      const phone = value.toString()
      if (!phone || phone.length !== 10) {
        return ''
      }
      return `+7 (${phone.substring(0, 3)}) ${phone.substring(
        3,
        6
      )} ${phone.substring(6, 8)} ${phone.substring(8, 10)}`
    },
    setResponsible(application, responsible) {
      application.responsible = responsible
      application.responsible_name = responsible.name
    },
    async updateStatus(value) {
      try {
        const confirm = await this.$modal.show('confirm', {
          message: 'Вы уверены, что хотите изменить статус заявки?',
        })
        if (!confirm) {
          return
        }
        const params = {
          status: Status[value],
        }

        switch (Status[value]) {
          case Status.INVITATION_TO_ENTRANCE_EXAMINATIONS:
            params.examination_date = this.prepareDateTime(
              this.examinations.date,
              this.examinations.time
            )
            params.group_id = this.examinations.group
            break
          case Status.APPROVED_BY_EXAMINATIONS:
            params.group_id = this.examinations.group
            break
          case Status.INVITATION_TO_CLASS:
            params.examination_date = this.prepareDateTime(
              this.classes.date,
              this.classes.time
            )
            params.group_id = this.classes.group
            break
          default:
            break
        }
        if (this.isAdmin) {
          await this.$api.applications.update(this.$route.params.id, params)
        } else {
          await this.$api.applications.updateStatus(
            this.$route.params.id,
            params
          )
        }
        this.getApplication()
        this.$modal.show('success', {
          title: 'Изменения по заявке были сохранены!',
        })
      } catch (err) {
        this.$modal.show('error', {
          title: 'Произошла ошибка!',
          message: 'Изменения по заявке не были сохранены',
        })
      }
    },
    async saveApplication() {
      try {
        const params = { comment: this.application.comment }
        if (this.application.responsible) {
          params.responsible_id = this.application.responsible.id
        }
        await this.$api.applications.update(this.$route.params.id, params)
        this.$modal.show('success', {
          title: 'Изменения по заявке были сохранены!',
        })
        this.$router.push('/')
      } catch (err) {
        this.$modal.show('error', {
          title: 'Произошла ошибка!',
          message: 'Изменения по заявке не были сохранены',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.application-info {
  width: min(700px, 80%);
  display: grid;
  grid-template-columns: 200px 370px;
  grid-gap: 16px;

  &__row {
    grid-column-start: 1;
    grid-column-end: 3;
  }

  &__agreement {
    ::v-deep {
      a {
        text-decoration: none;
        color: inherit;
      }
    }
  }
}

.application-actions {
  right: 0;
  top: 0;
  max-width: 640px;
}

.status-timeline {
  background: $light-gray;
  border-radius: 10px;

  ::v-deep {
    .v-stepper__step {
      min-height: 40px;
      flex: calc(100% / 6) 0 0;
      padding: 7px;

      &:not(:last-of-type, .v-stepper__step--active, .v-stepper__step--complete)::after {
        content: '';
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 20px;
        background: #ccd4df;
      }

      &--complete,
      &--active {
        background: $gray;
      }

      &--active {
        border-radius: 0 10px 10px 0;
      }

      &__step {
        display: none;
      }
    }

    .v-stepper__header {
      flex-wrap: nowrap;
      box-shadow: none;
    }

    .v-stepper__label {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  }
}
</style>
