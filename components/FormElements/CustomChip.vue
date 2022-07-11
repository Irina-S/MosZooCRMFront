<template>
  <v-chip v-bind="$attrs" v-on="$listeners" class="custom-chip"
    ><slot></slot
  ></v-chip>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.custom-chip {
  background: #ccd4df !important;

  &:hover::before {
    display: none !important;
  }

  &.v-size--default {
    border-radius: 10px;
  }
}
</style>
