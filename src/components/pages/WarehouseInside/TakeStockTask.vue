<!-- 盘点任务单  页面开发：廖佳星 样式文件 -->
<template>
  <div class="WarehouseInside">
    <div class="TakeStockTask">
      <!-- 头部标题+搜索 -->
      <div class="flexBOX flexBOXS">
        <V-Title title="盘点任务单" style="width:100%;">
          <div class="search-content">
            <el-input
              @keyup.native.enter="PageNum=1;search()" 
              clearable 
              placeholder="请输入查询内容" 
              v-model.trim="inputContent" 
              class="input-with-select" 
              @clear="PageNum=1;search()">
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
          <!-- 任务单状态 -->
          <el-select v-model="value3" @change="PageNum=1;search()" clearable placeholder="选择任务单状态" class="ml-10" style="width:150px;">
            <el-option
              v-for="item in MaBiaoObj.takestock_statusList"
              :key="item.dataCode"
              :label="item.dataName"
              :value="item.dataCode"
            ></el-option>
          </el-select>
          <div class="resetStyle" @click="replacement">重置</div>
        </div>
        
        <!-- 表格 -->
        <!-- 批量操作 -->
        <div class="table-container pl-20 pr-20">
          <div class="Operation">
            <div>盘点任务单列表</div>
          </div>
          <V-Table :dataSource="dataSource" @selection-change="handleSelectionChange" @check="checkTo"></V-Table>
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
      <!-- 组件主盒子分割线 -->
    </div>
  </div>
</template>

<script>
import { TakeStockTaskCols } from "./cols";

export default {
  name:'WarehouseInside_TakeStockTask',
  data() {
    return {
      inputContent: "", //搜索值
      value1: 1,
      option1:[{value:1,label:"任务单号"},
        {value:2,label:"盘点单号"}],

      value2: 1, //时间类型
      option2: [{value: 1,label: "创建时间"},
        {value: 2,label: "取消时间"}],

      TimeValue: [], //时间

      value3: "", //任务单状态

      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      tableList: [], //表格勾选中的行
      // 表格组件数据
      dataSource: {
        data: [], // 表格数据
        cols: TakeStockTaskCols, // 表格的列数据
        isOperation: true, // 表格有操作列时设置
        operation: {
          // 表格有操作列时设置
          label: "操作", // 列名
          width: "80", // 根据实际情况给宽度
          data: [
            {
              label: "查看", // 操作名称
              emitType: "check", // 触发父组件
              permission: "盘点任务详情页" // 后期这个操作的权限，用来控制权限
            }
          ]
        }
      },
    };
  },


  methods: {
    search() {
      const that=this
      that.$set(that.dataSource,'loading',true)
      let params={
        pageNum: that.PageNum,//页数
        pageSize: that.PageSize,//页数
        inventoryId: that.value1===2?that.inputContent:'',//盘点单号   （盘点单号下包含多个任务单号）
        inventoryTaskId: that.value1===1?that.inputContent:'',//任务单号
        taskStatus: that.value3,//任务单状态
        queryCreateBeginTime :that.value2===1&&that.TimeValue?that.TimeValue[0]:null,//创建开始时间
        queryCreateEndTime :that.value2===1&&that.TimeValue?that.TimeValue[1]:null,//创建结束时间
        queryCancelBeginTime :that.value2===2&&that.TimeValue?that.TimeValue[0]:null,//取消开始时间
        queryCancelEndTime :that.value2===2&&that.TimeValue?that.TimeValue[1]:null//取消结束时间
      }
      that.$api.WarehouseInside.AQTaskList(params).then((res) => {
        res.data.list.forEach(v => {
          v.taskStatus = that.getNameByMaId('takestock_status',v.taskStatus) //盘点状态转换
        })
        that.dataSource.data=res.data.list
        that.total=res.data.total
        that.$set(that.dataSource,'loading',false)
      }).catch((err) => {console.log(err)});
      
    },
    // 重置
    replacement() {
      const that = this 
      that.inputContent = ""
      that.value2 = 1
      that.TimeValue = []
      that.value3 = ""
      that.PageNum = 1
      that.search()
    },
    // 表格勾選
    handleSelectionChange(val) {
      this.tableList = val;
    },
   
    // 查看跳转去盘点任务单详情页
    checkTo(index,row) {
      this.$router.push({ path: "/WarehouseInside/TakeStockTaskDetails" , query: {id:row.inventoryTaskId}});
    }

    // 分页器 - 采用混入方法
  },

  created() {},
  activated(){
    this.getMoreMaList('takestock_status') //查询方法在码表中调用
  },

  computed: {}
};
</script>
