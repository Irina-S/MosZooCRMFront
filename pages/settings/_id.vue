<template>
  <div>
    <div class="d-flex align-center mb-7">
      <v-icon
        class="text--default mr-3 mt-n1"
        @click="$router.push('/settings')"
        >mdi-chevron-left</v-icon
      >
      <h1
        class="font-weight-bold"
        :class="
          !$vuetify.breakpoint.xs
            ? 'font-weight-bold text--enlarged'
            : 'text--normal'
        "
      >
        {{ title }}
      </h1>
    </div>
    <v-form class="mb-15">
      <v-row class="justify-space-between mx-n6 mb-6">
        <v-col cols="12" md="4" class="d-flex flex-column justify-end px-6">
          <div
            class="mb-2"
            :class="$vuetify.breakpoint.mdAndDown ? 'text--small' : ''"
          >
            Дата и время начала приема заявок
          </div>
          <v-row class="mx-n2">
            <v-col cols="6" class="px-2">
              <CustomDatePicker v-model="startDate" />
            </v-col>
            <v-col cols="6" class="px-2"
              ><CustomTimePicker v-model="startTime"
            /></v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="4" class="d-flex flex-column justify-end px-6">
          <div
            class="mb-2"
            :class="$vuetify.breakpoint.mdAndDown ? 'text--small' : ''"
          >
            Дата и время окончания приема заявок
          </div>
          <v-row class="mx-n2">
            <v-col cols="6" class="px-2">
              <CustomDatePicker v-model="endDate" />
            </v-col>
            <v-col cols="6" class="px-2"
              ><CustomTimePicker v-model="endTime"
            /></v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="4" class="d-flex flex-column justify-end px-6">
          <div
            class="mb-2"
            :class="$vuetify.breakpoint.mdAndDown ? 'text--small' : ''"
          >
            ФИО ответственного по умолчанию
          </div>
          <v-row class="mx-n2">
            <v-col cols="12" class="px-2">
              <v-select
                v-model="responsibleId"
                :items="moderators"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  class: 'responsible-select__menu',
                }"
                item-text="name"
                item-value="id"
                placeholder="Выберите"
                outlined
                dense
                hide-details
                class="responsible-select"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div class="mb-6">
        <div>Текст шаблонов писем для рассылки Клиенту</div>
        <div v-if="vars">
          <span class="d-block mb-1"
            >Доступные для использования в шаблонах переменные:</span
          >
          <span
            v-for="(value, key, idx) in vars"
            :key="`var-${idx}`"
            class="d-block"
          >
            {{ key }} - {{ value }}
          </span>
          <span class="d-block mt-1">
            (*) означает, что переменная может быть не использована
          </span>
        </div>
      </div>
      <div>
        <template v-if="templates">
          <div v-for="tmp in templates" :key="tmp.name" class="mb-6">
            <div class="d-flex align-center font-weight-bold mb-1">
              {{ tmp.title ? `Статус ${tmp.title}` : 'Уведомление' }}
              <v-checkbox
                v-model="tmp.active"
                hide-details
                label="Активен"
                class="font-weight-regular d-inline-block ml-3 mt-0 mb-1"
              />
            </div>
            <v-text-field
              v-model="tmp.value.greeting"
              placeholder="Заголовок"
              dense
              outlined
              hide-details
              class="settings-textarea mb-2"
            />
            <VueEditor
              v-model="tmp.value.text"
              :editorToolbar="$options.editorToolbarOptions"
              class="mb-2"
            />
          </div>
        </template>
        <template v-else>
          <div class="d-flex flex-column justify-center align-center py-10">
            <v-progress-circular
              :size="70"
              :width="5"
              color="primary"
              indeterminate
              class="mb-3"
            ></v-progress-circular>
            <span>Шаблоны писем загружаются...</span>
          </div>
        </template>
      </div>
      <div class="d-flex">
        <v-btn to="/settings" class="flex-grow-1 flex-sm-grow-0">
          Отменить
        </v-btn>
        <v-btn
          color="primary"
          class="flex-grow-1 flex-sm-grow-0 ml-3 ml-sm-7"
          @click="saveAll"
        >
          Сохранить
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import CustomDatePicker from '@/components/FormElements/CustomDatePicker'
import CustomTimePicker from '@/components/FormElements/CustomTimePicker'
import manuals from '@/mixins/manuals'
import datetime from '@/mixins/datetime'
import prepareParams from '@/mixins/prepareParams'
import { Status, StatusText } from '@/constants/Status'

