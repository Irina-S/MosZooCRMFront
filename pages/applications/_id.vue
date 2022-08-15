<template>
  <div>
    <div v-if="application">
      <h1
        class="font-weight-bold mb-3"
        :class="
          !$vuetify.breakpoint.xs
            ? 'font-weight-bold text--enlarged'
            : 'text--normal'
        "
      >
        Заявка № {{ application.id }}
      </h1>
      <v-row>
        <v-col cols="12" md="7">
          <div class="application-info mb-4">
            <div class="text--light">Тип кружка</div>
            <div class="font-weight-medium">
              {{ application.type_as_string }}
            </div>
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
                :dense="$vuetify.breakpoint.xs"
                placeholder="Текст комментария..."
                no-resize
                rows="3"
                outlined
                hide-details
                class="comment-textarea mb-2"
              ></v-textarea>
            </div>
            <template
              v-if="
                application.status === Status.DOCUMENTS_REQUEST.toUpperCase()
              "
            >
              <div class="text--light">Дата приема документов</div>
              <div>
                <CustomDatePicker
                  v-model="application.receipt_documents_at"
                  class="flex-grow-1"
                />
              </div>
            </template>
            <template
              v-if="
                canSeeExaminations &&
                (isAdmin ||
                  (application.possible_next_statuses &&
                    application.possible_next_statuses.includes(
                      Status.INVITATION_TO_ENTRANCE_EXAMINATIONS
                    )))
              "
            >
              <div class="text--light">Дата и время в/и*</div>
              <div class="d-flex justify-space-between">
                <CustomDatePicker
                  v-model="examinations.date"
                  class="flex-grow-1 mr-2"
                />
                <CustomTimePicker
                  v-model="examinations.time"
                  class="flex-grow-1"
                />
              </div>
            </template>
            <template
              v-if="
                canSeeExaminations &&
                (isAdmin ||
                  (application.possible_next_statuses &&
                    application.possible_next_statuses.includes(
                      Status.INVITATION_TO_ENTRANCE_EXAMINATIONS
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
                (application.possible_next_statuses &&
                  (application.possible_next_statuses.includes(
                    Status.INVITATION_TO_CLASS
                  ) ||
                    application.possible_next_statuses.includes(
                      Status.APPROVED_BY_EXAMINATIONS
                    )))
              "
            >
              <div class="text--light">Дата и время занятия</div>
              <div class="d-flex justify-space-between">
                <CustomDatePicker
                  v-model="classes.date"
                  class="flex-grow-1 mr-2"
                />
                <CustomTimePicker v-model="classes.time" class="flex-grow-1" />
              </div>
            </template>
            <template
              v-if="
                isAdmin ||
                (application.possible_next_statuses &&
                  (application.possible_next_statuses.includes(
                    Status.INVITATION_TO_CLASS
                  ) ||
                    application.possible_next_statuses.includes(
                      Status.APPROVED_BY_EXAMINATIONS
                    )))
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
              {{ application.accompanying_person || '-' }}
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
                  >
                    {{ checkbox.label }} {{ checkbox.linkTitle }}
                  </div>
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
        </v-col>
        <v-col cols="12" md="5" class="order-first order-md-last">
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <div
              v-if="
                (isAdmin && application.responsible_name) ||
                (isModerator && application.possible_next_statuses.length)
              "
              class="rounded-lg bg--gray pt-4 px-3 pb-6"
            >
              <div class="mb-4">Выберите вариант решения по заявке</div>
              <div class="d-flex align-start flex-wrap">
                <!-- <template v-if="isAdmin"> -->
                <v-btn
                  v-for="status in availableStatuses"
                  v-show="status.id.toUpperCase() !== application.status"
                  :key="status.id"
                  :color="StatusBtnColor[status.id.toUpperCase()]"
                  outlined
                  small
                  class="font-weight-medium border--normal mr-3 mb-3"
                  @click="updateStatus(status.id)"
                >
                  {{ status.name }}
                </v-btn>
              </div>
            </div>
          </template>
          <template v-else>
            <v-select
              :menu-props="{ bottom: true, offsetY: true }"
              :items="availableStatuses"
              :dense="$vuetify.breakpoint.xs"
              item-value="id"
              item-text="name"
              hide-details
              outlined
              placeholder="Решение по заявке"
              @change="updateStatus"
            >
              <template #item="{ item }">
                <CustomChip :color="StatusColor[item.id.toUpperCase()]">{{
                  item.name
                }}</CustomChip>
              </template>
            </v-select>
          </template>
        </v-col>
      </v-row>
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
  computed: {
    canSeeExaminations() {
      return this.application.type === 'pony_club'
    },
    availableStatuses() {
      const examinationStatuses = [
        'invitation_to_entrance_examinations',
        'approved_by_examinations',
        'rejected_by_examinations',
        'missing_on_examinations',
      ]
      const noExaminationStatuses = ['invitation_to_class']
      if (this.isAdmin) {
        const statusKeys = Object.keys(this.StatusBtnColor)
        if (this.canSeeExaminations) {
          return this.statuses.filter(
            (status) =>
              statusKeys.includes(status.id.toUpperCase()) &&
              !noExaminationStatuses.includes(status.id)
          )
        }
        return this.statuses.filter(
          (status) =>
            statusKeys.includes(status.id.toUpperCase()) &&
            !examinationStatuses.includes(status.id)
        )
      }
      return this.statuses.filter((status) =>
        this.application.possible_next_statuses.includes(status.id)
      )
    },
  },
  mounted() {
    if (this.isAdmin) {
      this.getModerators()
    }
    this.getStatuses()
    this.getGroups()
    this.getApplication()
  },
  methods: {
    async getApplication() {
      try {
        const data = await this.$api.applications.get(this.$route.params.id)
        this.application = {
          ...data,
          receipt_documents_at: this.parseInvertedDateFromExtended(
            data.receipt_documents_at
          ),
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
    async updateStatus(newStatus) {
      try {
        const confirm = await this.$modal.show('confirm', {
          message: 'Вы уверены, что хотите изменить статус заявки?',
        })
        if (!confirm) {
          return
        }
        const params = {
          status: newStatus,
        }
        if (this.application.comment !== null) {
          params.comment = this.application.comment
        }
        if (this.application.responsible) {
          params.responsible_id = this.application.responsible.id
        }
        switch (newStatus) {
          case Status.INVITATION_TO_ENTRANCE_EXAMINATIONS:
            params.examination_date = this.prepareDateTime(
              this.examinations.date,
              this.examinations.time
            )
            params.group_id = this.examinations.group
            if (this.application.receipt_documents_at) {
              params.receipt_documents_at =
                this.application.receipt_documents_at
            }
            break
          case Status.APPROVED_BY_EXAMINATIONS:
            params.examination_date = this.prepareDateTime(
              this.classes.date,
              this.classes.time
            )
            params.group_id = this.classes.group
            break
          case Status.INVITATION_TO_CLASS:
            params.examination_date = this.prepareDateTime(
              this.classes.date,
              this.classes.time
            )
            params.group_id = this.classes.group
            if (this.application.receipt_documents_at) {
              params.receipt_documents_at =
                this.application.receipt_documents_at
            }
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
        this.$router.push('/')
      } catch (err) {
        this.$modal.show('error', {
          title: 'Произошла ошибка!',
          message: 'Изменения по заявке не были сохранены',
        })
      }
    },
    async saveApplication() {
      try {
        const params = {}
        if (this.application.comment !== null) {
          params.comment = this.application.comment
        }
        if (this.application.responsible) {
          params.responsible_id = this.application.responsible.id
        }
        if (
          this.application.status === Status.DOCUMENTS_REQUEST.toUpperCase()
        ) {
          params.receipt_documents_at = this.application.receipt_documents_at
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
  display: grid;
  grid-template-columns: 200px auto;
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

@media (max-width: map-get($grid-breakpoints, 'md')) {
  .application-info {
    grid-template-columns: auto;
    gap: 0;

    &__row {
      grid-column-start: 1;
      grid-column-end: 2;
    }

    > :nth-child(2n) {
      margin-bottom: 10px;
    }
  }
}
</style>
