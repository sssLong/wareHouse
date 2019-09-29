<!-- 盘点计划单  页面开发：廖佳星 样式文件 -->
<template>
  <div class="WarehouseInside">
    <div class="TakeStockPlan">
      <!-- 头部标题+搜索 -->
      <div class="flexBOX flexBOXS">
        <V-Title title="盘点计划单" style="width:100%;">
          <div class="search-content">
            <el-input
              clearable
              placeholder="请输入查询内容"
              v-model.trim="inputContent"
              @keyup.native.enter="PageNum=1;search()"
              @clear="PageNum=1;search()" 
              class="input-with-select"
            >
              <el-select
                v-model="value1"
                placeholder="请选择"
                class="iconfont icon-xiala selectShelf"
                slot="prepend"
              >
                <el-option
                  v-for="item in option1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="PageNum=1;search()"></el-button>
            </el-input>
          </div>
        </V-Title>
      </div>
      <!-- 查询条件 -->
      <div class="flexBOX p-20">
        <!-- 创建时间 -->
        <el-select v-model="value2" @change="PageNum=1;search()" placeholder="创建时间" style="width:105px;">
          <el-option
            v-for="item in option2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- 日期时间选择器 -->
        <el-date-picker
          v-model="TimeValue"
          @change="PageNum=1;search()"
          class="ml-10"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-select v-model="value3" @change="PageNum=1;search()" clearable  placeholder="选择盘点状态" class="ml-10" style="width:140px;">
          <el-option
            v-for="item in MaBiaoObj.takestock_statusList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select v-model="value4" @change="PageNum=1;search()" clearable  placeholder="选择盘点类型" class="ml-10" style="width:140px;">
          <el-option
            v-for="item in MaBiaoObj.takestock_typeList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <div class="resetStyle" @click="replacement">重置</div>
      </div>

      <!-- 引入表格公共组件 START -->
      <div class="table-container pl-20 pr-20">
        <!-- 批量操作 -->
        <div class="flexBOX flexBOXS Operation">
          <div>盘点单列表</div>
          <ul>
            <li @click="TakeStockAddTo" v-show="btnPermission('添加盘点单')">
              <i class="iconfont iconchuangjianqiaban"></i>添加盘点单
            </li>
            <li @click="exportFn" v-show="btnPermission('导出')">
              <i class="iconfont icondaochu"></i>导出
            </li>
          </ul>
        </div>
        <V-Table
          :dataSource="dataSource"
          @selection-change="handleSelectionChange"
          @vivews="checkTo"
          @cancel="cancel"
        ></V-Table>
      </div>
      <!-- 引入表格公共组件 END -->
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
      <!-- 组件主盒子分割线 -->
      <el-dialog
        title="取消盘点单"
        :visible.sync="cancelTakeStock"
        width="480px">
        <div class="p-20 fz14" style="text-align:center">
          确定取消此盘点单？
        </div>
        <span slot="footer">
          <el-button @click="cancelTakeStock = false">取 消</el-button>
          <el-button type="primary" @click="cancelSbm">确 定</el-button>
        </span>
      </el-dialog>
      
    </div>
  </div>
</template>

<script>
import { TakeStockPlanCols } from "./cols";

