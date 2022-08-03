<template>
  <button
    v-bind="$attrs"
    class="custom-button px-3 py-4"
    :class="{
      'custom-button--active': active,
      'custom-button--disabled': $attrs.disabled,
    }"
    v-on="$listeners"
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
  line-height: 1;
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

@media (max-width: map-get($grid-breakpoints, 'sm')) {
  .custom-button {
    font-size: 1.14rem;
  }
}
</style>
