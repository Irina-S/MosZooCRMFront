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
        <!-- <div v-if="vars">
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
        </div> -->
      </div>
      <div>
        <div v-for="tmp in availableTemplates" :key="tmp.template" class="mb-4">
          <div class="font-weight-bold mb-1">
            {{ tmp.text ? `Статус ${tmp.text}` : 'Уведомление' }}
          </div>
          <v-textarea
            v-model="templates[tmp.template]"
            rows="5"
            outlined
            no-resize
            hide-details
            class="settings-textarea"
          />
        </div>
      </div>
      <div class="d-flex">
        <v-btn to="/settings" class="flex-grow-1 flex-sm-grow-0">
          Отменить
        </v-btn>
        <v-btn
          color="primary"
          class="flex-grow-1 flex-sm-grow-0 ml-3 ml-sm-7"
          @click="updateSetting"
        >
          Сохранить
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import CustomDatePicker from '@/components/FormElements/CustomDatePicker'
import CustomTimePicker from '@/components/FormElements/CustomTimePicker'
import manuals from '@/mixins/manuals'
import datetime from '@/mixins/datetime'
import prepareParams from '@/mixins/prepareParams'
import { Status, StatusText } from '@/constants/Status'

export default {
  name: 'SectionSettingPage',
  components: { CustomDatePicker, CustomTimePicker },
  mixins: [manuals, datetime, prepareParams],
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
      templates: {},
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
    availableTemplates() {
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
        template: `${status}_${this.type}`,
        text: StatusText[status.toUpperCase()] || '',
      }))
      return templates
    },
  },
  mounted() {
    this.getModerators()
    this.getSections()
    this.getSetting()
    // this.getAvailableVars()
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
      try {
        await this.$api.settings.update(this.$route.params.id, {
          start_at: this.prepareDateTime(this.startDate, this.startTime),
          finish_at: this.prepareDateTime(this.endDate, this.endTime),
          default_responsible_id: this.responsibleId,
        })
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
