
<template>
  <div class="container statistics-cont WarehousingStatistics">
    <div class="header-container">
      <V-Title title="入库统计"></V-Title>
      <div class="condition">
        <el-date-picker
          class="dataTime"
          v-model="timeValue"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
        <el-select
          clearable
          filterable
          v-model="queryOption.warehouseCode"
          @change="handleChangeWarehouse"
          placeholder="仓库名称">
          <el-option
            v-for="item in warehouseList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select
          class="selectOperationType"
          filterable
          v-model="queryOption.operationType"
          @change="((val)=>handleChange(val))"
          placeholder="操作类型"
        >
          <el-option
            v-for="item in MaBiaoObj.inOperationTypeList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
       <el-select clearable filterable v-model="queryOption.customer" placeholder="客户名称">
        <el-option v-for="item in customerList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataName">
      </el-option>
      </el-select>
        <el-select
          clearable
          filterable
          v-model="queryOption.putType"
          style="width:150px"
          placeholder="选择入库类型"
        >
          <el-option
            v-for="item in MaBiaoObj.putTypeList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select clearable filterable v-model="queryOption.workingPeople" placeholder="选择作业人">
          <el-option
            v-for="item in warehouseUserList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
        <el-select clearable filterable v-model="queryOption.synergyPeople" placeholder="选择协同人">
          <el-option
            v-for="item in warehouseUserList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="search">查询</el-button>
        <span class="reset" @click="reset">重置</span>
      </div>
    </div>
    <div class="table-container">
      <div class="table-operation">
        <div class="title">统计列表</div>
        <div class="operation">
          <template v-if="label=='收货'">
               <div class="parcel info">
                  <i class="iconfont iconshujutongji"></i>
                  <span>
                    包裹签到数：
                    <span v-text="form.packetCheckinNum"></span>
                  </span>
                </div>
                <div class="info">
                  <span>
                    码盘数：
                    <span v-text="form.encoderNum"></span>
                  </span>
                </div>
                <div class="info">
                  <span>
                    包裹接收数：
                    <span v-text="form.packetEceiveNum"></span>
                  </span>
                </div>
          </template>
           <template v-if="label=='质检'">
               <div class="parcel info">
                  <i class="iconfont iconshujutongji"></i>
                  <span>
                    拆包数：
                    <span v-text="form.packetUnpackingNum"></span>
                  </span>
                </div>
                <div class="info">
                  <span>
                    质检次数：
                    <span v-text="form.qcTimeNum"></span>
                  </span>
                </div>
                <div class="info">
                  <span>
                    质检个数：
                    <span v-text="form.qcNum"></span>
                  </span>
                </div>
          </template>
           <template v-if="label=='上架'">
               <div class="parcel info">
                  <span>
                    上架次数：
                    <span v-text="form.putawayTimeNum"></span>
                  </span>
                </div>
                <div class="info">
                  <span>
                    上架个数：
                    <span v-text="form.putawayNum"></span>
                  </span>
                </div>
               
          </template>
           <div class="export" @click="inboundExport" v-show="btnPermission('入库统计导出')">
                  <i class="iconfont icondaochuexcel"></i>
                  <span>导出Excel</span>
                </div>
         
        </div>
      </div>

      <!-- 引入表格公共组件 START -->
      <V-Table :dataSource="dataSource" ref="table"></V-Table>
      <!-- 引入表格公共组件 END -->

      <div class="block">
        <el-pagination
          class="p-20"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="PageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ReceivingGoods,
  Inspection,
  UpperShelf
} from "@/columns/WarehouseData/WarehousingStatistics";
export default {
  name: "WarehouseData_WarehousingStatistics",
  data() {
    return {
      selectValue: "", // 输入框前置条件下拉框选中的条件值
      timeValue: "", // 时间
      dataSource: {
        data: [], // 表格数据
        cols: ReceivingGoods, // 表格的列数据
        isIndex: true,
        loading: false, // loading
      },
      shipperList: [], // 货主列表
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      queryOption: {
        // 查询
        operationType: "", //  操作类型(码表 1-收货 2-质检 3-上架) ,
        putType: "", // 入库类型(码表 01-销退入库 02-来料入库 03-调拔入库) ,
        warehouseCode: "", // 仓库ID
        ownerOfCargo: "", // 货主
        synergyPeople: "", // 协同人
        workingPeople: "" // 作业人
      },
      form: {}, // 回显表头信息
      label: "收货" // 回显操作类型label
    };
  },
  async created() {
    this.timeValue = [
      new Date(new Date().toLocaleDateString()).getTime(),
      new Date(new Date().toLocaleDateString()).getTime() +
        24 * 60 * 60 * 1000 -
        1
    ]; // 0点到24点
    await this.batchMaTableList("put_type", "in_operation_type"); // 获取码表列表
    let { data } = await this.getWareHouse() // 获取仓库名称
    // if (data && data.length) {
    //   // this.queryOption.warehouseCode = data[0].dataCode // 仓库设置为第一个
    //   this.getAccountName(this.queryOption.warehouseCode) // 获取用户数据
    // } // 获取仓库列表
     // 操作类型选择第一个
    let inOperationTypeList = this.MaBiaoObj['inOperationTypeList']
    if (inOperationTypeList && inOperationTypeList.length) {
       this.queryOption.operationType = inOperationTypeList[0].dataCode // 操作类型设置为第一个
    }
    // this.getSupplierOwner(); //货主数据
    this.getInboundCount(); // 查询工作量
    this.getCustomerKv()
    this.search()
  },
  computed: {
    startTime() {
      if (!this.timeValue) return "";
      return this.$utils.commonUtils.format(
        this.timeValue[0],
        "YYYY-MM-DD HH:mm:ss"
      );
    },
    endTime() {
      if (!this.timeValue) return "";
      return this.$utils.commonUtils.format(
        this.timeValue[1],
        "YYYY-MM-DD HH:mm:ss"
      );
    }
  },
  methods: {
    //  切换操作类型 切换列
    handleChange(val) {
      switch (val) {
        case "1":
          this.dataSource.cols = ReceivingGoods;
          this.label = "收货";
          break;
        case "2":
          this.dataSource.cols = Inspection;
          this.label = "质检";
          break;
        case "3":
          this.dataSource.cols = UpperShelf;
          this.label = "上架";
          break;
        default:
          break;
      }
      this.getInboundCount(); // 查询工作量
      this.search()
    },
    //  查询列表数据
    async search() {
      this.$set(this.dataSource, "loading", true);
       if (!this.queryOption.operationType) {
        this.$message.warning('请选择操作类型')
        return false
      }
      let params = Object.assign(
        {},
        {
          pageNum: this.PageNum,
          pageSize: this.PageSize,
          startTime: this.startTime,
          endTime: this.endTime
        },
        this.queryOption
      );
      const {
        errorCode,
        data = {}
      } = await this.$api.WarehouseData.getInboundList(params);
      this.$set(this.dataSource, "loading", false);
      if (errorCode === "100200") {
        const { list, total } = data;
        this.dataSource.data = list;
        this.total = total;
        this._addTime(this.dataSource.data); // 回显开始时间和结束时间
        this.getInboundCount();
      }
    },
    //  获取工作量总数
    async getInboundCount() {
      const {
        errorCode,
        data = {}
      } = await this.$api.WarehouseData.getInboundCount(Object.assign({ startTime: this.startTime,
          endTime: this.endTime},this.queryOption));
      if (errorCode === "100200") {
        this.form = data && data;
      }
    },
      async getCustomerKv () { // 客户名称的下拉
      const { data = [] } = await this.$api.WarehouseData.getCustomerKv()
      this.customerList = data
    },
    // 重置
    reset() {
      this.queryOption = this.$options.data().queryOption
    },
    // 导出
    async inboundExport() {
      await this.$utils.commonUtils.export(
        "get",
        "/center/inbound/export",
        Object.assign({ startTime: this.startTime,
          endTime: this.endTime},this.queryOption),
        "入库统计",
        ".xls"
      );
    },
     async getShipperKv () { // 货主的下拉
      const { data = [] } = await this.$api.WarehouseData.getShipperKv()
      this.shipperList = data
    },
    // 下拉change仓库事件
    handleChangeWarehouse() {
      this.getAccountName(this.queryOption.warehouseCode); // 获取用户数据
    },
    // 增加开始时间和结束时间字段
    _addTime(data) {
      data.forEach(v => {
        this.$set(v, "startTime", this.startTime);
        this.$set(v, "endTime", this.endTime);
      });
    }
  }
};
</script>
<style scoped>
.search {
  color: #fff;
}
</style>

