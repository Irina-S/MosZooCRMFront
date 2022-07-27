<template>
  <ModalWrapper size="normal" :resolve="resolve" v-on="$listeners">
    <template #default="{ close }">
      <div v-if="title" class="modal-header text-center mb-4">
        <h2 class="modal-title">{{ title }}</h2>
      </div>
      <div
        v-if="message"
        v-html="message"
        class="modal-content text-center"
      ></div>
      <div class="modal-footer mt-7">
        <v-btn v-if="cancelButton" @click="close($event, false)">
          {{ cancelText }}
        </v-btn>
        <v-btn
          v-if="okButton"
          color="primary"
          class="ml-7"
          @click="close($event, true)"
        >
          {{ okText }}
        </v-btn>
      </div>
    </template>
  </ModalWrapper>
</template>

<script>
export default {
  name: 'ModalDefault',
  props: {
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    cancelButton: {
      type: Boolean,
      default: true,
    },
    cancelText: {
      type: String,
      default: 'Отмена',
    },
    okButton: {
      type: Boolean,
      default: true,
    },
    okText: {
      type: String,
      default: 'Сохранить',
    },
    resolve: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
