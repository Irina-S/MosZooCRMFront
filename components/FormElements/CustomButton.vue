<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    class="custom-button px-3 py-4"
    :class="{
      'custom-button--active': active,
      'custom-button--disabled': $attrs.disabled,
    }"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-button {
  border: none;
  outline: none;
  background: #d2d9d8;
  border-radius: 10px;
  color: #044947;
  font-family: 'ALS Story', sans-serif;
  font-size: 24px;
  line-height: 24px;
  font-style: normal;
  font-weight: 800;
  transition: 0.3s;

  &--active {
    background: #f5e646;
  }

  &--disabled {
    cursor: default;
  }
}
</style>