export default {
  name: 'SectionSettingPage',
  components: { VueEditor, CustomDatePicker, CustomTimePicker },
  mixins: [manuals, datetime, prepareParams],
  editorToolbarOptions: [
    ['bold', 'italic', 'underline'], // toggled buttons
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['clean'],
  ],
  data() {
    return {
      Status,
      StatusText,
      type: null,
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      responsibleId: null,
      vars: null,
      templates: null,
      templateStatuses: null,
    }
  },
  head() {
    return { title: this.title ? `${this.title} - Настройки` : '' }
  },
  computed: {
    title() {
      return (
        this.sections.find((section) => section.id === this.type)?.name ?? ''
      )
    },
    defaultTemplates() {
      const examinationStatuses = [
        'invitation_to_entrance_examinations',
        'approved_by_examinations',
        'rejected_by_examinations',
        'missing_on_examinations',
      ]
      const noExaminationStatuses = ['invitation_to_class']
      const curSectionStatuses = Object.values(Status).filter((status) => {
        if (['pony_club'].includes(this.type)) {
          return !noExaminationStatuses.includes(status)
        }
        return !examinationStatuses.includes(status)
      })
      const templates = curSectionStatuses.map((status) => ({
        status,
        name: `${status}_${this.type}`,
        title: StatusText[status.toUpperCase()] || '',
      }))
      return templates
    },
  },
  async mounted() {
    this.getModerators()
    this.getSections()
    this.getAvailableVars()
    await this.getSetting()
    this.getTemplates()
  },
  methods: {
    async getAvailableVars() {
      try {
        const data = await this.$api.templates.getVars()
        this.vars = data
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    async getSetting() {
      try {
        const data = await this.$api.settings.get(this.$route.params.id)
        this.type = data.type
        this.startDate = this.parseInvertedDateFromExtended(data.start_at)
        this.startTime = this.parseShortTimeFromExtended(data.start_at)
        this.endDate = this.parseInvertedDateFromExtended(data.finish_at)
        this.endTime = this.parseShortTimeFromExtended(data.finish_at)
        this.responsibleId = data.default_responsible_id
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    async updateSetting() {
      await this.$api.settings.update(this.$route.params.id, {
        start_at: this.prepareDateTime(this.startDate, this.startTime),
        finish_at: this.prepareDateTime(this.endDate, this.endTime),
        default_responsible_id: this.responsibleId,
      })
    },
    async getTemplates() {
      try {
        const templateResults = await Promise.all(
          this.defaultTemplates.map((tmp) => this.$api.templates.get(tmp.name))
        )
        const statusResults = await Promise.all(
          this.defaultTemplates.map((tmp) =>
            this.$api.templates.getStatus(tmp.name)
          )
        )
        const availableTemplates = []
        this.defaultTemplates.forEach((tmp, idx) => {
          availableTemplates.push({
            ...tmp,
            value: templateResults[idx],
            active: statusResults[idx].active,
          })
        })
        this.templates = availableTemplates
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    async updateTemplates() {
      await Promise.all(
        this.templates
          .filter((tmp) => tmp.value.greeting && tmp.value.text)
          .map((tmp) => this.$api.templates.update(tmp.name, tmp.value))
      )
      await Promise.all(
        this.templates.map((tmp) =>
          this.$api.templates.updateStatus(tmp.name, { active: tmp.active })
        )
      )
    },
    async saveAll() {
      try {
        await this.updateTemplates()
        await this.updateSetting()
        this.$modal.show('success', {
          title: 'Изменения успешно сохранены!',
        })
        this.$router.push('/settings')
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.settings-textarea {
  max-height: 128px;

  ::v-deep {
    .v-input__slot {
      padding: 0 10px !important;

      textarea {
        font-size: 0.875rem !important;
        line-height: 1.5;
      }
    }
  }
}
</style>
