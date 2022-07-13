<template>
  <v-chip class="custom-chip" v-bind="$attrs" v-on="$listeners"
    ><slot></slot
  ></v-chip>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.custom-chip {
  &.theme--light.v-chip:not(.v-chip--active) {
    background: #ccd4df;
  }

  &:hover::before {
    display: none !important;
  }

  &.v-size--default {
    border-radius: 10px !important;
  }

  &.v-size--small {
    border-radius: 4px !important;
    height: 18px !important;
    padding: 2px 4px !important;
  }
}
</style>
