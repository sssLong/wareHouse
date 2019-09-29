<template>
    <div class="container">
       <div class="header-container">
           <V-Title title="销退收货">
                <!-- <div class="title-bar-icon" @click="dialogVisible=true"><i class="iconfont iconcanshupeizhi"></i>&nbsp;参数配置</div> -->
                <div class="search-content">
                    <el-input clearable placeholder="请输入查询内容" v-model="form.inputContent" class="input-with-select" @keyup.native.enter='PageNum=1;search()'>
                        <el-select
                            v-model="form.order"
                            placeholder="请选择"
                            class="iconfont icon-xiala selectShelf"
                            slot="prepend"
                        >
                            <el-option label="运单号" value="1"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="PageNum=1;search()"></el-button>
                    </el-input>
                </div>
            </V-Title>
           <div class="condition">
               <!-- 接收时间 -->
                <el-select v-model="form.timeType" placeholder="接收时间">
                    <el-option
                    label="接收时间"
                    value="1"
                    ></el-option>
                </el-select>
                <el-date-picker
                        class="dataTime"
                        v-model="form.TimeValue"
                        type="datetimerange"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        format="yyyy-MM-dd HH:mm"
                        :default-time="['00:00:00', '23:59:59']"
                        @change="PageNum=1;search()"
                        >
                </el-date-picker> 
                <el-select  v-model="form.wareHouse" placeholder="选择仓库" @change="PageNum=1;search()" clearable>
                     <el-option
                        v-for="item in warehouseList"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item.dataCode"
                    ></el-option>
                </el-select>
                 <el-select  v-model="form.logistics" placeholder="选择物流商" filterable @change="PageNum=1;search()" clearable>
                     <el-option v-for="item in logisticsList" 
                     :key="item.logisticsCode" :label="item.logisticsShortened" :value="item.logisticsCode">
                     </el-option>
                </el-select>
                 <el-select  v-model="form.platform" placeholder="选择平台" filterable @change="PageNum=1;search()" clearable>
                     <el-option v-for="item in platformList" 
                     :key="item.platformCode" :label="item.platformCn" :value="item.platformCode">
                     </el-option>
                </el-select>
                 <el-select  v-model="form.backType" placeholder="选择退货类型" style='width:140px' @change="PageNum=1;search()" clearable>
                     <el-option v-for="item in MaBiaoObj.rejected_typeList" 
                     :key="item.dataCode" :label="item.dataName" :value="item.dataCode">
                     </el-option>
                </el-select>
                 <el-select v-model="form.orderStatu" placeholder="选择单据状态" class="ml-10" @change='PageNum=1;search()' style='width:140px' clearable>
                    <el-option v-for="item in MaBiaoObj.reject_statusList" 
                        :key="item.dataCode" :label="item.dataName" :value="item.dataCode">
                     </el-option>
                </el-select>
                <el-input placeholder="请输入接收人" v-model='form.receiveMan' class='receive-man' @keyup.native.enter='PageNum=1;search()' @clear='PageNum=1;search()' clearable></el-input>
                <span class="reset" @click='reset'>重置</span>
           </div>
       </div>
       <div class="table-container">
           <div class="table-operation">
               <div class="title">销退收货列表</div>
               <div class="back-operation">
                   <div @click='takedelivery' class='operation-son' v-show='btnPermission("收货完成")'> 
                       <i class="iconfont iconshouhuowancheng"></i>
                       <span>收货完成</span>
                   </div>
                   <div @click="returnShow=true" class='operation-son' v-show='btnPermission("销退接收")'>
                       <i class="iconfont iconxiaotuijieshou"></i>
                       <span>销退接收</span>
                   </div>
                   <!-- <div class='operation-son' v-show='btnPermission("导入")'>
                       <el-upload
                            :action="upLoadUrl"
                            :show-file-list='false'
                            :on-success='upSuccess'
                            :on-error='upError'    
                            :headers='headers'                        
                        >
                            <i class="iconfont icondaoru"></i>
                            <span>导入</span>
                        </el-upload>
                   </div> -->
                    <div class='operation-son' @click='excelExport' v-show='btnPermission("导出")'>
                       <i class="iconfont icondaochu"></i>
                       <span>导出</span>
                   </div>
                    <div @click="goToReturnCheck" class='operation-son'>
                       <i class="iconfont iconzhijian"></i>
                       <span>质检</span>
                   </div>
               </div>
           </div>
            <!-- 引入表格公共组件 START -->
          <V-Table 
             :dataSource = "dataSource"
             @selection-change = "handleSelectionChange"
             @review = "handleCheck"
             @sort-change='sortMethod'
          >
            <!-- slot 自定义列的情况 -->
            <!-- <template slot-scope="scopes" slot="remark">
                <el-input v-model="scopes.scope.row.remark" placeholder="请输入备注"></el-input>
            </template> -->
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
                :total="total"
            ></el-pagination>
            </div>
       </div>
         <!--  销退接收弹框  -->
        <el-dialog
            title="销退接收"
            :visible.sync="returnShow"
            width="480px"
            class='return-box'
            >
            <el-form :model="returnForm" :rules="rules" ref="returnForm" label-width="100px" class="return-form">
                <el-form-item label="仓库" prop="warehouse">
                    <el-select  v-model="returnForm.warehouse" placeholder="选择仓库">
                        <el-option
                            v-for="item in warehouseList"
                            :key="item.dataCode"
                            :label="item.dataName"
                            :value="item.dataCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="退货类型" prop="returnType">
                    <el-select v-model="returnForm.returnType" placeholder="请选择退货类型">
                        <el-option v-for="item in MaBiaoObj.rejected_typeList" 
                        :key="item.dataCode" :label="item.dataName" :value="item.dataCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运单号" prop="waybillNumber">
                    <el-input clearable v-model="returnForm.waybillNumber" placeholder="请扫描单号"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="returnShow=false">取 消</el-button>
                <el-button type="primary" @click="sure">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 收货完成弹窗 -->
        <el-dialog title="提示" :visible.sync="confirmVisible">
            <p class="fz14">勾选单据如下,请确定是否收货完成？</p>
            <el-table :data="deliveryData" class="mt-10 pt-5 tableBox" ref="sureData">
                <el-table-column property="sellingBackId" label="收货单号"></el-table-column>
                <el-table-column property="plannedQuantity" label="计划数"></el-table-column>
                <el-table-column property="deliveryQuantity" label="收货数"></el-table-column>
                <el-table-column property="differQuantity" label="差异数"></el-table-column>
                <el-table-column property="comment" label="备注">
                    <template slot-scope='scope'>
                        <el-input v-model='scope.row.comment' placeholder="备注"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="confirmVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmReceive">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { returnList } from './cols'
    export default {
        name: 'WarehousingOperation_ReturnReceipt',
        data() {
            return {
                form: {
                    order: '1',  //运单号
                    inputContent: '', // 输入框的值
                    wareHouse: '',  //仓库
                    logistics: '',  //物流商
                    timeType: '1',  
                    TimeValue: ['',''],
                    platform: '',  //平台
                    backType: '',  //退货类型
                    orderStatu: '', //单据状态
                    receiveMan: '', //接收人
                    orderStatus: ''  //排序
                },
                returnShow: false, // 销退弹窗
                platformList: [],
                logisticsList: [], 
                returnForm: {
                    warehouse: '',
                    returnType: '',
                    waybillNumber: ''
                }, // 销退表单
                option4:[
                    {
                        value:'1',
                        label:"待收货"
                    },
                    {
                        value:'3',
                        label:"部分收货"
                    },
                    {
                        value:'4',
                        label:"收货完成"
                    }
                ],
                dataSource: {
                   data: [], // 表格数据
                   cols: returnList, // 表格的列数据
                   isSelection: true, // 表格有多选时设置
                   isOperation: true, // 表格有操作列时设置
                   operation: { // 表格有操作列时设置
                       label: '操作', // 列名
                       width: '130', // 根据实际情况给宽度
                       data: [
                           {
                               label: '查看', // 操作名称
                               emitType: 'review', // 触发父组件
                               permission: '销退收货单详情页', // 后期这个操作的权限，用来控制权限
                           }
                       ]
                   }
                },
                PageNum: 1, //页码
                PageSize: 10, //行数
                total: null, //总页数
                rules: {
                    warehouse: [{ required: true, message: '请选择仓库', trigger: 'blur' }],
                    returnType: [{ required: true, message: '请选择退货类型', trigger: 'blur' }],
                    waybillNumber: [{ required: true, message: '请扫描单号', trigger: 'blur' }]
                },
                confirmVisible: false, //收货弹框
                gridData: [],    //表格多选数据
                deliveryData: [],   //收货列表数据
                sureData: [],   //收货弹框表格多选数据
                headers: {Cookie: document.cookie},
                upLoadUrl: `${process.env.API_ROOT}/inbound/sellingBack/insertExcelInfo`
            }
        },
        created (){
            this.getWareHouse();
            this.getlogisticsList();
            this.getPlathformList()
            this.getMoreMaList('rejected_type','reject_status');
            this.$store.commit('SET_BACK_ROUTE',this.$route);
        },
        deactivated (){
            this.confirmVisible && (this.confirmVisible = false);
            this.returnShow && (this.returnShow = false);
        },
        methods: {
            search (){
                if (!this.form.TimeValue)this.form.TimeValue = ['',''];
                this.$set(this.dataSource, "loading", true);
                let params = {
                    pageNum: this.PageNum,
                    pageSize: this.PageSize,
                    waybillId: this.form.inputContent,
                    beginTime:this.form.TimeValue[0]!=''?this.$utils.commonUtils.format(this.form.TimeValue[0],'YYYY-MM-DD HH:mm'):'',
                    endTime: this.form.TimeValue[1]!=''?this.$utils.commonUtils.format(this.form.TimeValue[1],'YYYY-MM-DD HH:mm'):'',
                    warehouse: this.form.wareHouse,
                    logistics: this.form.logistics,
                    platform: this.form.platform,
                    sellingBackType: this.form.backType,
                    status: this.form.orderStatu,
                    receiver: this.form.receiveMan,
                    orderStatus: this.form.orderStatus
                }
                this.$api.Warehousing.backOrderList(params).then(res=>{
                    this.$set(this.dataSource, "loading", false);
                    if (res.errorCode === '100200'){
                        let {list,total} = res.data.pageInfo
                        this.dataSource.data = list;
                        this.total = total;
                    } 
                })
            },
            async getPlathformList (){
                let params = {
                    page: 1,
                    row: 1000
                }
                let res = await this.$api.Warehousing.getplathformList(params);
                this.platformList = res.data.pageInfo.list;
            },
            async getlogisticsList (){
                let params = {
                    page: 1,
                    row: 1000
                }
                let res = await this.$api.Warehousing.getlogisticsList(params);
                this.logisticsList = res.data.pageInfo.list;
            },
            reset (){
                this.form = this.$options.data().form;
                this.PageNum=1;this.search();
            },
            // 去往销退质检页面
            goToReturnCheck() {
                this.$router.push('/WarehousingOperation/ReturnCheck')
            },
            // 查看
            handleCheck(index,row) {
                window.localStorage.returnDetailFlag = '1';
                this.$router.push({path:'ReturnDetails',query:{waybillId:row.waybillId}});
            },
            sure (){
                this.$refs['returnForm'].validate((valid) => {
                    if (valid) {
                        let params = {
                            warehouse: this.returnForm.warehouse,
                            sellingBackType: this.returnForm.returnType,
                            waybillId: this.returnForm.waybillNumber
                        }
                        this.$api.Warehousing.backReceiver(params).then(res=>{
                            if (res.errorCode === '100200'){
                                this.returnShow = false;
                                this.PageNum=1;this.search()
                            }
                        })
                    } 
                });
            },
            //排序
            sortMethod ({column,prop,order}){
                this.form.orderStatus = order=="ascending"?'asc':'desc';
                this.search();
            },
            // 表格勾選
            handleSelectionChange(val){
                this.gridData=val
            },
            // 确定收货
            confirmReceive(){
                let sellingBackDetail = [];
                this.deliveryData.forEach(item=>{
                    sellingBackDetail.push({
                        sellingBackId: item.sellingBackId,
                        remark: item.comment
                    })
                })
                this.$api.Warehousing.sureBackList(sellingBackDetail).then(res=>{
                    if (res.errorCode === '100200'){
                        this.confirmVisible = false;
                        this.$utils.commonUtils.tip('收货成功','success')
                        this.search();
                    }
                })
            },
            //点击收货
            takedelivery (){
                if (!this.gridData.length){
                    this.$utils.commonUtils.tip('你没有勾选任何单据','error')
                    return
                }
                let statusData = this.gridData.filter(item => {
                    return item.status == '4'
                })
                if (statusData.length){
                    this.$utils.commonUtils.tip(`单号为${statusData[0].sellingBackId}的销退收货单已经是收货完成的状态`,'error')
                    return;
                }
                let sellingBackDetail = [];
                this.gridData.forEach(item=>{
                    sellingBackDetail.push(item.sellingBackId)
                })
                let params = {
                    sellingBackDetail: sellingBackDetail.toString()
                }
                this.$api.Warehousing.getBackDeliverData(params).then(res=>{
                    if (res.errorCode === '100200'){
                        this.deliveryData = res.data;
                    } else{
                        this.$utils.commonUtils.tip(res.msg,'error')
                    }
                })
                this.confirmVisible = true;
            },
            //导出
            excelExport (){
                let ids = [];
                if (!this.gridData.length){
                    this.$utils.commonUtils.tip(`您还未选择要导出的数据`,'error');
                    return;
                }
                let statusData = this.gridData.filter(item => {
                    ids.push(item.id);
                    return item.status != '4'
                })
                if (statusData.length){
                    this.$utils.commonUtils.tip(`单号为${statusData[0].sellingBackId}的销退收货单不是收货完成的状态`,'error')
                    return;
                }
                let params = {
                    ids: ids.toString()
                }
                this.$utils.commonUtils.export('get', `${process.env.API_ROOT}/inbound/sellingBack/excelExport`,params , '销退收货单明细', '.xls')
            },
            upSuccess (res){
                let {errorCode,msg} = res;
                if (errorCode == '100200'){
                    this.$utils.commonUtils.tip('导入成功','success')
                    this.PageNum=1;this.search()
                } else if(errorCode == "100406"){
                    this.$router.push({path:'/Login'})
                } else{
                    this.$utils.commonUtils.tip(msg,'error')
                }
            },
            upError (){
                this.$utils.commonUtils.tip('导入失败','error')
            }
        },
    }
</script>
