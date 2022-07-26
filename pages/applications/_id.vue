<template>
  <div>
    <v-stepper value="2" alt-labels flat class="status-timeline mb-5">
      <v-stepper-header>
        <v-stepper-step step="1" complete>
          <span class="font-weight-bold text--default mb-1">Принята</span>
          <span class="text--x-small">13.03.2021 09:00:05</span></v-stepper-step
        >

        <v-stepper-step step="2">
          <span class="font-weight-bold text--default mb-1"
            >Проверка заявки</span
          >
        </v-stepper-step>

        <v-stepper-step step="3">
          <span class="font-weight-bold text--default mb-1"
            >Проверка документов</span
          >
        </v-stepper-step>

        <v-stepper-step step="4">
          <span class="font-weight-bold text--default mb-1"
            >Прохождение в/и</span
          >
        </v-stepper-step>

        <v-stepper-step step="5">
          <span class="font-weight-bold text--default mb-1"
            >Решение принято</span
          >
        </v-stepper-step>

        <v-stepper-step step="6">
          <span class="font-weight-bold text--default mb-1">Отработана</span>
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>
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
          <span>{{ $dayjs(application.created_at).format('DD.MM.YYYY') }}</span>
          <span class="text--light">{{
            $dayjs(application.created_at).format('HH:MM:ss')
          }}</span>
        </div>
        <div class="text--light">Ответственный</div>
        <div class="font-weight-medium position--relative">
          <template v-if="isAdmin">
            <CustomSelect
              v-if="application.isResponsibleEditing"
              :items="moderators.items"
              item-value="id"
              item-text="name"
              placeholer="Выберите"
              class="position--absolute bg--gray"
              :style="{
                top: 0,
                left: 0,
              }"
              @keydown.esc="application.isResponsibleEditing = false"
              @change="updateResponsible(application, $event)"
            >
              <template #no-data>
                <div class="font-weight-regular text-center">
                  Нет результатов
                </div>
              </template>
            </CustomSelect>
            <v-progress-circular
              v-else-if="application.isResponsibleLoading"
              indeterminate
              color="primary"
              size="20"
              width="2"
              class="mx-auto"
            ></v-progress-circular>
            <a
              v-else-if="application.responsible_name"
              class="text-decoration-underline"
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
          <v-progress-circular
            v-if="application.isCommentLoading"
            indeterminate
            color="primary"
            size="20"
            width="2"
            class="mx-auto"
          ></v-progress-circular>
          <template v-else>
            <v-textarea
              v-model="application.commentEditing"
              placeholder="Текст комментария..."
              no-resize
              rows="3"
              outlined
              hide-details
              class="comment-field comment-textarea mb-2"
            ></v-textarea>
            <div class="d-flex justify-end">
              <v-btn color="primary" small @click="saveComment">
                Сохранить
              </v-btn>
              <v-btn small class="text--light ml-4" @click="resetComment">
                Отменить
              </v-btn>
            </div>
          </template>
        </div>
        <template
          v-if="
            application.possible_next_statuses &&
            application.possible_next_statuses.includes(
              Status.INVITATION_TO_ENTRANCE_EXAMINATION
            )
          "
        >
          <div class="text--light">Дата и время в/и*</div>
          <div class="d-flex justify-space-between">
            <CustomDatePicker class="mr-2" />
            <CustomTimePicker />
          </div>
        </template>
        <template
          v-if="
            application.possible_next_statuses &&
            application.possible_next_statuses.includes(
              Status.INVITATION_TO_ENTRANCE_EXAMINATION
            )
          "
        >
          <div class="text--light">Группа в/и*</div>
          <div>
            <v-select
              :items="$options.groups"
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
        <template
          v-if="
            application.possible_next_statuses &&
            application.possible_next_statuses.includes(
              Status.INVITATION_TO_CLASS
            )
          "
        >
          <div class="text--light">Дата и время в/и*</div>
          <div class="d-flex justify-space-between">
            <CustomDatePicker class="mr-2" />
            <CustomTimePicker />
          </div>
        </template>
        <template
          v-if="
            application.possible_next_statuses &&
            application.possible_next_statuses.includes(
              Status.INVITATION_TO_CLASS
            )
          "
        >
          <div class="text--light">Группа в/и*</div>
          <div>
            <v-select
              :items="$options.groups"
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
                v-html="checkbox.label"
                class="
                  application-info__agreement
                  text--small text--default
                  ml-2
                  pt-1
                "
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
        <v-btn to="/" depressed color="primary" small class="mr-6">
          Закрыть
        </v-btn>
        <span class="text--light"
          >При закрытии все изменения будут сохранены</span
        >
      </div>
      <div
        v-if="(isAdmin && application.responsible_name) || isModerator"
        class="
          application-actions
          position--absolute
          rounded-lg
          bg--gray
          pt-4
          px-3
          pb-6
        "
      >
        <div class="mb-4">Выберите вариант решения по заявке</div>
        <div v-if="isAdmin" class="d-flex align-start flex-wrap">
          <v-btn
            v-for="(status, key) in StatusBtnText"
            :key="key"
            :color="StatusBtnColor[key]"
            outlined
            small
            class="font-weight-medium border--normal mr-3 mb-3"
            @click="updateStatus(key)"
          >
            {{ status }}
          </v-btn>
        </div>
        <!-- <div
          v-if="$route.query.type === 'accepted'"
          class="d-flex justify-space-between align-start"
        >
          <v-btn
            outlined
            color="indigo"
            small
            class="font-weight-medium border--normal mr-6"
          >
            Запрос документов
          </v-btn>
          <v-btn
            outlined
            color="error"
            small
            class="font-weight-medium border--normal mr-12"
          >
            Отклонена (гр. укомплектована)
          </v-btn>
          <v-btn
            outlined
            color="#99A2AD"
            small
            class="font-weight-mediumborder--normal"
          >
            Дубликат
          </v-btn>
        </div>
        <div
          v-else-if="$route.query.type === 'documents_application'"
          class="d-flex justify-space-between align-start"
        >
          <v-btn
            outlined
            color="#CD32A2"
            small
            class="font-weight-medium border--normal mr-6"
          >
            Приглашение на в/и
          </v-btn>
          <v-btn
            outlined
            color="error"
            small
            class="font-weight-medium border--normal mr-auto"
          >
            Отклонена (отсутствуют док.)
          </v-btn>
        </div>
        <div
          v-else-if="$route.query.type === 'invitation'"
          class="d-flex justify-space-between align-start"
        >
          <v-btn
            outlined
            color="success"
            small
            class="font-weight-medium border--normal mr-6"
          >
            Одобрена (по итогам в/и)
          </v-btn>
          <v-btn
            outlined
            color="error"
            small
            class="font-weight-medium border--normal mr-auto"
          >
            Отклонена (по итогам в/и)
          </v-btn>
        </div> -->
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
import checkboxes from '@/mixins/checkboxes'
import updateApplication from '@/mixins/updateApplication'

