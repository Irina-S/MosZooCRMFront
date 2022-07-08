<template>
  <!-- <validation-provider v-slot="{ errors }" rules="size:2048"> -->
  <v-file-input
    :value="files"
    ref="file-input"
    :clearable="false"
    counter
    show-size
    small-chips
    multiple
    outlined
    single-line
    placeholder="Выберите файлы или перетащите файлы сюда"
    class="custom-file-input"
    @change="onChange"
  >
    <template #selection="{ index, text }">
      <v-chip :label="false" small class="custom-file-input__chip ml-0">
        <span class="pr-2">
          {{ text }}
        </span>
        <v-icon small class="text--default" @click.stop="onFileDelete(index)">
          $delete
        </v-icon>
      </v-chip>
    </template>
  </v-file-input>
  <!-- <div class="task-modal__files-error error--text">
      {{ errors[0] }}
    </div> -->
  <!-- </validation-provider> -->
</template>

<script>
export default {
  name: 'CustomFileInput',
  data() {
    return {
      files: [],
    }
  },
  methods: {
    onFileDelete(index) {
      this.files.splice(index, 1)
      this.$refs['file-input'].$emit('change', this.files)
    },
    onChange(files) {
      files.forEach((file) => {
        if (!this.files.includes(file)) {
          this.files.push(file)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-file-input {
  &__chip {
    background: #ccd4df !important;
  }

  ::v-deep {
    .v-file-input {
      &__text--placeholder {
        font-size: 15px !important;
        line-height: 18px !important;
        color: $text-color-link !important;
      }
    }

    .v-input__slot {
      cursor: pointer !important;

      fieldset {
        border: 0.5px dashed $button-color-primary !important;
      }
    }

    .v-text-field__details {
      display: none;
    }

    .v-input__prepend-outer,
    .v-input__append-inner {
      .v-icon {
        color: $text-color !important;
      }
    }
  }
}
</style>
