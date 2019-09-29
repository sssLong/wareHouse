/*
 * @Author: 李步钻 
 * @Date: 2019-09-05 14:30:44 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-09-05 14:50:52
 */

<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="详情页"></V-Title>
      <div class="condition" style="flex-flow: wrap;">
        <el-form class="details-form" label-position="right" label-width="120px">
          <el-form-item label="仓库:"><span v-text="row.warehouseName"></span></el-form-item>
          <el-form-item label="复核单号:"><span v-text="row.reviewNum"></span></el-form-item>
          <el-form-item label="包裹数:"><span v-text="row.packageNumber"></span></el-form-item>
          <el-form-item label="计划商品数:"><span v-text="row.planProductNum"></span></el-form-item>
          <el-form-item label="实际商品数:"><span v-text="row.actualProductNum"></span></el-form-item>
          <el-form-item label="SKU种类数:"><span v-text="row.skuSum"></span></el-form-item>
          <el-form-item label="完成时间:"><span v-text="row.endTime"></span></el-form-item>
          <el-form-item label="差异数:"><span v-text="row.differenceNum"></span></el-form-item>
        </el-form>
      </div>
    </div>

    <div class="table-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="复核任务列表" name="first">
          <V-Table :dataSource="ReviewTaskDataSource"  @sort-change="handleSort">
            <template slot-scope="scopes" :slot="item.prop" v-for="item in showCodeTabel">
              <span :key="item.prop" v-text="getNameByMaId(item.kind,scopes.scope.row[item.prop])"></span>
            </template>
            <template slot-scope="scopes" slot="taskStatus">
              <span v-text="scopes.scope.row.taskStatus==='Y'?'已复核':'待复核'"></span>
            </template>
          </V-Table>
          <div class="block">
            <el-pagination
              class="p-20"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="PageNum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="PageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="ReviewTaskTotal"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="打包列表" name="second">
          <V-Table :dataSource="PackagingDataSource" @sort-change="handlePackingSort">
            <template slot-scope="scopes" :slot="item.prop" v-for="item in showCodeTabel">
              <span :key="item.prop" v-text="getNameByMaId(item.kind,scopes.scope.row[item.prop])"></span>
            </template>
          </V-Table>
          <div class="block">
            <el-pagination
              class="p-20"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="PageNum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="PageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="PackagingTotal"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="播种明细" name="third">
          <V-Table :dataSource="SowDetailDataSource" @sort-change="handleSowingSort">
             <template slot-scope="scopes" :slot="item.prop" v-for="item in showCodeTabel">
              <span :key="item.prop" v-text="getNameByMaId(item.kind,scopes.scope.row[item.prop])"></span>
            </template>
          </V-Table>
          <div class="block">
            <el-pagination
              class="p-20"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="PageNum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="PageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="SowDetailTotal"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <V-BottomBtn routerTO="/OutgoingOperation/RecheckManage"></V-BottomBtn>
  </div>
</template>

