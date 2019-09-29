<!--
 * @Autor: 廖佳星
 * @LastEditors: 廖佳星
 * @LastEditTime: 2019-08-22 15:42:26
 -->
<!-- 盘点计划单详情页  页面开发：廖佳星 样式文件 -->
<template>
  <div class="WarehouseInside">
    <div class="LossManagement">
      <!-- 头部标题 -->
      <div class="flexBOX flexBOXS">
        <V-Title title="盘点计划单详情页" style="width:100%;"></V-Title>
      </div>
      <!-- 信息展示 -->
      <div class="p-20 pb-0 section-cont yy-detail">
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">盘点单号：</div>
            <div class="value" v-text="dataObject.inventoryId"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">盘点状态：</div>
            <div class="value">{{getNameByMaId('takestock_status',dataObject.inventoryStatus)}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">盘点类型：</div>
            <div class="value">{{getNameByMaId('takestock_type',dataObject.inventoryType)}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">盘点仓库：</div>
            <div class="value" v-text="dataObject.warehouse"></div>
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
            <div class="label tr">盘点货位数：</div>
            <div class="value" v-text="dataObject.goodsLocationCount"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">盘点SKU数：</div>
            <div class="value" v-text="dataObject.totalSku"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">盘点任务数：</div>
            <div class="value" v-text="dataObject.inventoryTaskCount"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">盘点库区数：</div>
            <div class="value" v-text="dataObject.warehoseCount"></div>
          </div>
        </div>
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">单据来源：</div>
            <div class="value" v-text="dataObject.dataSource"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">来源单号：</div>
            <div class="value" v-text="dataObject.sourceOrder"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">盘点人：</div>
            <div class="value" v-text="dataObject.inventoryPerson"></div>
          </div>
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
          <div>盘点计划单明细</div>
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
    <V-BottomBtn routerTO="/WarehouseInside/TakeStockPlan"></V-BottomBtn>
  </div>
</template>

<script>
import { TakeStockPlanDetails } from "./cols";

export default {
  name:'WarehouseInside_TakeStockPlanDetails',
  data() {
    return {
      inventoryId:"",
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      dataObject:{},
      // 表格组件数据
      dataSource: {
        data: [], // 表格数据
        cols: TakeStockPlanDetails, // 表格的列数据
      },
    };
  },
  methods: {
    // 盘点计划单号查询详情
    searchData() {
      const that=this
      let params = {inventoryId: that.inventoryId}
      that.$api.WarehouseInside.PlanInventoryId(params).then((res) => {
        that.dataObject = res.data
      }).catch((err) => {console.log(err)});
    },
    // 盘点明细查询
    search(){
      const that=this
      that.$set(that.dataSource,'loading',true)
      let params = {
        pageNum:that.PageNum,
        pageSize:that.PageSize,
        inventoryId: that.inventoryId // 盘点单号 （包含多条任务单号）
      }
      that.$api.WarehouseInside.pageQueryDetail(params).then((res) => {
        that.dataSource.data = res.data.list
        that.total = res.data.total
        that.$set(that.dataSource,'loading',false)
      }).catch((err) => {console.log(err)});
    },
    // 分页器-采用混入方法
  },
  created() {},
  activated() {
    this.inventoryId = this.$route.query.id;//盘点单号
    this.getMoreMaList('takestock_status', 'takestock_type').then(()=>{
      this.searchData()
    })
  },
  computed: {}
};
</script>
