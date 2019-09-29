<!--
 * @Autor: 廖佳星
 * @LastEditors: 廖佳星
 * @LastEditTime: 2019-08-24 09:46:24
 -->
<!-- 异常管理  页面开发：廖佳星 样式文件 WarehouseInside-index.scss-->
<template>
  <div class="WarehouseInside">
    <div class="ErrManagement">
      <!-- 组件主盒子分割线 -->
      <!-- 头部标题+搜索 -->
      <div class="flexBOX flexBOXS">
        <V-Title title="异常管理" style="width:100%;">
          <div class="search-content">
            <el-input
              clearable
              @clear="PageNum=1;search()"
              @keyup.native.enter="PageNum=1;search()"
              placeholder="请输入查询内容"
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
                  v-for="(item,index) in option1"
                  :key="index"
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
        <!-- 上报时间 -->
        <el-select v-model="value2" @change="PageNum=1;search()" placeholder="时间类型" style="width:105px;">
          <el-option
            v-for="(item,index) in option2"
            :key="index"
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
        <el-select v-model="value3" @change="PageNum=1;search()" placeholder="选择处理状态" class="ml-10" style="width:130px;">
          <el-option
            v-for="(item,index) in MaBiaoObj.handle_statusList"
            :key="index"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select v-model="value4" @change="PageNum=1;search()" placeholder="选择处理方式" class="ml-10" style="width:130px;">
          <el-option
            v-for="(item,index) in MaBiaoObj.handle_wayList"
            :key="index"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select v-model="value5" @change="PageNum=1;search()" placeholder="选择来源类型" class="ml-10" style="width:130px;">
          <el-option
            v-for="(item,index) in MaBiaoObj.err_sc_typeList"
            :key="index"
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
          <div>异常列表</div>
          <ul>
            <li @click="bacthhandTurn" v-show="btnPermission('申请报损')">
              <i class="iconfont iconshenhe"></i>申请报损
            </li>
            <li @click="batchhandPrint" v-show="btnPermission('打印条码')">
              <i class="iconfont icondayinji"></i>打印条码
            </li>
            <li @click="errExport" v-show="btnPermission('导出')">
              <i class="iconfont icondaochu"></i>导出
            </li>
          </ul>
        </div>
        <V-Table
          :dataSource="dataSource"
          @selection-change="handleSelectionChange"
          @review="handleReview"
          @errDispose="handleErr"
          @print="handPrint"
          @turn="handTurn"
        >
          <!-- 来源类型  1-质检异常,2-上架异常,3-拣货异常,4-复核异常,5-库内异常 ,-->
          <template slot-scope="scopes" slot="zidingyi1">
            {{getNameByMaId('err_sc_type',scopes.scope.row.sourceType)}}
          </template>
          <!-- 异常原因   异常原因 1-少货,2-实物破损,3-sku不符,4-多货,5-其它 -->
          <template slot-scope="scopes" slot="zidingyi2">
            {{getNameByMaId('exception_reason',scopes.scope.row.exReason)}}
          </template>
          <!-- 处理方式 1-退货供应商,2-继续入库质检,3-移至异常区域,4-解冻,5-移位,6-申请报损,7-申请盘点 -->
          <template slot-scope="scopes" slot="zidingyi3">
            {{scopes.scope.row.handleType===0?'':getNameByMaId('handle_way',scopes.scope.row.handleType)}}
          </template>
          <!-- 处理状态 1-待处理,2-处理中,3-处理完成 -->
          <template slot-scope="scopes" slot="zidingyi4">
            {{getNameByMaId('handle_status',scopes.scope.row.handleStatus)}}
          </template>
          <!-- 是否转损溢单   是否申请报损,1 未申请,2 已申请  -->
          <template slot-scope="scopes" slot="zidingyi5">
            {{scopes.scope.row.isCreateBill===2?'已申请':'未申请'}}
          </template>
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



      <!-- 异常处理弹窗 -->
      <el-dialog
        :title="'异常处理 ('+ getNameByMaId('err_sc_type',rowData.sourceType) +')'"
        :visible.sync="errVisible"
        width="480px"
        class="errClass"
        :close-on-click-modal="false"
      >
        <el-form :model="form" ref="form" label-width="100px" class="pl-20 pr-20">
          <el-form-item label="增值处理">
            <el-select v-model="handleVsa" multiple @remove-tag="removeTags" placeholder="请选择增值处理">
              <el-option
                v-for="item in vsaList"
                :key="item.value"
                :label="item.label"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="item.label" v-for="(item,index) in handleVsa" :key="index">
            <el-input v-model="item.num" :placeholder="'请输入'+item.label+'数量'" @keyup.native="item.num = item.num.replace(/^(0+)|[^\d]+/g,'')"></el-input>
          </el-form-item>    
          <el-form-item label="处理方式">
            <el-select v-model="form.handleType" placeholder="请选择处理方式">
              <el-option
                v-for="item in handleTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="3" v-model="form.handleRemark" placeholder="请输入处理备注"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="errVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleErrConfirm">确 定</el-button>
        </span>
      </el-dialog>


      <!-- 打印条码弹窗 -->
      <el-dialog title="打印条码" :visible.sync="printVisible" width="480px">
        <div class="pl-10 pb-10">
          <span class="pr-20">SKU</span>
          <el-input v-model="printSku" @keyup.native.enter="addSKU" placeholder="请输入SKU后回车或扫描条码" style="width:220px;">
          </el-input>
        </div>
        
        <div class="linH24 fc6">是否打印当前条目的SKU条码，请确认？</div>
        <!-- <div class="linH24 fz12" style="color:#FF4949">*部分条目缺失SKU，请先扫描添加</div> -->
        <el-table :data="printTable" @selection-change="handlePrintChange" ref="printTable" height="200px">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="goodsSku" label="SKU"></el-table-column>
          <el-table-column prop="skuName" label="商品名称"></el-table-column>
          <el-table-column prop="attribute" label="商品属性"></el-table-column>
        </el-table>
        <div class="pl-20 pt-20">
          打印机
          <el-select v-model="printDefault" placeholder class="pl-10">
            <el-option
              v-for="item in printList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <span slot="footer">
          <el-button @click="printVisible = false">取 消</el-button>
          <el-button type="primary" @click="handPrintConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 申请报损弹窗 -->
      <el-dialog title="申请报损" :visible.sync="turnVisible" width="800px">
        <div class="linH24 fc6">是否对当前选择的明细申请报损，请确认？</div>
        <el-table :data="turnTable" @selection-change="handleTurnChange" ref="turnTable" height="300px">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="exNo" label="异常单号" width="200"></el-table-column>
          <el-table-column prop="positionCode" label="货位" width="120"></el-table-column>
          <el-table-column prop="goodsSku" label="SKU"></el-table-column>
          <el-table-column prop="exNumber" label="差异数" width="80"></el-table-column>
          <el-table-column label="申请报损数" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.handleNumber" @keyup.native="scope.row.handleNumber = scope.row.handleNumber.replace(/^(0+)|[^\d]+/g,'')" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
        </el-table>

        <span slot="footer">
          <el-button @click="turnVisible = false">取 消</el-button>
          <el-button type="primary" @click="handTurnConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 组件主盒子分割线 -->
    </div>
  </div>
