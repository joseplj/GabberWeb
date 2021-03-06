<template lang="pug">
box-layout(v-if="apiInProgress")
  loading(:label="$t('view.auth.accept_invite.loading_title')")

box-layout(v-else-if="!project || !user")
  section.section
    h1.title {{ $t('view.auth.accept_invite.bad_token_title') }}
    message.is-danger(v-model="apiErrors")

div(v-else-if="project && user")
  section.section
    .container
      .columns.is-centered.is-gapless
        .column.is-half.has-text-centered
          h1.title {{ $t('view.auth.accept_invite.title') }}
      .columns.is-centered.is-gapless
        .column.is-two-thirds
          project-pill(:project="project", readonly)
  
  box-layout.is-paddingless
    section.section
      h1.title {{ $t('view.auth.accept_invite.subtitle') }}
      h2.subtitle {{ $t('view.auth.accept_invite.info') }}
      message.is-danger(v-model="apiErrors", clearable)
      .field
        label.label {{ $t('view.auth.accept_invite.email_field.label') }}
        input.input(
          type="text",
          :value="user.email",
          :placeholder="$t('view.auth.accept_invite.email_field.placeholder')"
          disabled
        )
      .field
        label.label {{ $t('view.auth.accept_invite.name_field.label') }}
        input.input(
          type="text",
          v-model="fullname",
          :disabled="!canSubmit",
          :placeholder="$t('view.auth.accept_invite.name_field.placeholder')"
        )
      .field
        label.label {{ $t('view.auth.accept_invite.pass_field.label') }}
        input.input(
          type="password",
          v-model="password",
          :disabled="!canSubmit",
          :placeholder="$t('view.auth.accept_invite.pass_field.placeholder')",
          @keyup.enter="submit"
        )
      hr
      .buttons.is-centered
        button.button.is-success(@click="submit", :disabled="!canSubmit")
          span {{ $t('view.auth.accept_invite.submit_action') }}
</template>

<script>
import { LOGIN_USER } from '@/const/mutations'
import { SESSION_LIST_ROUTE } from '@/const/routes'

import ApiWorkerMixin from '@/mixins/ApiWorker'
import BoxLayout from '@/layouts/BoxLayout'
import Loading from '@/components/utils/Loading'
import Message from '@/components/utils/Message'
import ProjectPill from '@/components/project/ProjectPill'

export default {
  mixins: [ ApiWorkerMixin ],
  components: { BoxLayout, Loading, Message, ProjectPill },
  watch: {
    '$route.params.token' (newToken) {
      this.fetchInvite(newToken)
    }
  },
  data: () => ({
    project: null,
    user: null,
    fullname: '',
    password: ''
  }),
  computed: {
    canSubmit () { return !this.apiInProgress }
  },
  mounted () {
    this.fetchInvite(this.$route.params.token)
  },
  methods: {
    async fetchInvite (token) {
      this.startApiWork()
      
      let { meta, data } = await this.$api.getInvite(token)
      
      if (meta.success) {
        this.project = data.project
        this.user = data.user
        this.fullname = this.user.fullname
      }
      
      this.endApiWork(meta)
    },
    async submit () {
      if (!this.canSubmit) return
      this.startApiWork()
      
      let { meta, data } = await this.$api.acceptInvite(
        this.$route.params.token, this.fullname, this.password
      )
      
      if (meta.success) {
        this.$store.commit(LOGIN_USER, data)
        this.$router.push({
          name: SESSION_LIST_ROUTE,
          params: { project_id: this.project.id }
        })
      }
      
      this.endApiWork(meta)
    }
  }
}
</script>

<style lang="sass">

</style>
