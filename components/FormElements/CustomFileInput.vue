<template>
  <div v-cloak @drop.prevent="addDropFile" @dragover.prevent>
    <v-file-input
      ref="file-input"
      :value="files"
      :clearable="false"
      :accept="accept"
      small-chips
      multiple
      outlined
      single-line
      placeholder="Выберите файлы или перетащите файлы сюда"
      class="custom-file-input"
      :success="!$attrs['error-messages']"
      :error-messages="$attrs['error-messages']"
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
  </div>
</template>

<script>
export default {
  name: 'CustomFileInput',
  props: {
    accept: {
      type: String,
      default: '*',
    },
  },
  data() {
    return {
      files: [],
    }
  },
  methods: {
    onFileDelete(index) {
      this.files.splice(index, 1)
      this.$refs['file-input'].$emit('change', this.files)
      this.$emit('input', this.files)
    },
    onChange(files) {
      files.forEach((file) => {
        if (!this.files.includes(file)) {
          this.files.push(file)
        }
      })
      this.$emit('input', this.files)
    },
    addDropFile(evt) {
      this.onChange([...evt.dataTransfer.files])
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

    .v-input__prepend-outer,
    .v-input__append-inner {
      .v-icon {
        color: $text-color !important;
      }
    }
  }
}

@media (max-width: map-get($grid-breakpoints, 'sm')) {
  .custom-file-input {
    ::v-deep {
      .v-input__prepend-outer .v-icon {
        font-size: 18px !important;
      }

      .v-input__slot {
        padding: 0 20px !important;
      }

      .v-file-input__text {
        text-align: center;
      }
    }
  }
}
</style>
