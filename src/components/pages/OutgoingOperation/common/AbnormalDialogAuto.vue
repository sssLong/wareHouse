<template>
  <div>
    <el-dialog
      title="异常上报"
      :visible.sync="isVisible"
      @close="cancel"
      :close-on-click-modal="false"
      class="errDialog"
      width="480px"
    >
      <el-form ref="formData" label-width="80px" class="pl-20 pr-20">
        <el-form-item label="SKU">
          <el-input v-model="queryOption.goodsSku" disabled style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="queryOption.exNumber" disabled style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="异常原因">
          <el-select v-model="queryOption.exReason" style="width:240px" placeholder="请选择">
            <el-option
              v-for="item in MaBiaoObj.exception_reasonList"
              :key="item.dataCode"
              :label="item.dataName"
              :value="item.dataCode"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addEx">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean
    },
    configSet: {
      type: Object
    },
    dataCopy: {
      type: Array
    },
   sowingType: {
     type: String
   }
  },
  data() {
    return {
      isVisible: this.dialogVisible,
      queryOption: {
        goodsSku: '',
        exReason: '',
        exNumber: "",
        sourceType: 4, // 4 复核异常
        positionCode: "",
        warehouseCode: ""
      },
    };
  },
    watch: {
      dialogVisible() {
        this.isVisible = this.dialogVisible
      },
      dataCopy() {
        if(this.dataCopy.length>0) {
          this.queryOption.goodsSku = this.dataCopy[0].sku
          this.queryOption.exNumber = this.dataCopy[0].pickingNum - this.dataCopy[0].reviewNum
          this.queryOption.warehouseCode = this.dataCopy[0].warehouseCode
          this.queryOption.positionCode = this.dataCopy[0].abnormalLocation
          this.queryOption.wayBillNo = this.dataCopy[0].waybillNum 
          this.queryOption.boxNo = this.dataCopy[0].crateNum
          this.queryOption.orderNumber = this.dataCopy[0].pickingNum
          this.queryOption.sourceNo = this.dataCopy[0].reviewOrderNum + '|' + this.dataCopy[0].packageNum   // 来源单号传 复核单ID/包裹号 格式给后端
          this.queryOption.packageNum = this.dataCopy[0].packageNum   
        }
      }
    },
  created() {
    this.getMoreMaList("exception_reason");
  },
  methods: {
    // 取消
    cancel() {
      this.$emit("changeVisibleAuto", false);
    },
    // 异常上报
    async addEx() {
      let self = this;
      if(this.dataCopy.length >=1){
      this.$emit("changeVisibleAuto", true);
      }else{
      this.$emit("changeVisibleAuto", false);
      }
      const { errorCode, data } = await this.$api.OutgoingOperation.addEx(
        this.queryOption
      );
      if (errorCode === "100200") {
        self.$utils.commonUtils.tip("异常上报成功", "success");
        self.dataCopy.splice(0,1)
        await self.reportException()  // 异常上报成功后调用 供复核后台记录
         if(self.dataCopy.length===0) { // 最后一次弹窗了调用复核完成接口
          self.$parent.reviewComplete()
         }
      }
    },
      // 异常上报成功后调用
    async reportException() {
      const { errorCode, data } = await this.$api.OutgoingOperation.reportException(
        this.queryOption.packageNum, this.sowingType
      );
      if (errorCode === "100200") {
        // 暂时不提示
        // this.$utils.commonUtils.tip("异常上报成功", "success");
        if(this.sowingType == 'S') {
          this.$parent.getSingleOrderList() // 重新刷一遍父组件列表数据
        }else if(this.sowingType == 'M') {
          this.$parent.getMultipleOrderList() // 重新刷一遍父组件列表数据
        }else if(this.sowingType == 'A') {
          this.$parent.findAllocateList() // 重新刷一遍父组件列表数据
        }
      }
    },
     // 查找skud对应的 item项 货位编码 仓库编码
    _isFindItem(arr,sku) {
      for (let index = 0; index < arr.length; index++) {
        const item = arr[index];
        if (item.sku == sku && item.taskStatus == 'N') {
         return item
        }
      }
    },
  }
};
</script>

<style lang="scss" scoped>
</style>