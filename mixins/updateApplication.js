export default {
  data() {
    return {
      moderators: {
        items: [],
        page: 1,
      },
    }
  },
  methods: {
    async getModerators() {
      try {
        const { data } = await this.$api.manuals.getModerators({
          page: this.moderators.page,
        })
        if (this.moderators.page === 1) {
          this.moderators.items = []
        }
        this.moderators.items.push(...data.models)
        this.moderators.total = data.meta.total
        if (data.meta.total > data.meta.count) {
          this.moderators.page++
          setTimeout(this.getModerators, 0)
        }
      } catch (err) {
        this.$modal.show('error', { err })
      }
    },
    async updateResponsible(application, responsible) {
      try {
        application.isResponsibleEditing = false
        application.isResponsibleLoading = true
        await this.$api.applications.update(application.id, {
          responsible_id: responsible.id,
        })
        application.responsible_name = responsible.name
        this.$modal.show('success', {
          title: 'Изменения по заявке были сохранены!',
        })
      } catch (err) {
        this.$modal.show('error', {
          title: 'Произошла ошибка!',
          message: 'Изменения по заявке не были сохранены',
        })
      } finally {
        application.isResponsibleLoading = false
      }
    },
    async updateComment(application, comment) {
      try {
        application.isCommentEditing = false
        application.isCommentLoading = true
        await this.$api.applications.update(application.id, {
          comment,
        })
        application.comment = comment
        application.commentEditing = ''
        this.$modal.show('success', {
          title: 'Изменения по заявке были сохранены!',
        })
      } catch (err) {
        this.$modal.show('error', {
          title: 'Произошла ошибка!',
          message: 'Изменения по заявке не были сохранены',
        })
      } finally {
        application.isCommentLoading = false
      }
    },
  },
}
