<template>
  <div class="container">
    <div class="header-container base-container">
      <V-Title title="多品播种"></V-Title>
      <div class="condition">
        <el-select
          filterable
          v-model="queryOption.warehouseCode"
          placeholder="仓库名称"
        >
          <el-option
            v-for="item in warehouseList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select style="width:150px" v-model="queryOption.car"  
          filterable placeholder="请选择播种车">
          <el-option
            v-for="item in MaBiaoObj.sowing_truckList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <!-- * 拣货 仓库编码+PL+年[后两位]+月+日+6位流水 -->
        <el-input clearable v-model.trim="inputContent" ref="input1" @keydown.native='scanEnter' class="seachInput mr-10" placeholder="扫描拣货单号/容器编号"></el-input>
        <span class="reset" @click="reset">重置</span>
      </div>
    </div>
    <div class="table-container">
      <div class="table-operation">
        <div class="title">播种操作列表</div>
      </div>
      <!-- 引入表格公共组件 START -->
      <V-Table
        :dataSource="dataSource"
      ></V-Table>
      <!-- 引入表格公共组件 END -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { MultipleSowing } from "./cols";
export default {
  name: "OutgoingOperation_MultipleSowing",
  data() {
    return {
      order: "", //运单号
      inputContent: "", // 输入框的值 1PL190710304192  1PL190710465302 1PL190710501483
      dataSource: {
        data: [], // 表格数据
        cols: MultipleSowing, // 表格的列数据
        idIndex: true,
        loading: false, // loading
      },
      queryOption: {
        warehouseCode: "",
        car: ""
      }
    };
  },
  async created() {
    const {data} = await this.getWareHouse(); // 仓库数据
    if(data && data.length>0){
      this.queryOption.warehouseCode = data[0].dataCode
    }
    await this.getMoreMaList("sowing_truck","package_type","picking_status");
    // let sowing_truckList = this.MaBiaoObj['sowing_truckList'];
    // if(sowing_truckList && sowing_truckList.length>0) {
    //   this.queryOption.car = sowing_truckList[0].dataCode
    // }
  },
   activated(){
     this.$refs.input1.focus()
  },
  methods: {
    afterScan() {
      this.pickingNum = ""
      this.container = ""
      // 为true 说明是拣货单 否则是容器号
      let flag =this.$utils.module.isPickingNum(this.inputContent,this.warehouseList)
      if(flag){
        this.queryOption.pickingNum = this.inputContent
      }else{
        this.queryOption.container = this.inputContent
      }
      this.getSowingList()
    },
    // 多品播种操作列表扫描拣货单 + 容器号 获取播种列表
    async getSowingList() {
      this.$set(this.dataSource, "loading", true);
      if(!this.inputContent) return
      const {errorCode, data} = await this.$api.OutgoingOperation.getSowingList(this.queryOption)
      this.$set(this.dataSource, "loading", false);
      if(errorCode === '100200'){
        this.dataSource.data = data
        localStorage.setItem('sowingList',JSON.stringify(data))
        let isPicking = this._isPicking(data)
        if(isPicking) { // 待拣货或者拣货中 提示 不跳转 播种页面
          this.$utils.commonUtils.tip('拣货单未完成无法进行播种','error')
        }else{
          this.carSubmit()
        }
        
      }
    },
    // 播种车提交更新数据!
    async carSubmit() {
      const {errorCode, data} = await this.$api.OutgoingOperation.carSubmit(this.queryOption.car,this.queryOption.pickingNum)
      if(errorCode === '100200'){
        this.$router.push('/OutgoingOperation/MultipleSowingInfo')
      }
    },
    // 重置
    reset() {
      this.queryOption = this.$options.data().queryOption
      this.inputContent = ""
      this.getSowingList()
    },
    // 是否未拣货或者正在拣货
    _isPicking(arr) {
     for (const item of arr) {
       if(item.pickingStatus == '1' || item.pickingStatus == '2' ){
         return true
       }
     }
    }
  
  }
};
</script>
<style scoped>
.seachInput {
  width: 200px;
}
</style>
