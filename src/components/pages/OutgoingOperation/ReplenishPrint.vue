<template>
  <div class="container replenishprint">
    <div class="header-container base-container">
      <V-Title title="复核补打印">
        <div class="search-content">
          <el-input clearable placeholder="请输入查询内容" @clear="search" v-model.trim="inputContent" class="input-with-select">
            <el-select
              v-model.trim="selectValue"
              slot="prepend"
              placeholder="请选择"
              class="iconfont icon-xiala selectShelf selectScan"
            >
              <el-option label="包裹单号" value="packageNum"></el-option>
              <el-option label="运单单号" value="waybillNum"></el-option>
              <el-option label="包装人" value="packagesUserName"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="PageNum=1;search()"></el-button>
          </el-input>
        </div>
      </V-Title>
    </div>
    <div class="flexBox mt-20 pl-20">
      <!-- 日期时间选择器 -->
      <el-date-picker
        class="dataTime"
        v-model="timeValue"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00', '23:59:59']"    
        @change="selectTime();"
      ></el-date-picker>
      <el-select
        class="pl-20"
        @change="search()"
        clearable
        filterable
        v-model="queryOption.warehouseName"
        placeholder="仓库名称"
      >
        <el-option
          v-for="item in warehouseList"
          :key="item.dataCode"
          :label="item.dataName"
          :value="item.dataName"
        ></el-option>
      </el-select>
      <el-select
         class="pl-20"
          v-model="queryOption.orderType"
          @change="search()"
          placeholder="选择订单类型"
          style="width: 140px;"
          clearable filterable
        >
          <el-option
            v-for="item in MaBiaoObj.order_typeList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select
          class="pl-20"
          v-model="queryOption.packageType"
          @change="search()"
          placeholder="选择包裹类型"
          style="width: 140px;"
          clearable filterable
        >
          <el-option
            v-for="item in MaBiaoObj.package_typeList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
      <div class="resetStyle reset ml-10" @click="reset">重置</div>
    </div>
    <div class="table-container">
      <div class="table-operation">
        <div class="title">打包列表</div>
        <div class="operation">
          <div @click="batchPrint">
            <i class="iconfont icondayinji"></i>
            <span>打印</span>
          </div>
        </div>
      </div>
      <!-- 引入表格公共组件 START -->
      <V-Table
        :dataSource="dataSource"
        @selection-change="handleSelectionChange"
        @review="handleReview"
        @sort-change="handleSort"
      >
        <template slot-scope="scopes" slot="warehouseName">
            {{ filterWarehouseName(scopes.scope.row.warehouseCode, scopes.scope.row.warehouseName) }}
            <!-- {{ scopes.scope.row.warehouseName || warehouseList.find(item => item.dataCode === (scopes.scope.row.warehouseCode) || {}).dataName || '' }} -->
        </template>
      </V-Table>
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
import { replenishPrint } from "./cols";
import { getLodop } from "@/plugin/LodopFuncs.js";
import moment from "moment";

export default {
  name: "OutgoingOperation_ReplenishPrint",
  data() {
    return {
      inputContent: "", // 输入框的值
      selectValue: "packageNum", // 下拉框选中的值
      timeValue: "", // 时间
      queryOption: {
        warehouseName: "",
        orderNum: "",
        orderType: ""
      },
      options: [
        {
          label: "运单号",
          value: "1"
        }
      ],
      dataSource: {
        data: [], // 表格数据
        cols: replenishPrint, // 表格的列数据
        isSelection: true, // 表格有多选时设置
        isOperation: true, // 表格有操作列时设置
        isIndex: true,
        loading: false, // loading
        operation: {
          // 表格有操作列时设置
          label: "操作", // 列名
          width: "70", // 根据实际情况给宽度
          data: [
            {
              label: "打印", // 操作名称
              emitType: "review", // 触发父组件
              permission: "补打印" // 后期这个操作的权限，用来控制权限
            }
          ]
        }
      },
      multipleSelection: [],
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      sortQuery: {}, // 排序查询对象参数  防止点击分页时丢失这个参数

    };
  },
  created() {
    this.getWareHouse(); // 仓库数据
    this.getMoreMaList("order_type", "package_status", "package_type");
  },
  methods: {
    // 复核补打印列表查询
    async search() {
      this.$set(this.dataSource, "loading", true);
      const { PageNum: page, PageSize: row } = this;
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.getRePrintList(Object.assign({ page, row,[this.selectValue]: this.inputContent}, this.queryOption,this.sortQuery) );
      this.$set(this.dataSource, "loading", false);
      if (errorCode === "100200") {
        const { list, total } = data.pageInfo;
        this.dataSource.data = list;
        this.total = total;
      }
    },
     // sku列表列排序事件
    handleSort(colData) {
      const { prop, order } = colData;
      let orderState = order == "ascending" ? 'asc ' : 'desc';
      this.sortQuery = {
        sortName: prop ? prop : "",
        sortType:  prop ?  orderState : ""
      };
      this.search();
    },
      // 选择时间
    selectTime(val) {
      this.queryOption.startTime = moment(this.timeValue[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.queryOption.endTime = moment(this.timeValue[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.search();
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val, "val");
    },
    // 批量打印
    async batchPrint() {
      if(!this.multipleSelection.length){
        this.$utils.commonUtils.tip('请选择','warning')
        return
      }
      for await(const key of this.multipleSelection) {
        this.getPrintData(key.printUrl)
      }
    },
    // 打印
    handleReview(index, row) {
      this.getPrintData(row.printUrl)
    },
   // 获取面单信息数组数据
    async getPrintData(url) {
      if(url) {
       this.printUrlList = url.split(';')
       this.printInfo()
      }
    },
    // 打印面单 
    async printInfo() {
      for await (const item of this.printUrlList) {
        this.printEveryItem(item)
      }
    },
    // 打印每项
    printEveryItem(item) {
      let self = this;
      let LODOP = getLodop(); //调用getLodop获取LODOP对象
      return new Promise(function (resolve) {
        setTimeout(() => {
         LODOP.PRINT_INIT("");
         let strStyleCSS = `<style type='text/css' rel='stylesheet'>.img1{display:block;margin:10px;width:360;height:360}</style>`
         let html = `<head>${strStyleCSS}</head><body><div class='print-card'>
                <img src=${item} class='img1' />
            </div><body>`
         LODOP.ADD_PRINT_HTM(0,0,380,380,html);
         LODOP.SET_PRINT_PAGESIZE(1,1000,1000,"");   
         LODOP.PRINT();
        }, 1000);
      });
    },
    filterWarehouseName (code, name) {
      if (name) return name
      let theOne = this.warehouseList.find(item => item.dataCode === code)
      return (theOne || {}).dataName || ''
    }
  }
};
</script>
<style lang="scss" scoped>
.replenishprint {
  .flexBox {
    display: flex;
    line-height: 32px;
    .resetStyle {
      font-size: 12px;
      color: #2A8BFF;
      letter-spacing: 0;
      cursor: pointer;
    }
  }
}
</style>