</template>

<script>
import { ErrManagementCols } from "./cols";
import { getLodop } from "plugin/LodopFuncs.js";

export default {
  name:'WarehouseInside_ErrManagement',
  data() {
    return {
      inputContent: "", //搜索值
      value1: 1,
      option1: [
        {
          value: 1,
          label: "异常单号"
        },
        {
          value: 2,
          label: "来源单号"
        },
        {
          value: 3,
          label: "SKU"
        },
        {
          value: 4,
          label: "上报人"
        },
        {
          value: 5,
          label: "处理人"
        }
      ],
      value2: 1, //时间类型
      option2: [
        {
          value: 1,
          label: "上报时间"
        },
        {
          value: 2,
          label: "处理时间"
        }
      ],
      TimeValue: [], //时间
      value3: "", //选择处理状态
      value4: "", //选择处理方式
      value5: "", //选择数据来源类型
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      tableList: [], //表格勾选中的行

      // 表格组件数据
      dataSource: {
        data: [], // 表格数据
        cols: ErrManagementCols, // 表格的列数据
        isSelection: true, // 表格有多选时设置
        isOperation: true, // 表格有操作列时设置
        operation: {
          // 表格有操作列时设置
          label: "操作", // 列名
          width: "220", // 根据实际情况给宽度
          data: [
            {
              label: "查看", // 操作名称
              emitType: "review", // 触发父组件
              permission: "异常管理详情页" // 后期这个操作的权限，用来控制权限
            },
            {
              label: "异常处理", // 操作名称
              emitType: "errDispose", // 触发父组件
              permission: "异常处理" // 后期这个操作的权限，用来控制权限
            },
            {
              label: "打印条码", // 操作名称
              emitType: "print", // 触发父组件
              permission: "打印条码", // 后期这个操作的权限，用来控制权限
              invisibleKey: "invisiblePrint"
            },
            {
              label: "申请报损", // 操作名称
              emitType: "turn", // 触发父组件
              permission: "申请报损", // 后期这个操作的权限，用来控制权限
              invisibleKey: "invisibleTurn"
            }
          ]
        }
      },

      rowData: {},
      errVisible: false, //异常处理弹窗
      handleTypeList: [],//异常处理方式
      vsaList:[
        {value:1,label:'代贴条码',num:0},
        {value:2,label:'更换包装',num:0},
        {value:3,label:'污迹清理',num:0},
        {value:4,label:'撕额外标签',num:0},
      ],
      handleVsa:[],
      inputVsa:[],
      form: {
        id: null,
        handleType: null,
        handleRemark: "",//处理备注
        barCodeNum:  0,//代贴条码次数
        packNum: 0,//更换包装次数
        cleanNum: 0,//清理污迹次数
        logoNum: 0//撕额外标签 
      },
      
      printVisible: false,//打印条码弹窗
      printSku: '',//打印处SKU
      printTable: [],
      printPost: [],//打印数组

      turnVisible: false,//申请报损弹窗
      turnTable: [],
      turnPost:[],//提交数组
    };
  },

  methods: {
    // 查询条件，导出条件
    dataSources(){
      const that = this 
      let datas = {
        pageNum: that.PageNum,//页码
        pageSize: that.PageSize,//行数
        exNo: that.value1===1?that.inputContent:'',//异常单号
        sourceNo: that.value1===2?that.inputContent:'',//来源单号
        goodsSku: that.value1===3?that.inputContent:'',//SKU
        createBy: that.value1===4?that.inputContent:'',//上报人
        handleBy: that.value1===5?that.inputContent:'',//处理人
        createStartTime: that.value2===1&&that.TimeValue?that.TimeValue[0]:null,//上报开始时间
        createEndTime: that.value2===1&&that.TimeValue?that.TimeValue[1]:null,//上报结束时间
        handleStartTime: that.value2===2&&that.TimeValue?that.TimeValue[0]:null,//处理开始时间
        handleEndTime: that.value2===2&&that.TimeValue?that.TimeValue[1]:null,//处理结束时间
        handleStatus: that.value3,//处理状态 1-待处理,2-处理中,3-处理完成
        handleType: that.value4,//处理方式 1-退货供应商,2-继续入库质检,3-移至异常区域,4-解冻,5-移位,6-申请报损,7-申请盘点
        sourceType: that.value5//来源类型 1-质检异常,2-上架异常,3-拣货异常,4-复核异常,5-库内异常
      }
      return datas
    },
    // 查询
    search() {
      const that = this 
      that.$set(that.dataSource,'loading',true)
      let params = that.dataSources()
      that.$api.WarehouseInside.AQExInventory(params).then((res) => {
        that.$nextTick(()=>{
          that.dataSource.data = res.data.pageInfo.list.map(item => {
            item.invisiblePrint = !that.btnPermission('打印条码')
            item.invisibleTurn = !that.btnPermission('申请报损')
            return item
          })
        })
        
        that.total = res.data.pageInfo.total
        that.$set(that.dataSource,'loading',false)
      }).catch((err) => {console.log(err)});
    },
    // 重置
    replacement() {
      const that = this
      that.inputContent = ''
      that.value2 = 1
      that.TimeValue = []
      that.value3 = ''
      that.value4 = ''
      that.value5 = ''
      that.PageNum = 1
      that.search()
    },
    // 导出方法
    errExport(){
      let params = this.dataSources()
      let url = '/center/exInventory/export'
      this.$utils.commonUtils.export('get',url,params,'异常管理导出表格','.xls')
    },
    // 查看
    handleReview(index, row) {
      this.$router.push({ path: "/WarehouseInside/ErrManagementDetails",query:{id:row.id}});
    },
    // 异常处理
    handleErr(index, row) {
      const that =this 
      if(row.handleStatus!==1){
        that.$message.error('该异常已被处理!')
        return
      }
      that.errVisible = true
      that.handleVsa = [] //初始化数据
      Object.assign(that.form,that.$options.data().form)//初始化数据
      that.rowData = row
      that.form.id = row.id
      // 判断异常类型 1-质检异常,2-上架异常,3-拣货异常,4-复核异常,5-库内异常
      // 异常原因=少货 的时候限制不能申请盘点，异常原因=多货的时候限制只能申请盘点（除了质检异常）
      if(row.sourceType===1){
        that.handleTypeList = [{value:1,label:'退货供应商'},{value:2,label:'入库质检上架'},{value:3,label:'移至异常区域'}]
      }else if(row.sourceType===3||row.sourceType===5){
        if(row.exReason===1){
          that.handleTypeList = [{value:4,label:'解冻'},{value:6,label:'申请报损'}]
        }else if(row.exReason===4){
          that.handleTypeList = [{value:7,label:'申请盘点'}]
        }else{
          that.handleTypeList = [{value:4,label:'解冻'},{value:6,label:'申请报损'},{value:7,label:'申请盘点'}]
        }
      }else if(row.sourceType===2||row.sourceType===4){
        if(row.exReason===1){
          that.handleTypeList = [{value:5,label:'移位'},{value:6,label:'申请报损'}]
        }else if(row.exReason===4){
          that.handleTypeList = [{value:7,label:'申请盘点'}]
        }else{
          that.handleTypeList = [{value:5,label:'移位'},{value:6,label:'申请报损'},{value:7,label:'申请盘点'}]
        }
      }
      
    },
    // 移除tag时
    removeTags(val){
      switch (val.value) {
        case 1:
          this.form.barCodeNum = 0
          break;
        case 2:
          this.form.packNum = 0
          break;
        case 3:
          this.form.cleanNum = 0
          break;
        case 4:
          this.form.logoNum = 0
          break;
        default:
          break;
      }
    },
    // 异常处理确认
    handleErrConfirm(){
      const that = this
      that.handleVsa.forEach(v => {
        v.value===1?that.form.barCodeNum = Number(v.num) : 
        (v.value===2?that.form.packNum = Number(v.num) : 
        (v.value===3?that.form.cleanNum = Number(v.num) :
        (v.value===4?that.form.logoNum = Number(v.num) : false)))
      })
      that.$api.WarehouseInside.errUpdateEx(that.form).then((res) => {
        if(res.errorCode==='100200'){
          that.$message.success('异常处理成功！')
          that.errVisible = false
          that.search()
        }
      }).catch((err) => {console.log(err)});
    },

    // 主页面表格勾選
    handleSelectionChange(val) {
      this.tableList = val;
    },
    // 打印条码
    handPrint(index, row) {
      const that = this
      that.printVisible = true;
      that.printTable = []
      let array = [row.goodsSku]
      that.$api.WarehouseInside.printGoodsSku(array).then((res) => {
        that.printTable = res.data
        
        that.$refs.printTable.toggleAllSelection() //默认全选
      }).catch((err) => {console.log(err)});
    },
    
    // 批量打印
    batchhandPrint(){
      const that =this
      // if (that.tableList.length===0) {
      //   that.$message.warning('未勾选要打印的SKU')
      //   return
      // }
      that.printVisible = true;
      that.printTable = []
      // 按勾选条数调接口，SKU不去重
      that.tableList.forEach(v => {
        let array = [v.goodsSku]
        that.$api.WarehouseInside.printGoodsSku(array).then((res) => {
          that.printTable.push(res.data[0])
          that.$refs.printTable.toggleAllSelection() //默认全选
        }).catch((err) => {console.log(err)});
      });
    },
    // 输入或者扫描添加打印列表一条数据
    addSKU(val){
      const that = this
      let array = [that.printSku]
      that.$api.WarehouseInside.printGoodsSku(array).then((res) => {
        if(res.data.length!==0){
          that.printTable.push(res.data[0])
          that.$refs.printTable.toggleAllSelection() //默认全选

          that.$message.success('添加SKU条码成功')
        }else{that.$message.error('未查询到改SKU信息')}
        that.printSku = ''
      }).catch((err) => {console.log(err)});
    },
    // 打印弹窗表格勾选
    handlePrintChange(val){
      this.printPost = val
    },
    // 打印确认
    handPrintConfirm(){
      let width = this.$utils.commonUtils.mmConversionPx(50)
      let height = this.$utils.commonUtils.mmConversionPx(20)
      let len = this.printPost.length,n = 0;
      let time = setInterval(()=>{
          if (n == len) {
              clearInterval(time);
              this.printVisible = false;
              return;
          }
          this.printAction(width,height,this.printPost[n].goodsSku);
          n ++;
      },1000)
    },
    printAction (width,height,SKU){
      let left = (width - 150)/2 + 'px';
      LODOP.SET_PRINT_PAGESIZE(1, 500, 200,"")
      LODOP.ADD_PRINT_BARCODE('12px',left,'150px','32px','128B',SKU)
      LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
      let strStyleCSS = `<style type='text/css' rel='stylesheet'>.sku-name{height:16px;line-height:16px;text-align:center;font-size:12px;}.print-main{width:${width}px;font-size:12px;}.qc-table{float:left;margin-left:10px;}.qc-name{float:right;margin-right:10px;}</style>`
      let html = `<head>${strStyleCSS}</head><body>
          <div class='sku-name'>SKU:${SKU}</div>
          <div class='print-main'>
              <div class='qc-table'></div>
              <div class='qc-name'>${localStorage.userAccount}</div>
          </div>
      <body>`
      LODOP.ADD_PRINT_HTM(46,0,width,height,html);
      LODOP.SET_PRINTER_INDEX(this.printDefault) //打印设备
      //LODOP.PREVIEW()    //预览打印
      // LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS',1)//捕获打印状态
      let codes = LODOP.PRINT()    //直接打印
      // let state = LODOP.GET_VALUE('PRINT_STATUS_OK',codes)
    },


    // 申请报损
    handTurn(index, row) {
      const that = this
      if(row.handleType!==6){
        that.$message.error('未异常处理或处理方式不是申请报损');
        return
      }else if(row.handleStatus===3||row.isCreateBill===2){
        that.$message.error('已申请报损，请勿重复申请');
        return
      }
      that.turnVisible = true
      that.turnTable = []
      let array = [row.id]
      that.$api.WarehouseInside.AQLossDetails(array).then((res) => {
        that.turnTable = res.data
        
        that.$refs.turnTable.toggleAllSelection() //默认全选
      }).catch((err) => {console.log(err)});
    },
    // 批量申请报损
    bacthhandTurn(){
      const that = this
      if (that.tableList.length===0) {
        that.$message.warning('未勾选要申请报损的数据')
        return
      }
      for (let i = 0; i < that.tableList.length; i++) {
        const element = that.tableList[i];
        if(element.handleType!==6){
          that.$message.error('勾选数据中含有未异常处理或处理方式不是申请报损数据，不能申请报损');
          return
        }else if(element.handleStatus===3||element.isCreateBill===2){
          that.$message.error('勾选数据中含有已申请报损数据，请勿重复申请');
          return
        }
      }
      
      that.turnVisible = true
      that.turnTable = []
      that.tableList.forEach(v => {
        let array = [v.id]
        that.$api.WarehouseInside.AQLossDetails(array).then((res) => {
          that.turnTable.push(res.data[0])
          that.$refs.turnTable.toggleAllSelection() //默认全选
        }).catch((err) => {console.log(err)});
      });
    },
    // 申请报损弹窗表格勾选
    handleTurnChange(val){
      this.turnPost = val
    },
    // 申请报损确定
    handTurnConfirm(){
      const that =this
      let params = []
      for (let i = 0; i < that.turnPost.length; i++) {
        const v = that.turnPost[i];
        if(!v.handleNumber){
          that.$message.error('申请报损数不能为空')
          return
        }
        params.push({
          goodsSku: v.goodsSku,//SKU
          id: v.id,// 异常ID 
          number: v.handleNumber,//数量,损为负数,溢为正数 
          positionCode: v.positionCode //货位编码
        })
      }
      that.$api.WarehouseInside.updateLossDetails(params).then((res) => {
        if(res.errorCode==='100200'){that.$message.success('申请报损成功');that.turnVisible = false;that.search();}
      }).catch((err) => {console.log(err)});
    },
    // 分页器 查询混入方法
  },

  created() {
  },
  activated(){
    this.getMoreMaList('handle_status', 'handle_way', 'err_sc_type', 'exception_reason') //查询方法使用码表处方法
    this.getPrintList()//获取打印机列表
  },
  
  computed: {},
  // 关闭弹窗
  deactivated(){
    this.errVisible = false
    this.printVisible = false
    this.turnVisible = false
  }
};
</script>
