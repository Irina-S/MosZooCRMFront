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
                canSeeExaminations && (isAdmin || canModeratorSeeExaminations)
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
            <template v-if="isAdmin || canModeratorSeeClasses">
              <div class="text--light">Дата и время занятия</div>
              <div class="d-flex justify-space-between">
                <CustomDatePicker
                  v-model="classes.date"
                  class="flex-grow-1 mr-2"
                />
                <CustomTimePicker v-model="classes.time" class="flex-grow-1" />
              </div>
            </template>
            <template v-if="canSeeGroup">
              <div class="text--light">Группа занятия</div>
              <div>
                <v-select
                  v-model="application.child_group_id"
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
            <div class="text--light">Дата рождения ребенка</div>
            <div class="font-weight-medium">
              {{
                application.child_birthday
                  ? parseDateFromExtended(application.child_birthday)
                  : '-'
              }}
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
            <div class="text--light">Приложение</div>
            <div class="d-flex flex-wrap align-start">
              <v-chip
                v-for="(file, idx) in application.files"
                :key="idx"
                :href="file"
                target="_blank"
                class="mr-2 mb-2"
                >{{ extractFileName(file) }}</v-chip
              >
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
        <v-col
          cols="12"
          md="5"
          class="order-first order-md-last d-flex flex-column-reverse d-md-block"
        >
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
          <div class="rounded-lg bg--gray px-3 mt-md-4 mb-4 mb-md-0">
            <v-expansion-panels
              v-model="logsExtensionPanels"
              accordion
              flat
              class="logs"
            >
              <v-expansion-panel>
                <v-expansion-panel-header
                  >Этапы обработки заявки</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <div
                    v-for="(evt, idx) in logs"
                    :key="`evt-${idx}`"
                    class="mb-4"
                  >
                    <div class="font-weight-bold">
                      {{ evt.event_name_as_string }}
                      {{
                        evt.event_name === LogType.STATUS_UPDATE
                          ? `- ${evt.status_as_string}`
                          : ''
                      }}
                    </div>
                    <div>
                      <template v-if="evt.event_name === LogType.CREATE">
                        Клиент - {{ evt.client_name }}.
                      </template>
                      <template
                        v-else-if="
                          evt.event_name === LogType.RESP_ADDED ||
                          evt.responsible_name
                        "
                      >
                        Ответственный - {{ evt.responsible_name }}.
                      </template>
                    </div>
                    <div class="text--light">
                      <span>{{ parseDateFromExtended(evt.time) }}</span>
                      <span class="ml-2">{{
                        parseTimeFromExtended(evt.time)
                      }}</span>
                    </div>
                    <div v-if="evt.changed_by" class="text--light">
                      {{ evt.changed_by }}
                    </div>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
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
import { LogType } from '@/constants/Logs'
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
      logsExtensionPanels: null,
      Status,
      StatusColor,
      StatusBtnColor,
      StatusBtnText,
      LogType,
      agreement: true,
      application: null,
      logs: [],
      examinations: {
        date: null,
        time: null,
      },
      classes: {
        date: null,
        time: null,
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
    canModeratorSeeExaminations() {
      return (
        (this.application.possible_next_statuses &&
          this.application.possible_next_statuses.includes(
            Status.INVITATION_TO_ENTRANCE_EXAMINATIONS
          )) ||
        this.hasExaminationDate
      )
    },
    canModeratorSeeClasses() {
      return (
        (this.application.possible_next_statuses &&
          (this.application.possible_next_statuses.includes(
            Status.INVITATION_TO_CLASS
          ) ||
            this.application.possible_next_statuses.includes(
              Status.APPROVED_BY_EXAMINATIONS
            ))) ||
        this.hasClassesDate
      )
    },
    canSeeGroup() {
      return (
        this.application.type === 'pony_club' &&
        (this.isAdmin ||
          [
            Status.DOCUMENTS_REQUEST,
            Status.INVITATION_TO_ENTRANCE_EXAMINATIONS,
            Status.APPROVED_BY_EXAMINATIONS,
            Status.COMPLETED,
            Status.REJECTED_BY_EXAMINATIONS,
            Status.MISSING_ON_EXAMINATIONS,
          ].includes(this.application.status.toLowerCase()))
      )
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
    hasExaminationDate() {
      return this.examinations.date && this.examinations.time
    },
    hasClassesDate() {
      return this.classes.date && this.classes.time
    },
  },
  mounted() {
    if (this.isAdmin) {
      this.getModerators()
    }
    this.getStatuses()
    this.getGroups()
    this.getLogs()
    this.getApplication()

    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
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
        if (data.type === 'pony_club') {
          this.examinations.date = this.parseInvertedDateFromExtended(
            data.examination_date
          )
          this.examinations.time = this.parseTimeFromExtended(
            data.examination_date,
            false
          )
          this.classes.date = this.parseInvertedDateFromExtended(
            data.first_lesson_date
          )
          this.classes.time = this.parseTimeFromExtended(
            data.first_lesson_date,
            false
          )
          return
        }
        this.classes.date = this.parseInvertedDateFromExtended(
          data.examination_date
        )
        this.classes.time = this.parseTimeFromExtended(
          data.examination_date,
          false
        )
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    async getLogs() {
      try {
        const { data } = await this.$api.logs.get(this.$route.params.id)
        this.logs = data.models
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
    extractFileName(fileUrl) {
      return fileUrl.split(/(\\|\/)/g).pop()
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
            if (this.application.child_group_id) {
              params.group_id = this.application.child_group_id
            }
            if (this.application.receipt_documents_at) {
              params.receipt_documents_at =
                this.application.receipt_documents_at
            }
            break
          case Status.APPROVED_BY_EXAMINATIONS:
            params.first_lesson_date = this.prepareDateTime(
              this.classes.date,
              this.classes.time
            )
            params.group_id = this.application.child_group_id
            break
          case Status.INVITATION_TO_CLASS:
            params.examination_date = this.prepareDateTime(
              this.classes.date,
              this.classes.time
            )
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
        this.getLogs()
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
        const params = {}
        if (this.application.comment !== null) {
          params.comment = this.application.comment
        }
        if (this.application.responsible) {
          params.responsible_id = this.application.responsible.id
        }
        if (
          this.application.status === Status.DOCUMENTS_REQUEST.toUpperCase() &&
          this.application.receipt_documents_at
        ) {
          params.receipt_documents_at = this.application.receipt_documents_at
        }
        await this.$api.applications.update(this.$route.params.id, params)
        this.getApplication()
        this.getLogs()
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
    onResize() {
      if (this.$vuetify.breakpoint.mdAndDown) {
        this.logsExtensionPanels = null
        return
      }
      this.logsExtensionPanels = 0
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

.logs {
  ::v-deep {
    .v-expansion-panel {
      background: transparent !important;

      &-header {
        min-height: unset !important;
        padding: 20px 0 !important;
        font-size: 1rem;
      }

      &-content__wrap {
        padding: 0 0 16px !important;
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
