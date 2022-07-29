<template>
  <div
    class="custom-select__wrapper mt-3"
    :class="hasGrayBg ? 'custom-select--gray' : ''"
    @click.stop
  >
    <vue-select
      ref="select"
      v-bind="$attrs"
      class="custom-select"
      @close="$emit('cancel')"
      v-on="$listeners"
    >
      <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
      <template v-for="(_, slot) of $scopedSlots" #[slot]="scope"
        ><slot :name="slot" v-bind="scope"
      /></template>
    </vue-select>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
  name: 'CustomSelect',
  components: { vueSelect: vSelect },
  props: {
    hasGrayBg: {
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
    this.$refs.select.open = true
    this.$el.querySelector('input').focus()
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.custom-select {
  &__wrapper {
    width: 100%;
  }

  ::v-deep {
    .vs__actions {
      display: none;
    }

    .vs__dropdown-menu {
      padding: 0;
      border: none;
      border-radius: 0 0 5px 5px;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    }

    .vs__dropdown-option {
      padding: 6px 12px;

      &--highlight {
        background: transparent;
        color: $text-color;
        font-weight: 700;
      }
    }

    .vs__selected-options {
      height: 24px;
      margin: 8px;
      font-size: 0.765rem;
      padding: 0 5px !important;
      border: 1px solid #99a2ad !important;
      border-radius: 10px !important;
      background: #fff;

      input {
        margin-top: 0;
        font-size: 0.765rem;
      }
    }

    .vs__dropdown-toggle {
      padding-bottom: 0;
      border: none;
      border-radius: 5px 5px 0 0;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    }
  }

  &--gray {
    ::v-deep {
      .vs__dropdown-toggle,
      .vs__dropdown-menu {
        background: $medium-gray;
      }
    }
  }
}

.bg--gray {
  background: $medium-gray;
}
</style>
