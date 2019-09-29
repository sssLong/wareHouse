<!--
 * @Autor: 廖佳星
 * @LastEditors: 廖佳星
 * @LastEditTime: 2019-08-22 15:41:50
 -->
<!-- 盘点任务单详情页  页面开发：廖佳星 样式文件：ArrivalNotice.scss-->
<template>
  <div class="WarehouseInside">
    <div class="TakeStockTaskDetails">
      <!-- 头部标题 -->
      <div class="flexBOX flexBOXS">
        <V-Title title="盘点任务单详情页" style="width:100%;"></V-Title>
      </div>
      <!-- 信息展示 -->
      <div class="p-20 pb-0 section-cont yy-detail">
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">盘点单号：</div>
            <div class="value" v-text="dataObject.inventoryId"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">任务单号：</div>
            <div class="value" v-text="dataObject.inventoryTaskId"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">盘点仓库：</div>
            <div class="value" v-text="dataObject.warehouse"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">盘点状态：</div>
            <div class="value" v-text="dataObject.taskStatus"></div>
          </div>
        </div>
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">货架数：</div>
            <div class="value" v-text="dataObject.goodsShelveCount"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">货位数：</div>
            <div class="value" v-text="dataObject.goodsLocationCount"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">SKU数：</div>
            <div class="value" v-text="dataObject.totalSku "></div>
          </div>
          <div class="cont-item">
            <div class="label tr">库存数：</div>
            <div class="value" v-text="dataObject.totalStock"></div>
          </div>
        </div>
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">创建人：</div>
            <div class="value" v-text="dataObject.creator"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">创建时间：</div>
            <div class="value" v-text="dataObject.createTime"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">取消人：</div>
            <div class="value" v-text="dataObject.cancelPerson"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">取消时间：</div>
            <div class="value" v-text="dataObject.cancelTime"></div>
          </div>
        </div>
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">客户名称：</div>
            <div class="value" v-text="dataObject.customer"></div>
          </div>
        </div>
      </div>
      
      <!-- SKU明细表格 -->
      <div class="table-container pl-20 pr-20">
        <!-- 批量操作 -->
        <div class="Operation">
          <div>盘点任务单明细</div>
        </div>
        <V-Table :dataSource="dataSource"></V-Table>
      </div>
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
    <V-BottomBtn routerTO="/WarehouseInside/TakeStockTask"></V-BottomBtn>
  </div>
</template>

<script>
import { TakeStockTaskDetails } from "./cols";

export default {
  name:'WarehouseInside_TakeStockTaskDetails',
  data() {
    return {
      inventoryTaskId:"",//任务单号
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数

      dataObject:{},//详情数据
      // 表格组件数据
      dataSource: {
        data: [], // 表格数据
        cols: TakeStockTaskDetails, // 表格的列数据
      },
    };
  },
  methods: {
    // 通过任务单号查询详情
    searchData() {
      const that=this
      let params = {inventoryTaskId: that.inventoryTaskId}
      that.$api.WarehouseInside.TaskInventoryTaskId(params).then((res) => {
        res.data.taskStatus = that.getNameByMaId('takestock_status',res.data.taskStatus) //状态转换
        that.dataObject=res.data
      }).catch((err) => {console.log(err)});
    },
    search(){
      const that=this
      that.$set(that.dataSource,'loading',true)
      let params = {
        pageNum:that.PageNum,
        pageSize:that.PageSize,
        inventoryTaskId:this.inventoryTaskId //任务单号
      }
      that.$api.WarehouseInside.pageQueryDetail(params).then((res) => {
        that.dataSource.data = res.data.list
        that.total = res.data.total
        that.$set(that.dataSource,'loading',false)
      }).catch((err) => {console.log(err)});
    },
    //tab切换事件
    handleClick(val) {}
  },
  created() {},
  activated(){
    this.inventoryTaskId = this.$route.query.id;//任务单号
    this.getMoreMaList('takestock_status').then(()=>{
      this.searchData()
    }) //查询方法在码表中调用
  },
  computed: {}
};
</script>
