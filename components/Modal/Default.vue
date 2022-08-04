<template>
  <ModalWrapper
    :size="$vuetify.breakpoint.xs ? 'fullscreen' : size"
    :resolve="resolve"
    v-on="$listeners"
  >
    <template #default="{ close }">
      <div v-if="title" class="modal-header text-center mb-4">
        <h2 class="modal-title">{{ title }}</h2>
      </div>
      <div class="modal-content text-center" v-html="message"></div>
      <div class="modal-footer">
        <BButton
          v-if="cancelButton"
          variant="danger"
          @click="close($event, false)"
          >{{ cancelText }}</BButton
        >
        <BButton
          v-if="okButton"
          variant="primary"
          @click="close($event, true)"
          >{{ okText }}</BButton
        >
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
    size: {
      type: String,
      default: 'normal',
    },
    cancelButton: {
      type: Boolean,
      default: false,
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
      default: 'Ok',
    },
    resolve: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
