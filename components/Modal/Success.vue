<template>
  <ModalWrapper
    :size="$vuetify.breakpoint.xs ? 'fullscreen' : 'normal'"
    :resolve="resolve"
    v-on="$listeners"
  >
    <template>
      <img src="@/assets/images/check.svg" alt="успешно" class="mb-4" />
      <div v-if="title" class="modal-header text-center mb-4">
        <h2 class="modal-title">{{ title }}</h2>
      </div>
      <div
        v-if="message"
        class="modal-content text-center"
        v-html="message"
      ></div>
    </template>
  </ModalWrapper>
</template>

<script>
export default {
  name: 'ModalSuccess',
  props: {
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    resolve: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
