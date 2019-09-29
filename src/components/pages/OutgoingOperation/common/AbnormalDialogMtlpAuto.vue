
<template>
<!-- 多品复核 调拨出库 异常弹窗 -->
  <div>
    <el-dialog
      title="异常上报"
      :visible.sync="isVisible"
      @close="cancel"
      :close-on-click-modal="false"
      class="errDialog"
      width="680px"
    >
       <!-- 引入表格公共组件 START -->
      <V-Table :dataSource="dataSource">
        <template slot-scope="scopes" slot="exNumber">
            <span v-text="scopes.scope.row.exNumber==0?null:scopes.scope.row.exNumber"></span>
        </template>
        <template  slot-scope="scopes" slot="exReason">
           <span v-if="scopes.scope.row.pickingDifferenceMark == '2'" >拣货差异</span>
           <el-select v-else v-model="scopes.scope.row.exReason" style="width:240px" placeholder="请选择">
            <el-option
              v-for="item in MaBiaoObj.exception_reasonList"
              :key="item.dataCode"
              :label="item.dataName"
              :value="item.dataCode"
            ></el-option>
          </el-select>
        </template>
      </V-Table>
      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="batchAddEx">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { AbnormalCol } from '../cols'
export default {
  props: {
    dialogVisible: {
      type: Boolean
    },
    configSet: {
      type: Object
    },
    data: {
      type: Array
    },
     dataCopy: {
      type: Array
    },
    len: {
      type: Number
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
      params: [],
      dataSource: {
        data: [], // 表格数据
        cols: AbnormalCol, // 表格的列数据
        autoHeight: true,
       }
    };
  },
    watch: {
      dialogVisible() {
        this.isVisible = this.dialogVisible
      },
      dataCopy() {
        this.data.forEach( item => {
            this.$set(item,'goodsSku',item.sku)
            if(item.pickingDifferenceMark == "2") { // 有拣货差异的传 差异数 为 0 给后台 这样就不生成异常单
              this.$set(item,'exNumber',0)
            }else{
              this.$set(item,'exNumber',item.pickingNum-item.reviewNum)
            }
            this.$set(item,'exReason','5')
            this.$set(item,'sourceType',4)
            this.$set(item,'warehouseCode',item.warehouseCode)
            this.$set(item,'positionCode',item.abnormalLocation)
            this.$set(item,'wayBillNo',item.waybillNum)
            this.$set(item,'boxNo',item.crateNum)
            this.$set(item,'orderNumber',item.pickingNum)
            this.$set(item,'sourceNo',item.reviewOrderNum + '|' + item.packageNum) // 来源单号传 复核单ID/包裹号 格式给后端
        })
        // 回显列表的数组
        this.dataSource.data = this.dataCopy
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
    async batchAddEx() {
      const { errorCode, data } = await this.$api.OutgoingOperation.batchAddEx(
      this.data
      );
      if (errorCode === "100200") {
        this.$utils.commonUtils.tip("异常上报成功", "success");
        this.isVisible = false;
        this.reportException(this.data)  // 异常上报成功后调用 供复核后台记录
      }
    },
      // 异常上报成功后调用
    async reportException(params) {
      if(params[0].packageException == 'Y') {
        this.$parent.reviewComplete()
        return
      } 
      const { errorCode, data } = await this.$api.OutgoingOperation.reportException(
        params[0].packageNum, this.sowingType
      );
      if (errorCode === "100200") {
         this.$parent.reviewComplete()
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