export default {
  name:'WarehouseInside_TakeStockPlan',
  data() {
    return {
      inputContent: "", //搜索值
      value1: 1,
      option1: [{ value: 1, label: "盘点单号" },
        { value: 2, label: "创建人" },
        { value: 3, label: "取消人" },
        { value: 4, label: "盘点人" }],

      value2: 1, //时间类型
      option2: [{value: 1,label: "创建时间"},
        {value: 2,label: "取消时间"}],

      TimeValue: [], //时间

      value3: "", //选择盘点状态
      value4: "", //选择单据状态
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      tableList: [], //表格勾选中的行
      cancelTakeStock: false,
      tableRow: null,
      // 表格组件数据
      dataSource: {
        data: [], // 表格数据
        cols: TakeStockPlanCols, // 表格的列数据
        isSelection: true, // 表格有多选时设置
        isOperation: true, // 表格有操作列时设置
        operation: {
          // 表格有操作列时设置
          label: "操作", // 列名
          width: "120", // 根据实际情况给宽度
          data: [
            {
              label: "查看", // 操作名称
              emitType: "vivews", // 触发父组件
              permission: "盘点计划详情页" // 后期这个操作的权限，用来控制权限
            },
            {
              label: "取消", // 操作名称
              emitType: "cancel", // 触发父组件
              permission: "取消" // 后期这个操作的权限，用来控制权限
            }
          ]
        }
      }
    };
  },

  methods: {
    // 查询数据，导出时用
    dataSources(){
      const that = this
      let datas = {
        pageNum: that.PageNum,//页数
        pageSize: that.PageSize,//行数
        inventoryId: that.value1===1?that.inputContent:null,//盘点单号
        creator: that.value1===2?that.inputContent:null,//创建人
        cancelPerson: that.value1===3?that.inputContent:null,//取消人
        inventoryPerson: that.value1===4?that.inputContent:null,//盘点人
        queryCreateBeginTime: that.value2===1&&that.TimeValue?that.TimeValue[0]:null,//创建开始时间
        queryCreateEndTime: that.value2===1&&that.TimeValue?that.TimeValue[1]:null,//创建结束时间
        queryCancelBeginTime: that.value2===2&&that.TimeValue?that.TimeValue[0]:null,//取消开始时间
        queryCancelEndTime: that.value2===2&&that.TimeValue?that.TimeValue[1]:null,//取消结束时间
        inventoryStatus: that.value3?that.value3:null,//盘点状态 (DCP(待初盘)|CPZ(初盘中)|CPWC(初盘完成)|DFP(待复盘)|FPZ(复盘中)|FPWC(复盘完成))
        inventoryType: that.value4?that.value4:null//动盘(1)/静盘(2),默认动盘
      }
      return datas
    },
    search() {
      const that = this
      that.$set(that.dataSource,'loading',true)
      let params = that.dataSources()
      that.$api.WarehouseInside.AQPlanList(params).then((res) => {
        const {data} = res
        data.list.forEach(v => {
          v.inventoryStatus = that.getNameByMaId('takestock_status',v.inventoryStatus) //盘点状态转换
          v.inventoryType = that.getNameByMaId('takestock_type',v.inventoryType) //盘点类型转换
        });
        that.dataSource.data=data.list
        that.total=data.total
        that.$set(that.dataSource,'loading',false)
      }).catch((err) => {console.log(err)});
      
    },
    // 导出
    exportFn(){
      // 导出方法
      const that=this;
      let params = that.dataSources()
      let url = '/warehouse/new/inventoryMesaage/exportInventoryMessage' //后台2.0
      that.$utils.commonUtils.export('post',url,params,'盘点计划单表格','.xls')
    },
    // 重置
    replacement() {
      const that = this 
      that.inputContent = "" 
      that.value2 = 1
      that.TimeValue = []
      that.value3 = ""
      that.value4 = ""
      that.PageNum = 1
      that.search()
    },
    // 取消
    cancelSbm(){
      const that = this
      let params = {
        cancelName: localStorage.getItem('accountName'),//取消人
        inventoryOrderIds: [that.tableRow.inventoryId] 
      }
      that.$api.WarehouseInside.cancelInventoryOrder(params).then((res) => {
        if(res.errorCode==='100200'){
          that.cancelTakeStock = false
          that.$message.success('取消盘点计划单成功！')
          that.search()
        }
      }).catch((err) => {console.log(err)});
    },
    cancel(index,row){
      if(row.inventoryStatus==='已取消'){
        this.$message.error('不能重复取消')
        return
      }
      this.cancelTakeStock = true
      this.tableRow = row
    },
    // 表格勾選
    handleSelectionChange(val) {
      this.tableList = val;
    },
    // 查看跳转去盘点计划单详情页
    checkTo(index,row) {
      this.$router.push({ path: "/WarehouseInside/TakeStockPlanDetails", query: {id:row.inventoryId}});
    },
    // 跳转去新增盘点单
    TakeStockAddTo() {
      this.$router.push({ path: "/WarehouseInside/TakeStockAdd" });
    }

    // 分页器-采用混入方法
  },

  created() {
  },
  activated(){
    // 盘点状态，盘点类型
    this.getMoreMaList('takestock_status', 'takestock_type') //查询方法在码表里面调用
  },
  computed: {},
  // 关闭弹窗
  deactivated(){
    this.cancelTakeStock = false
  }
};
</script>