export default {
  name: 'SingleapplicationPage',
  mixins: [roles, checkboxes, updateApplication],
  components: { CustomChip, CustomSelect, CustomDatePicker, CustomTimePicker },
  groups: [
    { id: 1, name: 'Группа 1' },
    { id: 2, name: 'Группа 2' },
    { id: 3, name: 'Группа 3' },
    { id: 4, name: 'Группа 4' },
  ],
  data() {
    return {
      Status,
      StatusColor,
      StatusBtnColor,
      StatusBtnText,
      agreement: true,
      application: null,
    }
  },
  head() {
    return {
      title: `Заявка №${this.$route.params.id}`,
    }
  },
  mounted() {
    this.getModerators()
    this.getApplication()
  },
  methods: {
    async getApplication() {
      try {
        const data = await this.$api.applications.get(this.$route.params.id)
        this.application = {
          ...data,
          status: data.status.toUpperCase(),
          isResponsibleEditing: false,
          isResponsibleLoading: false,
          isCommentEditing: false,
          isCommentLoading: false,
          commentEditing: data.comment,
        }
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    formatPhone(phone) {
      if (!phone || phone.length !== 10) {
        return ''
      }
      return `+7 () ${phone.substring(0, 3)} ${phone.substring(
        3,
        6
      )} ${phone.substring(6, 8)} ${phone.substring(8, 0)}`
    },
    resetComment() {
      this.application.commentEditing = this.application.comment
    },
    async saveComment() {
      await this.updateComment(
        this.application,
        this.application.commentEditing
      )
      this.application.commentEditing = this.application.comment
    },
    async updateStatus(status) {
      try {
        await this.$api.applications.updateStatus(this.$route.params.id, {
          status,
        })
      } catch (err) {
        this.$modal.show('error', { err })
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
      align-items: center;
      text-align: center;
    }
  }
}
</style>