<template lang="pug">
  a.recommendation.box(:href="url")
    .columns.is-mobile.is-vcentered
      .column.is-narrow.logo-column.is--one-fifth-mobile
        img.project-logo(:src="session.image")
      .column.has-text-left.is-clipped
        h3.project-title.is-size-4.has-text-weight-bold.is-size-6-mobile.is-text-overflow {{ sessionTitle }}
        .level.is-mobile
          .level-left.is-size-7
            .level-item.is-2
              .icon: fa(icon="comment")
              span {{ session.comments }} {{$t('view.project.session_detail.annotations_title')}}
            .level-item.is-2.is-hidden-touch
              .icon: fa(icon="users")
              span {{ session.participants }} {{$t('comp.session.session_info_sidebar.members_label')}}
            .level-item.is-2
              .icon: fa(icon="globe")
              span {{ session.lang }}
</template>

<script>
export default {
  props: { session: { type: Object, required: true } },
  computed: {
    sessionTitle () {
      let lang = this.$store.getters.currentLocale !== undefined ? this.$store.getters.currentLocale.code : 'en'
      let itemLang = this.session.content.find(i => i.lang === lang)
      return (itemLang === undefined) ? this.session.content[0].title : itemLang.title
    },
    url () { return `${window.location.origin}/projects/${this.session.pid}/conversations/${this.session.id}` }
  }
}
</script>

<style lang="sass" scoped>
  .right-pad
    padding-right: 1em
  .is-text-overflow
    flex: 1
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
  .box
    margin-bottom: .75em !important
  .logo-column
    padding: 1em 0 .5em 1em
  .project-logo
    max-width: 55px
    max-height: 55px
  .project-title
    padding-right: .25em
  .recommendation
    transition: transform .3s ease
    padding: .5em !important
  .recommendation:hover
    border: 0 !important
    transform: scale(1.015)
    filter: drop-shadow(0 1px 2px rgba(0,0,0,.5))
</style>
