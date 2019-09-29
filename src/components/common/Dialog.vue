<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isVisible"
      @close="cancel"
      width="480px"
      >
      <slot></slot>
      <slot name="footer"></slot>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '提示'
      }
    },
    data() {
      return {
       isVisible: this.dialogVisible
      }
    },
    watch: {
      dialogVisible() {
        this.isVisible = this.dialogVisible
      }
    },
    methods: {
      cancel() {
        this.$emit('changeVisible', false)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>