/*
 * @Author: 李步钻 
 * @Date: 2019-06-04 09:48:57 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-09-05 14:15:50
 */
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="订单池">
        <!-- <div class="title-bar-icon" @click="dialogVisible=true"><i class="iconfont iconcanshupeizhi"></i>&nbsp;参数配置</div> -->
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
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="PageNum=1;search()"></el-button>
          </el-input>
        </div>
      </V-Title>
      <div class="condition">
        <el-select class="selectTimeType" v-model="queryOption.timeType" placeholder="时间类型">
          <el-option label="付款时间" value="N"></el-option>
          <el-option label="最迟发货时间" value="Y"></el-option>
        </el-select>
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
        <el-select @change="PageNum=1;search()" clearable filterable v-model="queryOption.warehouseCode" placeholder="仓库名称">
          <el-option
            v-for="item in warehouseList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select class="selectOrderType" @change="PageNum=1;search()" clearable filterable v-model="queryOption.orderType" placeholder="选择订单类型">
          <el-option
            v-for="item in MaBiaoObj.order_typeList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select  @change="PageNum=1;search()" v-model="queryOption.salesChannels" style="width: 140px" clearable filterable placeholder="选择销售渠道">
           <el-option v-for="item in platformList" :key="item.platformCode" :label="item.platformCn" :value="item.platformCode"></el-option>
        </el-select>  
        <el-select @change="PageNum=1;search()" class="selectOrderType" v-model="queryOption.orderStatus" clearable filterable placeholder="选择包裹状态">
          <el-option
            v-for="item in MaBiaoObj.package_statusList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <span class="reset" @click="reset">重置</span>
      </div>
    </div>
    <div class="table-container">
      <div class="table-operation">
        <div class="title">订单列表</div>
        <div class="operation">
          <div class="parcel">
            <i class="iconfont iconshujutongji"></i>
            <span>包裹数：{{total}}</span>
          </div>
          <div @click="manualCreateY('Y')" v-show="btnPermission('库存分配')">
            <i class="iconfont iconkucunfenpei"></i>
            <span>库存分配</span>
          </div>
          <!-- <div @click="manualCreateY('N')">
            <i class="iconfont iconshoudonghuoqu"></i>
            <span>手动获取</span>
          </div> -->
        </div>
      </div>

      <!-- 引入表格公共组件 START -->
      <V-Table
        :dataSource="dataSource"
        @selection-change="handleSelectionChange"
        @review="handleReview"
        @sort-change="handleSort"
      >
        <template slot-scope="scopes" slot="priority">
          <span v-text="$utils.commonUtils.filters(priorityList,scopes.scope.row.priority)"></span>
        </template>
        <!-- slot 自定义列的情况 -->
        <template slot-scope="scopes" slot="salesChannels">
          {{returnStr(platformList, scopes.scope.row.salesChannels, 'platformCode', 'platformCn')}}
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
import { OrderPoolCols } from "./cols";
import { JSON_TYPE } from "@/common/config"
import moment from 'moment';
export default {
  name: 'OutgoingOperation_OrderPool',
  data() {
    return {
      order: "", //运单号
      inputContent: "", // 输入框的值
      selectValue: "buyer", // 输入框前置条件下拉框选中的条件值
      selectTimeType: "", // 选择时间类型
      timeValue: "", // 时间
      options: [
        {
          label: "买家",
          value: "buyer"
        },
        {
          label: "订单号",
          value: "orderNum"
        },
        {
          label: "目的地",
          value: "destination"
        },
        {
          label: "包裹号",
          value: "packageNum"
        },
        {
          label: "SKU",
          value: "sku"
        }
      ],
      dataSource: {
        data: [], // 表格数据
        cols: OrderPoolCols, // 表格的列数据
        isSelection: true, // 表格有多选时设置
        isOperation: true, // 表格有操作列时设置
        isIndex: true, // 列表序号
        loading: false, // loading
        operation: {
          // 表格有操作列时设置
          label: "操作", // 列名
          width: "80", // 根据实际情况给宽度
          data: [
            {
              label: "查看", // 操作名称
              emitType: "review", // 触发父组件
              permission: "订单池详情页" // 后期这个操作的权限，用来控制权限
            }
          ]
        }
      },
      multipleSelection: [],
      multipleSelectionCopy: [],
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      queryOption: {
        // 订单列表查询
        warehouseCode: "",
        orderType: "",
        orderStatus: "",
        timeType: "N",
        startTime: "",
        endTime: ""
      },
      platformList:[],
      wName:'',
      priorityList: ["低", "中", "高"], // 优先级数组 回显列表文本
      sortQuery: {}, // 排序查询对象参数  防止点击分页时丢失这个参数

    };
  },
  created() {
    this.getWareHouse(); // 仓库数据
    this.getMoreMaList("order_type", "package_status", "package_type","sales_channel");
    // 获取平台
    this.getPlatformList() 
  },
  methods: {
    // 获取订单列表数据 查询
    async search() {
      this.$set(this.dataSource, "loading", true);
      const { PageNum: page, PageSize: row } = this;
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.getOrderList(
        Object.assign(
          { page, row, [this.selectValue]: this.inputContent },
          this.queryOption,
          this.sortQuery
        )
      );
      this.$set(this.dataSource, "loading", false);
      if (errorCode === "100200") {
        const { list, total } = data.pageInfo;
        for (const item of list) {
           await this.getWarehoseDetail(item.warehouseCode)
           item.warehouseName = this.wName
        }
        this.dataSource.data = list;
        this.total = total;
      }
    },
     // 获取平台
    async getPlatformList() {
      let res = await this.$api.LogisticsManage.getPlatformList({page: 1, row: Math.pow(10,8), isValid: 1})
      this.platformList = res.data.pageInfo.list
    },
    // 根据仓库编码获取仓库名称
    async getWarehoseDetail(warehouseCode) {
     
      let params = {
        warehouseCode: warehouseCode
      }
       const {
        errorCode,
        data:{warehouseName}
      } = await this.$api.OutgoingOperation.getWarehoseDetail(
        params
      );
      if (errorCode === "100200") {
          this.wName = warehouseName
          console.log(this.wName,'wnamw');
          
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
      this.multipleSelection = []
      val.forEach( item => {
        if(this.multipleSelection.includes(item.packageNum)) return;
        this.multipleSelection.push(item.packageNum)
      })
      this.multipleSelectionCopy = val
      console.log(this.multipleSelectionCopy, "this.multipleSelectionCopy");
    },
    // 库区分配
    async manualCreateY(type) {
      if(this.multipleSelection.length === 0) {
        this.$utils.commonUtils.tip('请选择订单','warning')
        return;
      };
      if( type === 'Y') {
          let isDistribution  = this._isDistribution()
          if(isDistribution) {
            this.$utils.commonUtils.tip('只能选择库存分配失败订单','error')
            return;
          }
      }else{
          let isObtain  = this._isObtain()
          if(isObtain) {
            this.$utils.commonUtils.tip('只能选择物流获取失败订单','error')
            return;
          }
      }
      const {
        errorCode,
        data
      } = await this.$api.OutgoingOperation.manualCreate(type, this.multipleSelection, JSON_TYPE);
      if(errorCode === '100200'){
        type === 'Y'? this.$utils.commonUtils.tip('库存分配成功','success'): this.$utils.commonUtils.tip('手动获取成功','success')
        this.search()
      }
    },
    // 格式化内容
    returnStr(arr, rowId, valueId = 'dataCode', name = 'dataName') {
      if (!Array.isArray(arr)) return
      let data = arr.find(value => rowId == value[valueId])
      return data ? data[name] : null
    },
     // 重置
     reset() {
        Object.assign(this.$data, this.$options.data());
        // 重置时取缓存的数据，不重新调接口
        if (localStorage.getItem('MaBiaoObj') || localStorage.getItem('warehouseList')) {
            this.MaBiaoObj = JSON.parse(localStorage.getItem('MaBiaoObj'))
            this.warehouseList = JSON.parse(localStorage.getItem('warehouseList'))
        }
        this.search(1);
        this.getPlatformList()
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
    // 查看
    handleReview(index, row) {
      this.$router.push({path:"/OutgoingOperation/OrderPoolDetails",query:{packageNum:row.packageNum,warehouseName:row.warehouseName}});
    },
    // 是否是库存分配失败
    _isDistribution() {
      for (const iterator of this.multipleSelectionCopy) {
        if(iterator.orderStatus != '8') return true

      }
    },
    // 是否是物流获取失败
    _isObtain() {
      for (const iterator of this.multipleSelectionCopy) {
        if(iterator.orderStatus != '5') return true

      }
    }
  }
};
</script>
