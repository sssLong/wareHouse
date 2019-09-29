<template>
  <div class="tag-select" :class="{ 'placeholder': !tagData.length }">
    <span
      class="tag-item"
      :class="{'active': activeIndex === index, 'noclick': noclick}"
      v-for="(item, index) in tagData"
      :key="item.label"
      @click="itemClick(item, index)">
        <span class="text">{{item.label}}</span>
        <i class="el-tag__close el-icon-close" @click.stop="itemDelete(item, index)"></i>
    </span>
  </div>
</template>

<script>
  export default {
    name: "TagSelect",
    data () {
      return {
        activeIndex: ''
      }
    },
    props: {
      noclick: {
        type: Boolean,
        default: false
      },
      tagData: {
        type: Array
      }
    },
    methods: {
      itemClick(item, index) {
        this.activeIndex = index
        this.$emit('item-click', item, index)
      },
      itemDelete(item, index) {
        this.$emit('item-delete', item, index)
        if(this.activeIndex === index) {
          this.activeIndex = ''
        } else if(this.activeIndex > index) {
          this.activeIndex--
        }
        this.tagData.splice(index, 1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tag-select {
    padding: 2px;
    cursor: default;
    display: flex;
    flex-flow: wrap;
    &.placeholder:after {
      content: '请先添加渠道';
      color: #999;
      margin-left: 5px;
    }
    .tag-item {
      margin: 2px;
      box-sizing: border-box;
      display: inline-block;
      border-radius: 4px;
      padding: 0 8px;
      background-color: #f0f2f5;
      &.active:not(.noclick) {
        background-color: #3095fb;
        .text{
          color: #FFF;
        }
        .el-icon-close {
          background-color: #FFF;
          color: #3095fb;
          &:hover{
            font-weight: 700;
            background-color: #FFF;
          }
        }
      }
      .text {
        font: 12px 'PingFangSC-Regular';
        color: #5A5E66;
        line-height: 24px;
      }
      .el-icon-close {
        background-color: #c0c4cc;
        color: #FFF;
        padding: 1px;
        font-size: 12px;
        text-align: center;
        border-radius: 50%;
        cursor: pointer;
        &:hover{
          background-color: #9599a2;
        }
      }
    }
  }
</style>
