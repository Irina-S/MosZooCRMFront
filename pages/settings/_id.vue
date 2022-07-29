<template>
  <div>
    <div class="d-flex align-center mb-7">
      <v-icon
        class="text--default mr-3 mt-n1"
        @click="$router.push('/settings')"
        >mdi-chevron-left</v-icon
      >
      <h1 class="font-weight-bold text--enlarged">Пони-клуб</h1>
    </div>
    <v-form class="mb-15">
      <v-row class="justify-space-between mx-n7 mb-6">
        <v-col cols="4" class="px-7">
          <div class="mb-2">Дата и время начала приема заявок</div>
          <v-row class="mx-n2">
            <v-col cols="6" class="px-2">
              <CustomDatePicker />
            </v-col>
            <v-col cols="6" class="px-2"><CustomTimePicker /></v-col>
          </v-row>
        </v-col>
        <v-col cols="4" class="px-7">
          <div class="mb-2">Дата и время окончания приема заявок</div>
          <v-row class="mx-n2">
            <v-col cols="6" class="px-2">
              <CustomDatePicker />
            </v-col>
            <v-col cols="6" class="px-2"><CustomTimePicker /></v-col>
          </v-row>
        </v-col>
        <v-col cols="4" class="px-7">
          <div class="mb-2">ФИО ответственного по умолчанию</div>
          <v-row class="mx-n2">
            <v-col cols="12" class="px-2">
              <v-select
                :items="[]"
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
      <div class="mb-6">Текст шаблонов писем для рассылки Клиенту</div>
      <div>
        <div class="mb-4">
          <div class="font-weight-bold mb-1">Уведомление</div>
          <v-textarea
            rows="5"
            outlined
            no-resize
            hide-details
            class="settings-textarea"
          />
        </div>
        <div class="mb-4">
          <div class="font-weight-bold text--small mb-1">Статус Принята</div>
          <v-textarea
            rows="5"
            outlined
            no-resize
            hide-details
            class="settings-textarea"
          />
        </div>
        <div class="mb-4">
          <div class="font-weight-bold text--small mb-1">
            Статус Аннулирована
          </div>
          <v-textarea
            rows="5"
            outlined
            no-resize
            hide-details
            class="settings-textarea"
          />
        </div>
        <div class="mb-4">
          <div class="font-weight-bold text--small mb-1">Статус Дубликат</div>
          <v-textarea
            rows="5"
            outlined
            no-resize
            hide-details
            class="settings-textarea"
          />
        </div>
        <div class="mb-4">
          <div class="font-weight-bold text--small mb-1">
            Статус Отклонена (группа укомплектована)
          </div>
          <v-textarea
            rows="5"
            outlined
            no-resize
            hide-details
            class="settings-textarea"
          />
        </div>
        <div class="mb-4">
          <div class="font-weight-bold text--small mb-1">
            Статус Запрос документов
          </div>
          <v-textarea
            rows="5"
            outlined
            no-resize
            hide-details
            class="settings-textarea"
          />
        </div>
        <div class="mb-4">
          <div class="font-weight-bold text--small mb-1">
            Статус Отклонена (отсутствуют документы)
          </div>
          <v-textarea
            rows="5"
            outlined
            no-resize
            hide-details
            class="settings-textarea"
          />
        </div>
        <div class="mb-4">
          <div class="font-weight-bold text--small mb-1">
            Статус Приглашение на в/и
          </div>
          <v-textarea
            rows="5"
            outlined
            no-resize
            hide-details
            class="settings-textarea"
          />
        </div>
        <div class="mb-4">
          <div class="font-weight-bold text--small mb-1">
            Статус Неявка на в/и
          </div>
          <v-textarea
            rows="5"
            outlined
            no-resize
            hide-details
            class="settings-textarea"
          />
        </div>
        <div class="mb-4">
          <div class="font-weight-bold text--small mb-1">
            Статус Одобрена (по итогам в/и)
          </div>
          <v-textarea
            rows="5"
            outlined
            no-resize
            hide-details
            class="settings-textarea"
          />
        </div>
        <div class="mb-4">
          <div class="font-weight-bold text--small mb-1">
            Статус Отклонена (по итогам в/и)
          </div>
          <v-textarea
            rows="5"
            outlined
            no-resize
            hide-details
            class="settings-textarea"
          />
        </div>
      </div>
      <div class="d-flex">
        <v-btn> Отменить </v-btn>
        <v-btn color="primary" class="ml-7"> Сохранить </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import CustomDatePicker from '@/components/FormElements/CustomDatePicker'
import CustomTimePicker from '@/components/FormElements/CustomTimePicker'
import manuals from '@/mixins/manuals'

export default {
  name: 'SectionsSettingsPage',
  components: { CustomDatePicker, CustomTimePicker },
  mixins: [manuals],
  head() {
    return { title: 'Пони-клуб' }
  },
  mounted() {
    this.getModerators()
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
