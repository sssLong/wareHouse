<!--
 * @Autor: 廖佳星
 * @Date: 2019-06-25 15:55:46
 * @LastEditors: 廖佳星
 * @LastEditTime: 2019-08-28 14:25:52
 * @CssStyle: WarehouseInside/index.scss
 -->
<template>
  <div class="WarehouseInside">
    <div class="TakeStockAdd">
      <V-Title title="添加盘点单">
        <div class="search-content">
          <el-input
           v-model.trim="inputContent"
           @keyup.native.enter="PageNum=1;search()" 
           @clear="PageNum=1;search()" 
           clearable 
           class="input-with-select" 
           placeholder="多个请用英文逗号隔开">
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

      <!-- 查询条件 -->
      <div class="flexBOX p-20">
        <!-- 仓库名称 -->
        <el-select v-model="value2" @change="AQCode();replawhouse()" placeholder="仓库名称" style="width:150px;">
          <el-option
            v-for="item in warehouseList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <!-- 选择客户 -->
        <el-select
         v-model="value5" 
         @change="PageNum=1;search()" 
         clearable 
         placeholder="请选择客户" 
         class="ml-10" 
         style="width:150px;">
          <el-option
            v-for="item in customerList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <!-- 是否全盘 -->
        <el-select v-model="value4" placeholder="是否全盘" class="ml-10" style="width:130px;">
          <el-option
            v-for="item in option4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- 选择 库区、货列 -->
        <el-select v-model="value6" v-if="value4!=='QBPD'" @change="AQCode();value7=[];" placeholder="请选择" class="ml-10 kuquClass">
          <el-option
            v-for="item in options6"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> 
        <el-select
          v-model="value7"
          @change="PageNum=1;search()"
          @clear="PageNum=1;search()" 
          v-if="value4!=='QBPD'"
          clearable
          class="sousuoClass"
          multiple
          filterable
          collapse-tags
          default-first-option
          placeholder="请输入或选择库区/货列"
          no-data-text="请先选择仓库"
          no-match-text="请正确输入库区/货列">
          <el-option
            v-for="item in options7"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode">
          </el-option>
        </el-select>
        <div class="resetStyle" @click="replacement">重置</div>
      </div>

      <!-- 引入表格公共组件 START -->
      <div class="table-container pl-20 pr-20">
        <!-- 批量操作 -->
        <div class="flexBOX flexBOXS Operation">
          <div>盘点库存查询结果</div>
          <ul>
            <li @click="addCondition" v-show="btnPermission('创建盘点单')">
              <i class="iconfont iconchuangjianqiaban"></i>创建盘点单
            </li>
          </ul>
        </div>
        <V-Table :dataSource="dataSource" @selection-change="handleSelectionChange">
          <template slot-scope="scopes" slot="inventory">
            <!-- 货位下的SKU库存数 = 货位良品 + 异常货位 + 复核货位 -->
            <!-- 货位下的SKU库存数 = 货位良品 - 预上良品 -->
            <span>{{scopes.scope.row.okShelfLocation - scopes.scope.row.putawayShelfLocation }}</span>
          </template>
        </V-Table>
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
    </div>
    <V-BottomBtn routerTO="/WarehouseInside/TakeStockPlan"></V-BottomBtn>


    <el-dialog
      title="创建盘点单"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="480px"
    >
      <el-form :model="formData" ref="formData" label-width="80px" class="pl-20 pr-20">
        <el-form-item label="盘点类型">
          <el-radio v-model="formData.taskCode" label="DP">动态盘点</el-radio>
          <el-radio v-model="formData.taskCode" label="JP">静态盘点</el-radio>
        </el-form-item>
        
        <el-form-item label="任务类型">
          <el-radio v-model="formData.taskType" :label="1">指定盘点人</el-radio>
          <el-radio v-model="formData.taskType" :label="2">按区域生成任务</el-radio>
        </el-form-item>

        <el-form-item label="盘点人" v-if="formData.taskType == 1">
          <el-select v-model="formData.value3" filterable clearable placeholder="请输入盘点人" style="width:250px;">
            <el-option v-for="item in warehouseUserList"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择区域" v-if="formData.taskType == 2">
          <el-radio v-model="formData.taskRegion" label="AKQ">库区</el-radio>
          <el-radio v-model="formData.taskRegion" label="AHL">货列</el-radio>
          <el-radio v-model="formData.taskRegion" label="AHJ">货架</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddCondition" :disabled="confirmAddStala">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { TakeStockAddCols } from "./cols";

