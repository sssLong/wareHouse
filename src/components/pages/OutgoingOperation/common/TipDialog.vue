<template>
  <div>
     <el-dialog title="提示" :visible.sync="isVisible"  @close="cancel" :close-on-click-modal="false" class="errDialog" width="480px">
        <p class="showtoast">
            <span class="icon iconfont mr-10" style="color:#FF9F21"></span>{{content}}
        </p>
        <span slot="footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary"  @click="cancel">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props:{
      showtoast: {
        type: Boolean
      },
      content:{
        type: String
      }
    },
     data() {
      return {
       isVisible: this.showtoast
      }
    },
    watch: {
      showtoast() {
        this.isVisible = this.showtoast
      }
    },
    methods: {
      // 取消
      cancel() {
        this.$emit('changeShowtoast', false)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>