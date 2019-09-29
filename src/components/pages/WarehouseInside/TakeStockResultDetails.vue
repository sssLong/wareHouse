<!--
 * @Autor: 廖佳星
 * @LastEditors: 廖佳星
 * @LastEditTime: 2019-08-22 15:42:08
 -->
<!-- 盘点单结果详情页  页面开发：廖佳星 样式文件 -->
<template>
  <div class="WarehouseInside">
    <div class="TakeStockResultDetails">
      <!-- 头部标题 -->
      <div class="flexBOX flexBOXS">
        <V-Title title="盘点单结果详情页" style="width:100%;">
          <div class="search-content">
            <el-input
              clearable
              @clear="PageNum=1;search()"
              @keyup.native.enter="PageNum=1;search()"
              placeholder="请输入"
              v-model.trim="inputContent"
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
      <!-- 信息展示 -->
      <div class="m-20 mb-0 section-cont yy-detail" style="borderBottom:solid 1px #DCDFE6">
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">盘点单号：</div>
            <div class="value" v-text="datas.inventoryId"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">客户名称：</div>
            <div class="value" v-text="datas.customer"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">盘点类型：</div>
            <div class="value">{{getNameByMaId('takestock_type',datas.inventoryType)}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">盘点仓库：</div>
            <div class="value" v-text="datas.warehouse"></div>
          </div>
        </div>
        <div class="section-item">
          <div class="cont-item">
            <div class="label tr">盘点状态：</div>
            <div class="value">{{getNameByMaId('takestock_status',datas.inventoryStatus)}}</div>
          </div>
          <div class="cont-item">
            <div class="label tr">创建人：</div>
            <div class="value" v-text="datas.creator"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">创建时间：</div>
            <div class="value" v-text="datas.createTime"></div>
          </div>
          <div class="cont-item">
            <div class="label tr">有无差异：</div>
            <div class="value">{{getNameByMaId('is_different',datas.inventoryResult)}}</div>
          </div>
        </div>
      </div>


      <!-- 查询条件 -->
      <div class="flexBOX p-20">
        <!-- 创建时间 -->
        <el-select v-model="value2" @change="PageNum=1;search()" placeholder="时间类型" style="width:135px;">
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
        <el-select v-model="value3" @change="PageNum=1;search()" clearable placeholder="选择盘点结果" class="ml-10" style="width:140px;">
          <el-option
            v-for="item in MaBiaoObj.takestock_resultList"
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
        <div class="Operation flexBOX flexBOXS">
          <div>盘点单结果详情列表</div>
          <ul>
            <li @click="addLossVisible" v-show="btnPermission('生成损溢单')">
              <i class="iconfont iconchuangjianqiaban"></i>生成损溢单
            </li>
          </ul>
        </div>
        <V-Table :dataSource="dataSource" @selection-change="handleSelectionChange">
          <!-- slot 自定义列的情况 -->
          <!-- 差异数 -->
          <template slot-scope="scopes" slot="zidingyi1">
            <span :class="scopes.scope.row.skuDifference===0?'':(scopes.scope.row.skuDifference>0?'orginColor':'blurColor')">
              {{scopes.scope.row.skuDifference}}
            </span>
          </template>
          <!-- 盘点结果 -->
          <template slot-scope="scopes" slot="zidingyi2">
            <span>{{getNameByMaId('takestock_result',scopes.scope.row.inventoryResult)}}</span>
          </template>
          <!-- 已转损溢//0 表示没有  1表示已转 -->
          <template slot-scope="scopes" slot="zidingyi3">
            <span>{{scopes.scope.row.turnProfitOrLoss==='YZ'?'已转':'未转'}}</span>
          </template>
        </V-Table>
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


      <el-dialog title="生成损溢单" :visible.sync="ResultVisible" width="480px">
        <div style="text-align:center">是否生成损溢单，请确认</div>
        <span slot="footer">
          <el-button @click="ResultVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm" :disabled="confirmStala">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <V-BottomBtn routerTO="/WarehouseInside/TakeStockResult"></V-BottomBtn>
  </div>
</template>

<script>
import { TakeStockResultDetailsCols } from "./cols";

export default {
  name:'WarehouseInside_TakeStockResultDetails',
  data() {
    return {
      inventoryId:"",//盘点单号

      inputContent:"",//搜索值
      value1:1,//搜索类型
      option1:[{value: 1,label: "初盘人"},
        {value: 2,label: "复盘人"},
        {value: 3,label: "SKU"}],
      value2:1,//时间类型
      option2:[{value:1,label:'生成损溢时间'},
        {value:2,label:'初盘时间'},
        {value:3,label:'复盘时间'}],
      
      value3:"",//盘点结果
      TimeValue:[],
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数

      // 表格组件数据
      dataSource: {
        data: [], // 表格数据
        cols: TakeStockResultDetailsCols, // 表格的列数据
        isSelection: true, // 表格有多选时设置
        isOperation: false, // 表格有操作列时设置
      },
      confirmStala: false,//按钮禁用
      datas:{},
      ResultVisible:false,
      tableList:[],//表格勾选数据
      AddLossList:[],//生成损溢单数据
    };
  },
  methods: {
    // 查询盘点单结果
    searchData(){
      const that = this 
      let params = {
        pageNum:1,   //页码
        pageSize:1,   //行数
        inventoryId:that.inventoryId   //盘点单号
      }
      that.$api.WarehouseInside.AQInventoryResult(params).then((res) => {
        that.datas = res.data.list[0]
      }).catch((err) => {console.log(err)});
    },
    // 分页查询盘点单结果详情列表
    search() {
      const that = this
      that.$set(that.dataSource,'loading',true)
      let params = {
        pageNum: that.PageNum, //页码
        pageSize: that.PageSize,//行数
        inventoryId: that.inventoryId,//盘点单号
        inventoryPerson: that.value1===1&&that.inputContent?that.inputContent:null,//初盘人
        secondInventoryPerson: that.value1===2&&that.inputContent?that.inputContent:null,//复盘人
        sku: that.value1===3&&that.inputContent?that.inputContent:null,//SKU
        queryProfitOrLossBeginTime:that.value2===1&&that.TimeValue?that.TimeValue[0]:null,//损溢开始时间
        queryProfitOrLossEndTime:that.value2===1&&that.TimeValue?that.TimeValue[1]:null,//损溢结束时间
        takeStockBeginTime:that.value2===2&&that.TimeValue?that.TimeValue[0]:null,//初盘开始时间
        takeStockEndTime:that.value2===2&&that.TimeValue?that.TimeValue[1]:null,//初盘结束时间
        takeSecondStockBeginTime:that.value2===3&&that.TimeValue?that.TimeValue[0]:null,//复盘开始时间
        takeSecondStockEndTime:that.value2===3&&that.TimeValue?that.TimeValue[1]:null,//复盘结束时间
        inventoryResult:that.value3,//盘点结果 PY 盘盈，PK 盘亏，WCY 无差异，YCY 有差异
      }
      that.$api.WarehouseInside.AQInventoryId(params).then((res) => {
        that.dataSource.data = res.data.list
        that.total = res.data.total
        that.$set(that.dataSource,'loading',false)
      }).catch((err) => {console.log(err)});
    },
    
    addLossVisible(){
      const that = this
      if(that.tableList.length===0){
        that.$message.warning('请勾选要操作的数据！')
        return
      }
      that.AddLossList=[]
      for (let i = 0; i < this.tableList.length; i++) {
        const v = this.tableList[i]
        if(v.inventoryResult==='WCY'){
          that.$message.error('勾选数据中含有正常的数据！')
          return
        }else if(v.turnProfitOrLoss==='YZ'){
          that.$message.error('勾选数据中含有已转损溢的数据！')
          return
        }else if(v.skuDifference!==0 && !v.secondInventoryPerson){
          that.$message.error('初盘有差异的盘点单未复盘完成不可生成损溢单！')
          return
        }else{
          this.AddLossList.push({
          sourceType:'PDYC',//后台要求写死盘点异常
          creator:this.datas.creator,//创建人
          customer:this.datas.customer,//客户名称
          sourceOrder:this.datas.inventoryId,//来源单号，就是盘点单号
          warehouseCode: this.datas.warehouseCode,//仓库Code
          sku:v.sku,//sku
          commodityName:v.skuName,//商品名称  
          goodsLocation:v.goodsPositionCode,//货位
          lossSpillCount: Math.abs(v.skuDifference),//损溢数取差异数值
          lossSpillType:v.inventoryResult==='PK'?'BS':'BY', //损溢类型 //盘亏(0)/正常(1)/盘盈(2),默认是正常 
          taskInventoryFirstDetailId: v.id//任务单的详情信息id 
          
          // currentShelfLocationId: v.positionId //货位id 后台字段删除
        })
        }
      }
      that.ResultVisible=true
    },
    // 确定生成损溢单
    confirm(){
      const that = this
      that.confirmStala = true //按钮禁用
      that.$api.WarehouseInside.addLossSpillInfo(that.AddLossList).then((res) => {
        if(res.errorCode==='100200'){
          that.ResultVisible=false
          that.$message.success('生成损溢单成功')
          that.search()
        }
        that.confirmStala = false //按钮恢复
      }).catch((err) => {
        console.log(err);
        that.confirmStala = false //按钮恢复
      });
    },
    // 重置
    replacement(){
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
      this.tableList =  val
    },
  },

  activated(){
    this.inventoryId = this.$route.query.id;//盘点单号
    // 盘点结果，盘点状态，盘点类型，有无差异
    this.getMoreMaList('takestock_result','takestock_status','takestock_type','is_different').then(()=>{
      this.searchData()
    })
    if(sessionStorage.getItem('ifReset')&&JSON.parse(sessionStorage.getItem('ifReset'))){
      this.replacement()
      sessionStorage.removeItem('ifReset')
    }
    
  },
  created() {},
  computed: {},
  // 关闭弹窗
  deactivated(){
    this.ResultVisible = false
  }
};
</script>
