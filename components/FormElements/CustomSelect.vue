<template>
  <div class="custom-select px-2 pt-2">
    <v-combobox
      v-bind="$attrs"
      :attach="`#custom-select__options${_uid}`"
      :menu-props="{ value: true }"
      outlined
      dense
      hide-details
      v-on="$listeners"
      class="mb-2"
    >
      <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" />
    </v-combobox>
    <div
      ref="options"
      class="custom-select__options"
      :id="`custom-select__options${_uid}`"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'CustomSelect',
  methods: {},
}
</script>

<style lang="scss" scoped>
.custom-select {
  // position: relative;
  // max-height: 32px !important;
  // overflow: visible !important;
  max-width: 100%;
  background: #fff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  z-index: 100;

  ::v-deep {
    .v-input {
      font-size: 0.765rem;
    }

    .v-input__slot {
      min-height: 24px !important;
      height: 24px !important;
      padding: 10px 5px !important;

      input {
        padding: 0 !important;
      }
    }

    .v-input__append-inner {
      display: none !important;
    }

    .v-select__selections {
      padding: 0 !important;
    }

    fieldset {
      border: 1px solid #99a2ad !important;
      border-radius: 10px !important;
    }

    .v-menu__content {
      position: static;
      // top: 32px !important;
      max-width: 100%;
      box-shadow: none !important;

      .v-list {
        padding: 0 !important;

        &-item {
          min-height: 30px !important;
          padding: 0 !important;
          font-size: 0.765rem !important;

          &::before {
            display: none !important;
          }

          &__title {
            font-weight: 400 !important;
          }

          &__content {
            padding: 0 !important;
          }

          .v-ripple__container {
            display: none !important;
          }

          &:hover {
            .v-list-item__title {
              font-weight: 500 !important;
            }
          }
        }
      }
    }
  }
}
</style>
