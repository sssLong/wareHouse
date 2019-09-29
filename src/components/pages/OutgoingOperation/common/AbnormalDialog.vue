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
          <el-input v-model="queryOption.goodsSku" style="width:240px" placeholder="请扫描SKU条码"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="queryOption.exNumber" style="width:240px"></el-input>
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
    data: {
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
      }
    };
  },
    watch: {
      dialogVisible() {
        this.isVisible = this.dialogVisible
      }
    },
  created() {
    this.getMoreMaList("exception_reason");
  },
  methods: {
    // 取消
    cancel() {
      this.$emit("changeVisible", false);
    },
    
    // 异常上报
    async addEx() {
      let item = this._isFindItem(this.data,this.queryOption.goodsSku)
      this.queryOption.warehouseCode = item.warehouseCode
      this.queryOption.positionCode = item.abnormalLocation
      this.queryOption.wayBillNo = item.waybillNum 
      this.queryOption.boxNo = item.crateNum
      this.queryOption.orderNumber = item.pickingNum
      this.queryOption.sourceNo = item.reviewOrderNum + '|' + item.packageNum   // 来源单号传 复核单ID/包裹号 格式给后端
      const { errorCode, data } = await this.$api.OutgoingOperation.addEx(
        this.queryOption
      );
      if (errorCode === "100200") {
        this.$utils.commonUtils.tip("异常上报成功", "success");
        this.dialogVisible = false;
        this.reportException();  // 异常上报成功后调用 供复核后台记录
      }
    },
     // 异常上报成功后调用
    async reportException() {
      let item = this._isFindItem(this.data,this.queryOption.goodsSku)
      const { errorCode, data } = await this.$api.OutgoingOperation.reportException(
        item.packageNum, this.sowingType
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
      console.log(arr,'arrrrrr');
      
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