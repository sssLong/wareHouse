<template>
  <div class="yy-cont">
    <V-Title></V-Title>
    <div class="pl-20 pr-20 pb-10 form-select">
      <el-select
        clearable
        filterable
        @change="getShipperKv"
        v-model="queryOption.customer"
        placeholder="请选择客户名称">
        <el-option v-for="item in customerList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
      </el-select>
       <el-select
        clearable
        :disabled="!queryOption.customer"
        v-model="queryOption.shipper"
        placeholder="请选择货主">
        <el-option v-for="item in shipperList"
          :key="item.dataCode"
          :label="item.dataName"
          :value="item.dataName">
        </el-option>
      </el-select>
      <el-select clearable filterable v-model="queryOption.warehouseCode" placeholder="请选择仓库名称">
        <el-option
          v-for="item in warehouseList"
          :key="item.dataCode"
          :label="item.dataName"
          :value="item.dataCode"
        ></el-option>
      </el-select>
      <el-input
        clearable
        @clear="search()"
        @keyup.native.enter="search()"
        placeholder="请输入查询内容"
        class="customer input-select"
        v-model.trim="inputContent"
      >
        <el-select v-model="selectValue" slot="prepend" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <el-button slot="append" icon="el-icon-search" @click="PageNum=1;search()"></el-button> -->
      </el-input>
      <el-button type="primary" @click="PageNum=1;search()">查询</el-button>
      <el-button type="text" @click="reset">重置</el-button>
    </div>
    <div class="pl-20 pr-20 table-container">
      <div class="fw6" style="line-height:34px;">SKU库存列表</div>

      <V-Table :dataSource="dataSource" @sort-change="handleSort" @review="handleReview"></V-Table>

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
    <el-dialog class="cust-dialog" width="960px" :visible.sync="dialogVisible">
      <V-Title :title="`${copyRow.warehouseName}`+ 'SKU' + `(${copyRow.goodsSku})` + '库存日志'">
      </V-Title>
      <div class="pb-10 form-select">
        <el-date-picker
          class="dataTime"
          v-model="timeValue"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
        <el-select clearable filterable v-model="queryLogOption.changeType" placeholder="变动类型">
          <el-option
            v-for="item in MaBiaoObj.change_typeList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataName"
          ></el-option>
        </el-select>
        <el-cascader
          clearable
          placeholder="业务类型"
          :options="cascaderOptions"
          @active-item-change="handleItemChange"
          v-model="businessType"
        ></el-cascader>
        <el-input
          clearable
          @clear="getSkuLog()"
          @keyup.native.enter="getSkuLog()"
          v-model="logInputContent"
          placeholder="请输入查询内容"
          class="customer input-select"
          style="width: 350px"
        >
          <el-select v-model="logSelectValue" slot="prepend" placeholder="请选择">
            <el-option
              v-for="item in logOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <el-button slot="append" icon="el-icon-search" @click="logPageNum=1;getSkuLog()"></el-button> -->
        </el-input>
        <el-button type="primary" @click="logPageNum=1;getSkuLog()">查询</el-button>
        <el-button type="text" style="margin-left: 0;" @click="resetLog">重置</el-button>
      </div>

      <V-Table @sort-change="handleLogSort" :dataSource="logDataSource"></V-Table>
      <div class="block">
        <el-pagination
          class="p-20"
          @size-change="handleLogSizeChange"
          @current-change="handleLogCurrentChange"
          :current-page="logPageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="logPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="logTotal"
        ></el-pagination>
      </div>

      <div>
        <el-button class="box-align-center" type="primary" @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { SkuStock as cols, SkuStockLog as cols2 } from "@/columns";
