<template>
  <div
    class="custom-select px-2 pt-2"
    :class="fixed ? 'position--fixed' : ''"
    :style="{ top, left, maxWidth }"
  >
    <v-combobox
      v-bind="$attrs"
      :attach="`#custom-select__options${_uid}`"
      :menu-props="{ value: true }"
      outlined
      dense
      hide-details
      class="mb-2"
      v-on="$listeners"
    >
      <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
    </v-combobox>
    <div
      ref="options"
      :id="`custom-select__options${_uid}`"
      class="custom-select__options"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'CustomSelect',
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      top: 0,
      left: 0,
      maxWidth: '100%',
    }
  },
  mounted() {
    // console.dir(this.$el)
    const { x, y, width } = this.$el.parentElement.getBoundingClientRect()
    // console.log(this.$el.parentElement)
    // console.log(this.$el.parentElement.getBoundingClientRect())
    this.top = `${y}px`
    this.left = `${x}px`
    this.maxWidth = `${width * 0.98}px`
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.custom-select {
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
      background: #fff;
    }

    .v-list {
      background: none;
    }

    .v-menu__content {
      position: static;
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
