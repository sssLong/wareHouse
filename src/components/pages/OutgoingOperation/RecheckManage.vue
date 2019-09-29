/*
 * @Author: 李步钻 
 * @Date: 2019-09-05 14:30:57 
 * @Last Modified by:   李步钻 
 * @Last Modified time: 2019-09-05 14:30:57 
 */
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="复核管理">
        <div class="search-content">
          <el-input
            clearable
            @clear="search()"
            placeholder="请输入查询内容"
            v-model.trim="inputContent"
            class="input-with-select"
          >
            <el-select
              v-model="selectValue"
              placeholder="请选择"
              class="iconfont icon-xiala selectShelf"
              slot="prepend"
              style="width: 120px"
            >
              <el-option label="复核单号" value="reviewNum"></el-option>
              <el-option label="包裹单号" value="packageNum"></el-option>
              <el-option label="SKU" value="sku"></el-option>
              <el-option label="复核人" value="userName"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="PageNum=1;search()"></el-button>
          </el-input>
        </div>
      </V-Title>
      <div class="condition" style="flex-flow: wrap;">
        <el-date-picker
          class="dataTime"
          v-model="timeValue"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
           value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"    
          @change="selectTime"
        ></el-date-picker>

        <el-select
          @change="PageNum=1;search()"
          clearable
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
        <el-select
          v-model="queryOption.orderType"
          @change="PageNum=1;search()"
          placeholder="选择订单类型"
          style="width: 140px;"
          clearable
          filterable
        >
          <el-option
            v-for="item in MaBiaoObj.order_typeList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select
          v-if="queryOption.orderType=='1'"
          v-model="queryOption.packageType"
          @change="PageNum=1;search()"
          placeholder="选择包裹类型"
          style="width: 140px;"
          clearable
          filterable
        >
          <el-option
            v-for="item in MaBiaoObj.package_typeList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select
          v-model="queryOption.reviewStatus"
          @change="PageNum=1;search()"
          placeholder="选择复核单状态"
          style="width: 150px;"
          clearable
          filterable
        >
          <el-option
            v-for="item in MaBiaoObj.check_statusList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <!-- 第一版先去掉 ！！ 产品 樊荣 -->
        <!-- <el-select v-model="areaSelected" placeholder="选择拣选区域" style="width: 140px;">
          <el-option
            v-for="(item,index) in areaOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>-->

        <span class="reset" @click="reset">重置</span>
      </div>

      <div class="table-container">
        <div class="table-operation">
          <div class="title">复核单列表</div>
        </div>
        <!-- 引入表格公共组件 START -->
        <V-Table
          :dataSource="dataSource"
          @selection-change="handleSelectionChange"
          @review="handleReview"
          @sort-change="handleSort"

        >
          <template slot-scope="scopes" :slot="item.prop" v-for="item in showCodeTabel">
            <span :key="item.prop" v-text="getNameByMaId(item.kind,scopes.scope.row[item.prop])"></span>
          </template>
          <template slot-scope="scopes" slot="warehouseName">
            {{ filterWarehouseName(scopes.scope.row.warehouseCode, scopes.scope.row.warehouseName) }}
            <!-- {{ scopes.scope.row.warehouseName || warehouseList.find(item => item.dataCode === (scopes.scope.row.warehouseCode) || {}).dataName || '' }} -->
          </template>
        </V-Table>
        <!-- 引入表格公共组件 END -->
      </div>
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
import { RecheckManageCols } from "./cols";
import moment from "moment";
export default {
  name: "OutgoingOperation_RecheckManage",
  data() {
    return {
      inputContent: "",
      selectValue: "reviewNum",
      timeValue: "", // 时间
      dataSource: {
        data: [], // 表格数据
        cols: RecheckManageCols, // 表格的列数据
        isOperation: true, // 表格有操作列时设置
        loading: false, // loading
        operation: {
          // 表格有操作列时设置
          label: "操作", // 列名
          width: "80", // 根据实际情况给宽度
          data: [
            {
              label: "查看", // 操作名称
              emitType: "review", // 触发父组件
              permission: "复核管理详情页" // 后期这个操作的权限，用来控制权限
            }
          ]
        }
      },
      multipleSelection: [],
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      queryOption: {
        warehouseCode: "",
        orderType: "",
        packageType: "",
        reviewStatus: ""
      },
       // 回显列表码表文本
      showCodeTabel: [
        {
          prop: "orderType",
          kind: "order_type"
        },
        {
          prop: "reviewStatus",
          kind: "check_status"
        },
        {
          prop: "packageType",
          kind: "package_type"
        },
        {
          prop: "cancelMark",
          kind: "unmark"
        },
        {
          prop: "differenceMark",
          kind: "differential_markers"
        }
      ],
      sortQuery: {}, // 排序查询对象参数  防止点击分页时丢失这个参数

    };
  },
  created() {
    this.getWareHouse(); // 仓库数据
    this.getMoreMaList("order_type", "check_status", "package_type","unmark","differential_markers");
  },
  methods: {
    // 获取复核管理列表数据 查询
    async search() {
      this.$set(this.dataSource, "loading", true);
      const { PageNum: page, PageSize: row } = this;
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.getRecheckManageList(
        Object.assign(
          { page, row, [this.selectValue]: this.inputContent },
          this.queryOption,
          this.sortQuery

        )
      );
      this.$set(this.dataSource, "loading", false);
      if (errorCode === "100200") {
        const { list, total } = data.pageInfo;
        this.dataSource.data = list;
        this.total = total;
      }
    },
    // 选择时间
    selectTime(val) {
      this.PageNum = 1;
      if(!val) this.timeValue = []
      this.queryOption.startTime = this.timeValue[0] 
      this.queryOption.endTime =this.timeValue[1] 
      this.search()
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 查看
    handleReview(index, row) {
      this.$router.push('/OutgoingOperation/RecheckManageDetails');
      localStorage.setItem('RecheckManageRow',JSON.stringify(row))
    },
    // 分页器
    handleSizeChange(val) {
      //行數
      this.PageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      //頁碼
      this.PageNum = val;
      this.search();
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
    filterWarehouseName (code, name) {
      if (name) return name
      let theOne = this.warehouseList.find(item => item.dataCode === code)
      return (theOne || {}).dataName || ''
    }
  }
};
</script>

<style scoped>
</style>