export default {
  name: "WarehouseData_SkuStock",
  data() {
    return {
      selectValue: "goodsSku", // sku列表选中的前置条件
      logSelectValue: "updateBy", // 日志列表选中的前置条件
      dialogVisible: false, // 弹窗显示
      timeValue: "", // 时间
      total: null, // 列表总数
      PageNum: 1, // 页码
      PageSize: 10, // 条数
      inputContent: "", // 首页输入框的值
      logInputContent: "", // 日志列表输入框的值
      logPageNum: 1, // 页码
      logPageSize: 10, // 条数
      logTotal: null, // 弹窗日志列表总数
      customerList: [], // 客户名称列表
      shipperList: [], // 货主列表
      options: [
        {
          label: "SKU",
          value: "goodsSku"
        },
        {
          label: "SPU",
          value: "goodsSpu"
        },
        {
          label: "产品名称",
          value: "skuName"
        }
      ],
      logOptions: [
        {
          label: "操作人",
          value: "updateBy"
        },
        {
          label: "来源单号",
          value: "sourceOrderNumber"
        }
      ],
      // 业务类型
      cascaderOptions: [
        {
          label: "入库",
          value: "put_type",
          children: []
        },
        {
          label: "出库",
          value: "order_type",
          children: []
        },
        {
          label: "库内",
          value: "inside_type",
          children: []
        }
        // {
        //   label: "处理",
        //   value: "handle_way",
        //   children: []
        // },
        // {
        //   label: "异常",
        //   value: "loss_sc_type",
        //   children: []
        // }
      ],
      dataSource: {
        data: [], // 表格数据
        cols, // 表格的列数据
        isOperation: true, // 表格有操作列时设置
        loading: false, // loading
        operation: {
          // 表格有操作列时设置
          label: "操作", // 列名
          width: "100", // 根据实际情况给宽度
          data: [
            {
              label: "操作日志", // 操作名称
              emitType: "review", // 触发父组件
              permission: "SKU库存日志" // 后期这个操作的权限，用来控制权限
            }
          ]
        }
      },
      logDataSource: {
        data: [], // 表格数据
        cols: cols2 // 表格的列数据
      },
      queryOption: {
        sortedFlag: "",
        warehouseCode: "",
        shipper: "",
        customer: ""

      },
      queryLogOption: {
        changeType: ""
      },
      businessType: [],
      copyRow: {},
      sortQuery: {}, // 排序查询对象参数  防止点击分页时丢失这个参数
      sortLogQuery: {}, // 排序查询对象参数  防止点击分页时丢失这个参数
    };
  },
  beforeRouteLeave (to, fromm, next) {
    this.dialogVisible = false
    next()
  },
  created() {
    this.timeValue = [
      new Date(new Date().toLocaleDateString()).getTime(),
      new Date(new Date().toLocaleDateString()).getTime() +
        24 * 60 * 60 * 1000 -
        1
    ]; // 0点到24点
    this.getWareHouse(); // 获取仓库列表
    // this.getSupplierOwner(); //货主数据
    this.getMoreMaList("change_type");
    this.getCustomerKv()
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
    // 点击操作日志按钮
    handleReview(index, row) {
      this.copyRow = Object.assign({}, row);
       this.queryLogOption = this.$options.data().queryLogOption;
      this.dialogVisible = true;
      this.getSkuLog();
    },
    // 获取SKU数据
    async search() {
      this.$set(this.dataSource, "loading", true);
      let params = Object.assign(
        {},
        {
          pageNum: this.PageNum,
          pageSize: this.PageSize,
          [this.selectValue]: this.inputContent
        },
        this.queryOption,
        this.sortQuery
      );
      const { data, errorCode } = await this.$api.WarehouseData.getSkuList(params);
      this.$set(this.dataSource, "loading", false);
      if(errorCode == '100200') {
        if(data){
          const { list = [], total = null } = data.pageInfo;
          this.dataSource.data = list;
          this.total = total;
        }else{
          this.dataSource.data = [];
          this.total = 0;
        }
        
      }
     
    },
    async getCustomerKv () { // 客户名称的下拉
      const { data = [] } = await this.$api.WarehouseData.getCustomerKv()
      this.customerList = data
    },
    async getShipperKv (val) { // 货主的下拉
      if (val) {
        const { data = [] } = await this.$api.WarehouseData.getShipperKv(val)
        this.shipperList = data
      } else {
        this.queryOption.customer = ''
      }
      
    },
    // sku列表列排序事件
    handleSort(colData) {
      const { prop, order } = colData;
      let orderState = order == "ascending" ? 1 : 0;
      this.sortQuery = {
        sortedFlag: prop ? prop + "/" + orderState : ""
      };
      this.search();
    },
    // 日志列表点击分页
    handleLogCurrentChange(val) {
      this.logPageNum = val;
      this.getSkuLog();
    },
    // 日志列表点击条数
    handleLogSizeChange(val) {
      this.logPageSize = val;
      this.getSkuLog();
    },
    // 获取弹窗日志列表
    async getSkuLog() {
      let params = Object.assign(
        {},
        {
          goodsSku: this.copyRow.goodsSku,
          warehouseCode: this.copyRow.warehouseCode,
          businessType: this.businessType.join("/"),
          pageNum: this.logPageNum,
          pageSize: this.logPageSize,
          startTime: this.startTime,
          endTime: this.endTime,
          [this.logSelectValue]: this.logInputContent
        },
        this.queryLogOption,
        this.sortLogQuery
      );
      const { errorCode, data: resData = {} } = await this.$api.WarehouseData.getSkuLog(
        params
      );
        const { list = [], total = null } = resData;
        console.log(list);
        this.logDataSource.data = list ;
        this.logTotal = total;
    },
    // 日志列表排序事件
    handleLogSort(colData) {
      const { prop, order } = colData;
      let orderState = order == "ascending" ? 1 : 0;
      this.sortLogQuery = {
        sortedFlag: prop ? prop + "/" + orderState : ""
      };
      this.getSkuLog();
    },
    reset() {
      this.queryOption = this.$options.data().queryOption
      this.inputContent = ''
    },
    // 重置日志列表条件
    resetLog() {
      this.queryLogOption = this.$options.data().queryLogOption;
      this.businessType = []
      // this.getSkuLog();
    },
    // 业务类型级联
    async handleItemChange(val) {
      let code = val[0];
      let index = this.cascaderOptions.findIndex(item => item.value === code);
      if (this.cascaderOptions[index].children.length) return; // 有值不调接口获取
      const {
        data: resData = []
      } = await this.$api.BasicConfiguration.getDictCodes({ dictCodes: code });
      if (resData.length) {
        let mapData = resData[0].dictData.map(item => {
          return {
            label: item.dataName,
            value: item.dataCode
          };
        });
        this.cascaderOptions[index].children = mapData;
      }
    }
  }
};
</script>

<style lang='scss'>
.cust-dialog {
  .el-dialog__header {
    display: none;
  }
}
</style>
