<!--底部按钮公用组件
  修改时间：2019.6.18 18：30
  修改人：廖佳新
-->
<!-- 只有返回按钮
  <V-BottomBtn routerTO="返回路径"></V-BottomBtn> 
-->
<!-- 有其他功能按钮案例如下
  <V-BottomBtn routerTO="返回路径" :buttonList="buttonList" :noBack="noBack" @confirm="save"></V-BottomBtn> 

    buttonList:[
      {
        name:'修改',    //按钮名称
        type:true,    //是否为主按钮-可不传
        emitType:'confirm',    //方法
        disabState:false //禁用状态 -可不传
      },
    ],
    noBack: true,   // 为true时不需要返回按钮,可不传

-->
<template>
  <div class="bottomBtn">
      <el-button :type="buttonList?'':'primary'" @click="_goBack" v-if="!noBack">返回</el-button>
      <el-button 
        v-for="(item,index) in buttonList"
        :key="index"
        :type="item.type?'primary':''"
        @click.native.prevent="_confirm(item.name)"
         :disabled="item.disabState"
        v-if="item.isDisplay === undefined || item.isDisplay === true"
      >
        {{item.name}}
      </el-button>
  </div>
</template>

<script>
export default {
  props:{
    buttonList:{
      type: Array
    },
    noBack:{
      type:Boolean
    },
    routerTO:{
      type:String
    }
  },

  data () {
    return {
    };
  },

  methods: {
    // 子传父
    _confirm(val){
      for (let i = 0; i < this.buttonList.length; i++) {
        const v = this.buttonList[i];
        if(v.name===val){
          this.$emit(v.emitType)
          break
        }
      }
    },
    _goBack(){
      if(this.routerTO){
        this.$router.push(this.routerTO)
      }else{
        this.$router.go(-1)
      }
    }
  },
  mounted(){
    this.$nextTick(()=>{
      let bottomParen = document.getElementsByClassName('bottomBtn')[0].parentNode
      bottomParen.style.paddingBottom = '30px'
    })
  },
  created(){
  },
  computed: {},
}

</script>
<style lang='scss' scoped>
// 固定底部按钮样式
.bottomBtn{
  background-color: #FFF;
  width: calc(100% - 200px);
  padding:12px 0px 8px 0px;
  position: fixed;
  z-index: 999;
  text-align: center;
  bottom:0px;
  left: 200px;
  box-shadow:0 0px 3px #999 inset;
  .el-button{min-width: 90px;padding-left:20px;padding-right: 20px;margin: 0px 10px;}
}
</style>