export default {
  name:'WarehouseInside_TakeStockAdd',
  data() {
    return {
      formisp:[],
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数

      MaBiaoObj:{},//码表数据

      value1:1,
      option1: [
        { value: 1, label: "SKU" },
        { value: 2, label: "SPU" },
        { value: 3, label: "货架" },
        { value: 4, label: "货位" }
      ],

      inputContent: "",

      value2:"",
      warehouseList: [],//仓库
      value4:'BFPD',
      option4: [
        { value: 'QBPD', label: "全部盘点" },
        { value: 'BFPD', label: "部分盘点" }
      ],
      value5:"",//客户
      tableList: [], //表格勾选
      value6:1,
      options6:[{
        value:1,
        label:"库区"
      },{
        value:2,
        label:"货列"
      }],
      value7:[],
      options7: [],


      dialogVisible: false,//创建盘点单弹窗
      formData: {
        taskCode:"DP",//盘点类型
        taskType: 2,
        value3: "",
        taskRegion: "AHL"
      },
      // 表格组件数据
      dataSource: {
        data: [], // 表格数据
        cols: TakeStockAddCols, // 表格的列数据
        isSelection: false, // 表格有多选时设置
      },
      confirmAddStala: false //按钮禁用
    };
  },

  methods: {
    // 查询库区/货列  --陈宁接口
    AQCode(){
      const that=this
      if(!that.value2){return}
      let params = {
        warehouseCode: that.value2 //仓库code
      }
      let array = []
      if(that.value6===1){
        // 查询库区
        that.$api.WarehouseInside.AQareaCode(params).then((res) => {
          that.options7 = res.data
        }).catch((err) => {console.log(err)});
      }else if(that.value6===2){
        //查询货列
        that.$api.WarehouseInside.AQrowCode(that.value2).then((res) => {
          that.options7 = res.data
        }).catch((err) => {console.log(err)});
      }
    },
    // 查询盘点库存  --李建军接口
    search(){
      const that = this
      if(!that.value2){
        that.$message.error('请先选择仓库进行查询') 
        return
      }
      that.$set(that.dataSource,'loading',true)
      let params = {
        pageNum: that.PageNum, //页码
        pageSize: that.PageSize,  //行数
        warehouseCodeList: that.value2?[that.value2]:[],//仓库code集合
        customerList: that.value5?[that.value5]:[],//客户
        shelfAreaIdList: that.value6===1&&that.value7.length!==0?that.value7:[],//库区   id数组
        rowIdList: that.value6===2&&that.value7.length!==0?that.value7:[],//货列      id数组
        shelvesCodeList: that.value1===3&&that.inputContent?that.inputContent.split(','):[],//货架    货架号数组
        positionCodeList: that.value1===4&&that.inputContent?that.inputContent.split(','):[],//货位    货位号数组
        spuList: that.value1===2&&that.inputContent?that.inputContent.split(','):[],//SPU数组
        skuList: that.value1===1&&that.inputContent?that.inputContent.split(','):[]//SKU数组
      }
      that.$api.WarehouseInside.manyConditions(params).then((res) => {
        that.dataSource.data = res.data.list
        // that.dataSource.data = []
        // res.data.list.forEach(v=>{
        //   if(v.okShelfLocation-v.putawayShelfLocation !== 0){
        //     that.dataSource.data.push(v);
        //   }
        // })
        that.total = res.data.total
        that.$set(that.dataSource,'loading',false)
      }).catch((err) => {console.log(err)});
    },
    addCondition(){
      const that=this
      if(!that.value2||!that.value5){
        that.$message.warning('请先选择仓库和客户！')
        return
      }
      if(that.total===0){
        that.$message.warning('暂无库存创建盘点单！')
        return
      }
      that.dialogVisible=true
      that.getAccountName(that.value2)
    },
    // 确认创建盘点单  --闵功伟接口
    confirmAddCondition(){
      const that = this
      if(that.formData.taskType === 1 && !that.formData.value3){
        that.$message.error('指定盘点人不可为空！')
        return
      }
      that.confirmAddStala = true //按钮禁用
      let params = {
        creator: localStorage.getItem('accountName'),//创建人
        warehouse: this.warehouseList.find(item => {
                      return item.dataCode === that.value2
                    }).dataName,//仓库名称
        warehouseCode: that.value2, //仓库code
        customer: that.value5,  //客户
        partOrAllInventory: that.value4?that.value4:[],//是否全部盘点:QBPD(全部盘点)/BFPD(部分盘点)
        inventoryType: that.formData.taskCode,//盘点类型:动盘('DP')/静盘('JP')
        warehouseAreas: that.value6===1&&that.value7.length!==0?that.value7:null,//库区id数组
        goodsRows: that.value6===2&&that.value7.length!==0?that.value7:null,  //货列id数组
        goodsShelves: that.value1===3&&that.inputContent?that.inputContent.split(','):null,   //货架号数组
        goodsPositions: that.value1===4&&that.inputContent?that.inputContent.split(','):null,   //货位号数组
        spus: that.value1===2&&that.inputContent?that.inputContent.split(','):null,  //spu数组
        skus: that.value1===1&&that.inputContent?that.inputContent.split(','):null,  //sku数组
        inventoryPerson: that.formData.taskType===1?that.formData.value3:null,//盘点人
        inventoryTaskType:  that.formData.taskType===2?that.formData.taskRegion:null//盘点任务单生成的方式:AKQ(按库区) | AHL(按货列) | AHJ(按货架)
      }
      that.$api.WarehouseInside.addCondition(params).then((res) => {
        if(res.errorCode==='100200'){
          that.$message.success('盘点单创建成功！')
          that.dialogVisible=false
          that.$router.push('/WarehouseInside/TakeStockPlan')
        }
       that.confirmAddStala = false //按钮恢复
      }).catch((err) => {
        console.log(err);
        that.confirmAddStala = false //按钮恢复
      });
    },
    // 重置
    replacement() {
      const that = this
      that.value2 = ""
      that.replawhouse()
    },
    replawhouse(){
      const that = this
      that.PageNum = 1
      that.inputContent = ""
      that.value4 = 'BFPD'
      that.value5 = ""
      that.value6 = 1
      that.value7 = []
      that.search()
    },
    // 表格勾選
    handleSelectionChange(val) {
      this.tableList = val;
    },
  },
  activated(){
    this.getWareHouse() //查询仓库
    this.getCustomerKv() //查询客户
  },
  created() {},

  computed: {},
  // 关闭弹窗
  deactivated(){
    this.dialogVisible = false
  }
};
</script>
