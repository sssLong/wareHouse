<!-- 盘点单结果  页面开发：廖佳新 样式文件 -->
<template>
  <div class="WarehouseInside">
    <div class="TakeStockResult">
      <!-- 头部标题+搜索 -->
      <div class="flexBOX flexBOXS">
        <V-Title title="盘点单结果" style="width:100%;">
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
        <el-select v-model="value2" @change="PageNum=1;search()" placeholder="时间类型" style="width:105px;">
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
        <el-select v-model="value3" @change="PageNum=1;search()" clearable placeholder="选择有无差异" class="ml-10" style="width:140px;">
          <el-option
            v-for="item in MaBiaoObj.is_differentList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select v-model="value4" @change="PageNum=1;search()" clearable placeholder="选择盘点类型" class="ml-10" style="width:140px;">
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
          <div>盘点单结果列表</div>
        </div>
        <V-Table :dataSource="dataSource" @selection-change="handleSelectionChange" @check="checkTo">

        </V-Table>
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
      </div>
      <!-- 组件主盒子分割线 -->
    </div>
  </div>
</template>

<script>
import { TakeStockResultCols } from "./cols";

export default {
  name:'WarehouseInside_TakeStockResult',
  data() {
    return {
      inputContent: "", //搜索值
      value1: 1,
      option1: [
        { value: 1, label: "盘点单号" },
        { value: 2, label: "创建人" }
      ],
      value2: 1, //时间类型
      option2: [
        {
          value: 1,
          label: "创建时间"
        }
      ],
      TimeValue: [], //时间
      value3: "", //有无差异
      value4: "", //盘点类型
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      tableList: [], //表格勾选中的行
     
      // 表格组件数据
      dataSource: {
        data: [], // 表格数据
        cols: TakeStockResultCols, // 表格的列数据
        isSelection: true, // 表格有多选时设置
        isOperation: true, // 表格有操作列时设置
        operation: {
          // 表格有操作列时设置
          label: "操作", // 列名
          width: "80", // 根据实际情况给宽度
          data: [
            {
              label: "查看", // 操作名称
              emitType: "check", // 触发父组件
              permission: "盘点结果详情页" // 后期这个操作的权限，用来控制权限
            }
          ]
        }
      },
    };
  },

  methods: {
    search() {
      const that = this 
      that.$set(that.dataSource,'loading',true)
      let params = {
        pageNum: that.PageNum,   //页码
        pageSize: that.PageSize,   //行数
        inventoryId: that.value1===1?that.inputContent:null,   //盘点单号 （盘点单号下面包含多个任务单号）
        creator: that.value1===2?that.inputContent:null,   //创建人
        inventoryResult: that.value3,//有无差异
        inventoryType:that.value4,   //盘点类型
        queryCreateBeginTime:that.value2===1&&that.TimeValue?that.TimeValue[0]:null,    //创建开始时间
        queryCreateEndTime:that.value2===1&&that.TimeValue?that.TimeValue[1]:null   //创建结束时间
      }
      that.$api.WarehouseInside.AQInventoryResult(params).then((res) => {
        res.data.list.forEach(v => {
          v.inventoryType = that.getNameByMaId('takestock_type',v.inventoryType) //盘点类型转换
          v.inventoryStatus = that.getNameByMaId('takestock_status',v.inventoryStatus) //盘点状态转换
          v.inventoryResult = that.getNameByMaId('is_different',v.inventoryResult)//有无差异转换
        });
        that.dataSource.data = res.data.list
        that.total = res.data.total
        that.$set(that.dataSource,'loading',false)
      }).catch((err) => {console.log(err)});
    },
    // 重置
    replacement() {
      const that = this
      that.inputContent = ""
      that.value3 = ""
      that.value4 = ""
      that.value2 = 1
      that.TimeValue = []
      that.PageNum = 1
      that.search()
    },
    // 表格勾選
    handleSelectionChange(val) {
      this.tableList = val;
    },
    // 跳转至查看页
    checkTo(index,row){
      this.$router.push({path:'/WarehouseInside/TakeStockResultDetails',query:{id:row.inventoryId}})
      sessionStorage.setItem('ifReset',true)
    },
    // 分页器采用混入方法
  },
  activated(){
    // 盘点类型，有无差异，盘点状态
    this.getMoreMaList('takestock_type','is_different','takestock_status') //查询方法在码表方法里面调用
  },
  created() {},
  computed: {}
};
</script>