<script>
import { ReviewTaskCols, PackagingCols, SowDetailCols } from "./cols";
import axios from "axios";
export default {
  name: "OutgoingOperation_RecheckManageDetails",
  data() {
    return {
      activeName: "first",
      ReviewTaskDataSource: {
        data: [], // 复核任务表格数据
        cols: ReviewTaskCols, // 复核任务表格的列数据
      },
      PackagingDataSource: {
        data: [], // 打包表格数据
        cols: PackagingCols, // 打包表格的列数据
      },
      SowDetailDataSource: {
        data: [], // 播种明细表格数据
        cols: SowDetailCols, // 播种明细表格的列数据
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
      PageNum: 1, //页码
      PageSize: 10, //行数
      ReviewTaskTotal: null, //复核任务总页数
      PackagingTotal: null, // 复核打包总页数
      SowDetailTotal: null, // 复核播种明细总页数
      row: {}, // 列表行数据
      platformList: [], // 平台数据、销售渠道
      sortQuery: {}, // 排序查询对象参数  防止点击分页时丢失这个参数
      sortPackingQuery: {}, // 排序查询对象参数  防止点击分页时丢失这个参数
      sortSowingQuery: {}, // 排序查询对象参数  防止点击分页时丢失这个参数

    };
  },
  activated() {
    this.getMoreMaList(
      "order_type",
      "check_status",
      "package_type",
      "unmark",
      "differential_markers",
      "sales_channel"
    );
    this.getPlatformList()
    this.row = JSON.parse(localStorage.getItem('RecheckManageRow'));
  },
  methods: {
    search() {
      this.getRecheckTaskList();
      this.getRecheckPackingList();
      this.getRecheckSowingList();
     
    },
   // 获取平台
    async getPlatformList() {
      let res = await this.$api.LogisticsManage.getPlatformList({page: 1, row: Math.pow(10,8), isValid: 1})
      this.platformList = res.data.pageInfo.list
    },
    // 复核管理详情页 复核任务列表查询
    async getRecheckTaskList() {
      this.ReviewTaskDataSource.data = []
      const { PageNum: page, PageSize: row } = this;
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.getRecheckTaskList(this.row.reviewNum, Object.assign({
        page,
        row,
      },this.sortQuery));
      if (errorCode === "100200") {
        const { list, total } = data.pageInfo;
         list.forEach(element => { // 无差异，不显示异常货位列的值，有差异才显示异常货位列的值
          if(element.differenceMark === '1') element.abnormalLocation = ''
        });
        this.ReviewTaskDataSource.data = list;
        this.ReviewTaskTotal = total;
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
      this.getRecheckTaskList();
    },
    // 复核管理详情页 复核打包列表查询
    async getRecheckPackingList() {
      let self = this;
      this.PackagingDataSource.data = []; // 排除之前的数据影响
      const { PageNum: page, PageSize: row } = this;
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.getRecheckPackingList(
        this.row.reviewNum,
        Object.assign({
          page,
          row
        },
        this.sortPackingQuery
      ));
      if (errorCode === "100200") {
        const { list, total } = data.pageInfo;
        list.forEach( item => {
          if(item.channelAccount){
            let sales_channel = item.channelAccount.split('/')[0] // 物流渠道码
            let account = item.channelAccount.split('/')[1] // 物流渠道码
            let channelAccount = self._findSalesChanel(sales_channel,self.platformList) + '/' + account
            self.$set(item,'channelAccount',channelAccount)
          }
        })
        this.PackagingDataSource.data = list;
        this.PackagingTotal = total;
      }
    },
    // sku列表列排序事件
    handlePackingSort(colData) {
      const { prop, order } = colData;
      let orderState = order == "ascending" ? 'asc ' : 'desc';
      this.sortPackingQuery = {
        sortName: prop ? prop : "",
        sortType:  prop ?  orderState : ""
      };
      this.getRecheckPackingList();
    },
    // 复核管理详情页 复核播种明细列表查询
    async getRecheckSowingList() {
      this.SowDetailDataSource.data = []
      const { PageNum: page, PageSize: row } = this;
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.getRecheckSowingList(this.row.reviewNum, Object.assign({
        page,
        row
      },this.sortSowingQuery));
      if (errorCode === "100200") {
        const { list, total } = data.pageInfo;
        this.SowDetailDataSource.data = list;
        this.SowDetailTotal = total;
      }
    },
     // sku列表列排序事件
    handleSowingSort(colData) {
      const { prop, order } = colData;
      let orderState = order == "ascending" ? 'asc ' : 'desc';
      this.sortSowingQuery = {
        sortName: prop ? prop : "",
        sortType:  prop ?  orderState : ""
      };
      this.getRecheckSowingList();
    },
    handleClick(val) {
      this.PageNum = 1;
      this.search()
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
    // 查找销售渠道码对应的文本 
    _findSalesChanel(chanel,arr) {
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if(chanel == element.platformCode) {
          return element.platformCn
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.details-form {
  display: flex;
  flex-flow: wrap;
  &/deep/.el-form-item {
    width: 20%;
  }
}
</style>
