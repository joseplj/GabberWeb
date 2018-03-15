<template lang="pug">
.topic-list-edit
  label.label Topics
  p.help(v-if="isEditing")
    | WARNING &ndash; Editing these topics will update the topics for existing gabbers
  p.help(v-else) Add topics for people to discuss in their Gabbers
  .field.has-addons(v-for="topic, index in value", :class="topicClasses(topic)")
    .control
      div.button.is-static(tabindex="-1") {{ index + 1 }}.
    .control.is-expanded
      input.input.topic-input(
        ref="inputs",
        type="text",
        v-model="topic.text",
        @keyup.enter="addAnotherIfLast",
        @keyup.up.prevent.stop="navUp",
        @keyup.down.prevent.stop="navDown",
        placeholder="A topic about ..."
      )
    .control.toggle-control
      template(v-if="topic.is_active === 1")
        button.button.is-success(@click="removeTopic(topic)")
          fa(icon="toggle-on", fixed-width)
      template(v-else-if="topic.is_active === 0")
        button.button.is-danger(@click="restoreTopic(topic)")
          fa(icon="toggle-off", fixed-width)
      template(v-else)
        button.button.is-danger(@click="deleteTopic(topic)")
          fa(icon="trash", fixed-width)
  .buttons.is-centered
    button.button.is-primary.is-rounded(@click="addTopic")
      .icon: fa(icon="plus")
      span Add Topic
</template>

<script>
export default {
  props: {
    value: { type: Array, required: true },
    isEditing: { type: Boolean, default: false }
  },
  methods: {
    topicClasses (topic) {
      return { inactive: topic.is_active === 0 }
    },
    removeTopic (topic) {
      topic.is_active = 0
      this.$forceUpdate()
    },
    deleteTopic (topic) {
      this.$emit('input', this.value.filter(t => t !== topic))
    },
    restoreTopic (topic) {
      topic.is_active = 1
      this.$forceUpdate()
      // this.$emit('input', this.value.filter(t => t !== topic))
    },
    addTopic () {
      // Add a new topic which is neither active or inactive
      this.$emit('input', this.value.concat([
        { text: '', is_active: undefined }
      ]))
      
      // Focus the input on the next tick
      this.$nextTick(() => {
        this.$refs.inputs[this.$refs.inputs.length - 1].focus()
      })
    },
    addAnotherIfLast (event) {
      let index = this.indexOfInput(event.target)
      if (index === this.$refs.inputs.length - 1) {
        this.addTopic()
      }
    },
    indexOfInput (target) {
      return this.$refs.inputs.findIndex(input => input === target)
    },
    navUp (event) {
      this.navBy(-1)
    },
    navDown (event) {
      this.navBy(1)
    },
    navBy (change) {
      let index = this.indexOfInput(event.target)
      if (index === -1) return
      
      let newIndex = index + change
      if (newIndex < 0 || newIndex >= this.$refs.inputs.length) return
      
      let next = this.$refs.inputs[newIndex]
      next.focus()
      next.selectionStart = next.value.length
    }
  }
}
</script>

<style lang="sass">

.topic-list-edit
  
  $duration: 0.3s
  
  .help
    margin-bottom: 1em
    padding: 0.5em
    border-left: 3px solid $white
    background-color: rgba(255,255,255, 0.1)
  
  .field
    opacity: 1
    transition: opacity $duration
  
  .field.inactive
    opacity: 0.7
    .input
      text-decoration: line-through
  
  .toggle-control button
    transition: background-color $duration, border-color $duration

</style>