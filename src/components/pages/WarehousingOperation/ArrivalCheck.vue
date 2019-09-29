<template>
    <div class="arrival-check">   
        <V-Title title="到货质检">
            <div class="title-bar-icon" @click="dialogVisible=true"><i class="iconfont iconcanshupeizhi"></i>&nbsp;参数配置</div>
        </V-Title>
        <div class="arrival-check-main">
            <div class="check-if">
                <div class="check-left">
                    <el-input clearable placeholder="请扫描卡板号" ref='input1' @focus='flag="1"' spellcheck ='false' v-model="cardNum" class='cardnum pr-10' @keyup.native='cardNum=cardNum.replace(/\s/g,"")' @keydown.native='scanEnter'></el-input>
                    <el-input clearable placeholder="请扫描单号" ref='input2' @focus='flag="2"' spellcheck ='false' v-model="orderNum" class="ordernum" @keyup.native='orderNum=orderNum.replace(/\s/g,"")' @keydown.native='scanEnter'>
                        <el-select v-model="numKind" slot="prepend" class='select-w'>
                            <el-option label="运单号" value="1"></el-option>
                            <el-option label="来源单号" value="2"></el-option>
                        </el-select>
                    </el-input>
                </div>
                <div>
                    <el-select v-model="printDefault" class='printkind'>
                        <el-option
                            v-for="item in printList"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="lableKind" class='lablekind'>
                        <el-option label="sku条码标签" value="1"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="result-box" v-if='inforShow'>
                <div class="check-result clear">
                    <div class="list-1" style='margin-left:10px'>
                        <span>仓库&nbsp;:</span>
                        <i>{{configSet.wareHouse.dataName}}</i>
                    </div>
                    <div class="list-1">
                        <span>质检台&nbsp;:</span>
                        <i>{{configSet.delivery.dataName}}</i>
                    </div>
                    <div class="list-1">
                        <span>来源单号&nbsp;:</span>
                        <i>{{infor.sourceId}}</i>
                    </div>
                    <div class="list-1">
                        <span>来源类型&nbsp;:</span>
                        <i>{{getNameByMaId('put_type',infor.sourceType)}}</i>
                    </div>
                    <div class="list-1">
                        <span>采购员&nbsp;:</span>
                        <i>{{infor.buyer}}</i>
                    </div>
                    <div class="list-1">
                        <span>质检方式&nbsp;:</span>
                        <i>{{getNameByMaId('receive_arrival_notice_quality_type',infor.qualityType)}}</i>
                        <!-- <i>{{infor.qualityType | qualityType}}</i> -->
                    </div>
                </div>
            </div>
            <div class="arrival-head">
                <div class='head-name'>到货质检列表</div>
                <div class="head-handle">
                    <div class="printer handle-box" @click='print' v-show='btnPermission("全部打印")'><i class="iconfont icondayinji"></i>&nbsp;全部打印</div>
                    <div class="bind handle-box" @click='clickBind' v-show='btnPermission("绑定容器")'><i class="iconfont iconbangdingrongqi"></i>&nbsp;绑定容器</div>
                    <!-- <div class="box-num handle-box" @click='boxShow=true' v-show='btnPermission("箱号")'><i class="iconfont iconxianghao"></i>&nbsp;箱号</div> -->
                </div>
            </div>
            <div class="arrival-list">
                <List :tableData='tableData'>
                <!-- <div v-for='(item,n) in tableData' :key='item.sid' class='mb-20'> -->
                   <template slot-scope="fScope">
                    <div class="table-head">
                        <span>客户名称:</span>&nbsp;<span class='mr-30'>{{fScope.row.customerName}}</span>
                        <span>运单号:</span>&nbsp;<span class='mr-30'>{{fScope.row.waybillId}}</span>
                    </div>
                    
                    <el-table
                        ref="multipleTable"
                        :data="fScope.row.qcWaybillInfoDtoList"
                        style="width: 100%"
                        @selection-change="handleSelectionChange(arguments,fScope.$index)"
                    >
                        <el-table-column
                            fixed="left"
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column
                            type="index"
                            label="序号"    
                            width="55">
                        </el-table-column>
                        <el-table-column
                            prop="pictureUrl"
                            label="图片"
                            >
                            <template slot-scope="scope">
                                <el-popover
                                    placement="right"
                                    title=""
                                    trigger="hover">
                                    <div
                                    class="image-popover"
                                    :style="{'background-image': `url('${scope.row.pictureUrl}')`}"></div>
                                    <div
                                    slot="reference"
                                    class="reference-img"
                                    :style="{'background-image': `url('${scope.row.pictureUrl}')`}"></div>
                                    <!-- <img slot="reference" :src="scope.row[scope.column.property]" width="40px" height="40px"> -->
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="SKU"
                            label="SKU"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="goodsName"
                            label="产品名称"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="differQuantity"
                            label="差异数量"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="plannedQuantity"
                            label="计划数量"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="qualityControlFinishNumber"
                            label="QC完成数量"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="sealBoxFinishNumber"
                            label="封箱数量"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="sealBoxUnfinishNumber"
                            label="未封箱数量"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="goodProductNumber"
                            label="本次良品"
                            width="140"
                            >
                            <template slot-scope="scope">
                                <input type="text" @input='limitNum($event,scope.row)' class='el-input__inner' placeholder="请输入">
                                <!-- <el-input clearable placeholder="输入良品数" v-model="scope.row.goodProductNumber" @keyup.native="limitNum" class='text-mid'></el-input> -->
                            </template>
                        </el-table-column>
                        <!-- <el-table-column
                            prop="unusableProductNumber"
                            label="本次次品"
                            width="140"
                            >
                            <template slot-scope="scope">
                                <el-input clearable placeholder="输入次品数" v-model="scope.row.unusableProductNumber" class='text-mid'></el-input>
                            </template>
                        </el-table-column> -->
                        <!-- <el-table-column
                            prop="remark"
                            label="备注"
                            width="140"
                            >
                            <template slot-scope="scope">
                                <el-input clearable placeholder="输入备注" v-model="scope.row.mark" class='text-mid'></el-input>
                            </template>
                        </el-table-column> -->
                        <el-table-column
                            label="操作"
                            width="180"
                            fixed="right"
                            >
                            <template slot-scope="scope">
                                <span style="color:#2A8BFF;margin-right:5px" class='pointer' @click='addQcNum(scope.row,fScope.row.qualityControlOrderNumber)' v-show='btnPermission("QC完成")'>QC完成</span>    
                                <span @click='sendError(scope.row)' style="color:#FF9F21;margin-right:5px" class='pointer' v-show='btnPermission("异常上报")'>异常上报</span>    
                                <!-- <el-dropdown @command="handleCommand">
                                    <i class='iconmore pointer iconfont'></i>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item>复档</el-dropdown-item>
                                        <el-dropdown-item command='3'>批次录入</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown> -->
                                
                                <!-- <span>复档</span>    
                                <span @click='enterShow=true'>批次录入</span>     -->
                            </template>    
                        </el-table-column>
                    </el-table>
                   
                   </template>
                <!-- </div> -->
                 </List>
                <div class="el-table__empty-block" v-if='!tableData.length'>
                    <span class="el-table__empty-text">暂无数据</span>
                </div>
            </div>
           
        </div>
        <!--  异常上报弹框  -->
        <el-dialog
            title="异常上报"
            :visible.sync="unusualShow"
            width="480px"
            class='unusual-box'
            :close-on-click-modal="false"
            >
            <el-form :model="unusualForm" :rules="unusualRules" ref="unusualForm" label-width="100px" class="unusual-form">
                <el-form-item label="运单号" prop="waybillNumber">
                    <el-input clearable v-model="unusualForm.waybillNumber" disabled></el-input>
                </el-form-item>
                <el-form-item label="商品条码" prop="sku">
                    <el-input clearable v-model="unusualForm.sku" disabled></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="exceptionSkuCount">
                    <el-input @keyup.native="limit" clearable v-model="unusualForm.exceptionSkuCount" placeholder="请输入数量" required></el-input>
                </el-form-item>
                <el-form-item label="异常原因" prop="exceptionCauseId">
                    <el-select v-model="unusualForm.exceptionCauseId" placeholder="请选择异常原因">
                        <el-option v-for='item in MaBiaoObj.qc_exceptionList' 
                            :key='item.dataCode'
                            :label='item.dataName'
                            :value='item.dataCode'
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="异常箱号" prop="exceptionBoxNumber">
                    <el-input clearable v-model="unusualForm.exceptionBoxNumber" placeholder="请输入箱号" required></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="unusualShow=false">取 消</el-button>
                <el-button type="primary" @click="sureError()">确 定</el-button>
            </span>
        </el-dialog>
        <!--  绑定容器  -->
        <el-dialog
            title="绑定容器"
            :visible.sync="bindShow"
            width="480px"
            class='bind-box'
            :before-close="handleClose"
            >
            <el-tabs v-model="activeName"  :before-leave='handleClick'>
                <el-tab-pane label="单容器绑定" name="first"></el-tab-pane>
                <el-tab-pane label="多容器绑定" name="second"></el-tab-pane>
            </el-tabs>
            <el-form :model="bindForm" ref="bindForm" label-width="80px" class="bind-form">
                 <!-- 防止按enter键刷新页面  -->
                <el-input v-show='false'></el-input>    
                <el-form-item label="容器编号" prop="code">
                    <el-input ref='input4' clearable v-model="bindForm.code" @keyup.native.enter='bindSure' required></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="num" v-if='activeName=="second"'>
                    <el-input ref='input3' @keydown.native.enter='bindBox' @keyup.native="e=>bindForm.num=e.target.value.replace(/[^\d]/g,'')"  clearable v-model="bindForm.num" required></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="bindBox()">确 定</el-button>
            </span>
        </el-dialog>
        <!--  批次录入  -->
        <el-dialog
            title="批次录入"
            :visible.sync="enterShow"
            width="480px"
            class='enter-box'
            >
            <el-form :model="enterForm" ref="enterForm" label-width="100px" class="enter-form">
                <el-form-item label="商品条码" prop="barCode">
                    <el-input clearable v-model="enterForm.barCode" required></el-input>
                </el-form-item>
                <el-form-item label="生产日期" prop="startTime">
                    <el-date-picker
                        v-model="enterForm.startTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="有效期" prop="validityTime">
                    <el-input clearable v-model="enterForm.validityTime" required></el-input>
                </el-form-item>
                <el-form-item label="失效日期" prop="endTime">
                    <el-date-picker
                        v-model="enterForm.endTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="数量" prop="num">
                    <el-input clearable v-model="enterForm.num" required></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="enterShow=false">取 消</el-button>
                <el-button type="primary" @click="enterShow=false">确 定</el-button>
            </span>
        </el-dialog>
        <!--  箱号  -->
        <el-dialog
            title="箱号"
            :visible.sync="boxShow"
            width="480px"
            class='box-box'
            >
            <el-form :model="boxForm" ref="boxForm" label-width="100px" class="box-form">
                <el-form-item label="数量" prop="num">
                    <el-input clearable v-model="boxForm.num" required></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="boxShow=false">取 消</el-button>
                <el-button type="primary" @click="boxShow=false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- <PrintNotice :printAlert.sync="printAlert"></PrintNotice> -->
        <configSet :dialogVisible.sync="dialogVisible"  @configSet='config' type='工作台'></configSet>
    </div>

</template>
<script>
import { getLodop } from './../../../plugin/LodopFuncs' 
import  List  from './tb-list.vue' 
export default {
    name: 'WarehousingOperation_ArrivalCheck',
    data (){
        return {
            printAlert: false,
            dialogVisible: false,
            cardNum: '',
            orderNum: '',
            numKind: '1',
            lableKind: '1',
            printerList: [],
            tableData: [],
            lodop: null,
            inforShow: false,
            unusualShow: false, //异常上报弹框
            unusualForm: {
                sourceOrderNumber: '',
                waybillNumber: '',
                sku: '',
                exceptionSkuCount: '',
                exceptionCauseId: '',
                exceptionBoxNumber: '',
                warehouseCode: '',
                detailId: ''
            },
            unusualRules: {
                waybillNumber: {required: true, message: '请输入运单号', trigger: 'blur' },
                sku: {required: true, message: '请输入sku', trigger: 'blur' },
                exceptionSkuCount: {required: true, message: '请输入数量', trigger: 'blur' },
                exceptionCauseId: {required: true, message: '请选择异常原因', trigger: 'change' },
                exceptionBoxNumber: {required: true, message: '请输入箱号', trigger: 'blur' }
            },
            activeName: 'first',
            bindShow: false,
            bindForm: {
                code: '',
                num: ''
            },
            enterShow: false,
            enterForm: {
                barCode: '',
                startTime: '',
                validityTime: '',
                endTime: '',
                num: ''
            },
            boxShow: false,
            boxForm: {
                num: ''
            },
            configSet: {
                wareHouse: {},
                delivery: {},
                friendList: []
            },
            infor: {
                sourceId: '',
                sourceType: '',
                buyer: '',
                qualityType: ''
            },
            printList: [],
            printDefault: '',
            tableList: [],   //被选中的数据
            flag: '1',  //记录光标位置
            printFlag: true,
            printAlert: false
        }
    },
    created (){
        this.getErrorList('qc_exception','put_type','receive_arrival_notice_quality_type');
    },
    activated (){
        if (this.configSet.wareHouse.dataName){
            this.dialogVisible = false;
        } else{
            setTimeout(()=>{
                this.dialogVisible = true;
            },100)
        }
    },
    deactivated (){
        this.dialogVisible && (this.dialogVisible = false);
        this.unusualShow && (this.unusualShow = false);
        this.bindShow && (this.bindShow = false);
    },
    methods: {
        limit (e){
            this.unusualForm.exceptionSkuCount=e.target.value.replace(/[^\d]/g,'')
        },
        search (){
            if (this.cardNum.trim() == ''){
                this.$utils.commonUtils.tip('卡板号不能为空','error');
                return;
            }
            let assistants = [];
            this.tableList = []
            this.configSet.friendList.forEach(item=>{
                assistants.push({
                    synergyName: item.name,
                    synergyId: item.id
                })
            })
            let params = {
                cardBoardNum: this.cardNum,
                waybillNum: this.orderNum,
                flag: this.numKind || 1,
                assistants: JSON.stringify(assistants),
                warehouseCode: this.configSet.wareHouse.dataCode
            }
            this.$api.Warehousing.baseCardList(params).then(res=>{
                if (res.errorCode === '100200'){
                    let data = res.data;
                    this.infor.buyer = data.buyer;
                    this.infor.qualityType = data.qcType;
                    this.infor.sourceId = data.sourceOrderNumber;
                    this.infor.sourceType = data.sourceType;
                    this.tableData = res.data.waybillInfoDtoList
                } 
            })
        },
        //获取异常原因
        async getErrorList (...res){
            let params = {
                dictCodes: res.toString()
            };
            const { errorCode, data } = await this.$api.BasicConfiguration.getDictCodes(params);
            if (errorCode === '100200') {
                data.forEach(item => {
                    this.$set(this.MaBiaoObj, `${item.dictCode}List`, item.dictData)
                })
            }    
        },
        afterScan (){
            if (this.flag == '1'){
                this.$refs.input2.select();
            } else{
                if (this.orderNum.trim() == ''){
                    this.$utils.commonUtils.tip(this.numKind=='1'?'运单号不能为空':'采购单号不能为空','error');
                    return;
                }
                this.tableData = [];                                                                                                                                                                                                                                                                                                                                                                                5
                this.search();
            }
        },
        //异常上报弹框展示
        sendError (data){
            this.unusualShow = true;
            this.unusualForm.sku = data.SKU;
            this.unusualForm.waybillNumber = data.waybillId;
            this.unusualForm.sourceOrderNumber = data.sourceId;
            this.unusualForm.warehouseCode = this.configSet.wareHouse.dataCode;
            this.unusualForm.detailId = data.id;
            this.unusualForm.exceptionSkuCount = '';
            this.unusualForm.exceptionCauseId = '',
            this.unusualForm.exceptionBoxNumber = '',
            this.$nextTick(()=>{
                this.$refs['unusualForm'].clearValidate();
            })
        },
        //确认异常上报
        sureError (){
            if (/\D/g.test(this.unusualForm.exceptionSkuCount)){
                this.$utils.commonUtils.tip('数量只能为数字','error')
                return;
            }
            this.$refs.unusualForm.validate(valid => {
                if (valid){
                    this.$api.Warehousing.sendError(this.unusualForm).then(res=>{
                        if (res.errorCode === '100200'){
                            this.$utils.commonUtils.tip('异常上报成功','success')
                            this.unusualShow=false;
                            this.unusualForm = this.$options.data().unusualForm;
                            this.$nextTick(()=>{
                                this.$refs['unusualForm'].clearValidate()
                            })
                        } 
                    })
                }
            })
        },
        addQcNum (data,qualityControlOrderNumber){    //QC完成
            let assistants = [];
            this.configSet.friendList.forEach(item=>{
                assistants.push({
                    synergyName: item.name,
                    synergyId: item.id
                })
            })
            console.log(typeof data.goodProductNumber,data.goodProductNumber,'sdf')
            if (typeof data.goodProductNumber == 'undefined' || typeof data.goodProductNumber == 'object' || data.goodProductNumber == ''){
                this.$utils.commonUtils.tip('良品数量不能为空','error')
                return;
            }
            let params = {
                cardBoardId: this.cardNum,
                waybillNumber: data.waybillId,
                sku: data.SKU,
                goodProductNumber: data.goodProductNumber,
                sealBoxFinishNumber: data.sealBoxFinishNumber,
                unusableProductNumber: data.unusableProductNumber,
                skuPlanNumber: data.plannedQuantity,
                sourceOrderNumber: data.sourceId,
                qualityControlFinishNumber: data.qualityControlFinishNumber,
                remark: data.remark || '',
                warehouseCode: this.configSet.wareHouse.dataCode,
                qcStationId: this.configSet.delivery.dataCode,
                assistants: JSON.stringify(assistants),         //协同人
                qualityControlOrderNumber: qualityControlOrderNumber,
                flag: '0'
            }
            this.$api.Warehousing.addQcNum(params).then(res=>{
                if (res.errorCode === '100200'){
                    this.$utils.commonUtils.tip('操作成功','success');
                    this.tableData = [];
                    this.search();    //刷新数据
                } 
            })
        },
        //操作项下拉框选择
        handleCommand (comand){   
            if (comand == '3'){   //选择批量录入
                this.enterShow = true
            }
        },
        config (form){   //获取参数设置数据
            if (this.configSet.wareHouse.dataCode != form.wareHouse.dataCode || this.configSet.delivery.dataCode != form.delivery.dataCode ){
                let MaBiaoObj = this.MaBiaoObj;
                let printDefault = this.printDefault
                Object.assign(this.$data, this.$options.data());
                this.printDefault = printDefault;
                this.MaBiaoObj = MaBiaoObj;
            }
            this.getPrintList();
            this.configSet = Object.assign(this.configSet,form);
            !this.inforShow && (this.inforShow = true);  
            this.$refs.input1.select();
        },
        //将多表选中数据合成一个数组
        contactArr (){
            let arr = [];
            for (let i = 0; i < this.tableList.length; i ++){
                arr = [...arr,...this.tableList[i].data]
            }
            return arr;
        },
        //判断容器绑定
        judeSkuLen (){
            let flag;       //1表示单容器，多容器都可以绑定  2表示只能绑定单容器  3表示不在同一个楼层不能绑定容器  4表示没勾选数据，不能绑定任何容器 
            let len = this.tableList.length;
            let isFloor = len?this.judeFloor():false;
            if ( len == 0 ){  //没有勾选数据
                flag = 4;
            } else if ( len >= 2){   //勾选了多个运单号
                if (isFloor){   //在同一个楼层
                    flag = 2
                } else{   //不在同一个楼层
                    flag = 3;
                }
            } else {   //只有一个运单号
                if (isFloor){     //在同一个楼层
                    if (this.tableList[0].data.length > 1){   //只有一个sku
                        flag = 2;
                    } else{        //多个sku
                        flag = 1;
                    }
                } else{     //不在同一个楼层
                    flag = 3;
                }
            }
            return flag;
        },
        //返回sku未封箱数量为0的集合
        judeBoxLen (){
            let skuList = [];
            let tableList = this.contactArr();
            for (let i = 0,len = tableList.length; i < len; i ++ ){
                let skuData = tableList[i];
                if (skuData.sealBoxUnfinishNumber == 0){
                    skuList.push(skuData.SKU)      
                }
            }
            return skuList
        },
        //判断选中sku是否都在同一个楼层
        judeFloor (){
            let tableList = this.contactArr();
            let skuFloor = tableList[0].skuFloor;
            let flag = true;      //flag为true时代表在同一个楼层  false时不在同一个楼层
            console.log(tableList,'wang')
            for (let i = 1,len = tableList.length; i < len; i ++ ){
                if (skuFloor != tableList[i].skuFloor){
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        bindSure (){
            if (this.activeName == 'second'){
                this.$refs.input3.select();
            } else{
                this.bindBox();
            }
        },
        limitNum (e,data){
            e.target.value = e.target.value.replace(/[^\d]/g,'');
            data.goodProductNumber = e.target.value;
        },
        //点击绑定容器
        clickBind (){
            let skuList = this.judeBoxLen();    //封箱数量为0的集合
            let jude = this.judeSkuLen();     //绑定容器前的判断  1表示单容器，多容器都可以绑定  2表示只能绑定单容器  3表示不在同一个楼层不能绑定容器  4表示没勾选数据
            if (jude == 4){
                this.$utils.commonUtils.tip('你没有勾选任何单据','error')
            } if(jude == 3){
                if (skuList.length){   //存在未封箱数量为0的情况
                    this.$utils.commonUtils.tip(`sku:${skuList[0]}未封箱数量为0`,'error')
                    return;
                }
                this.$utils.commonUtils.tip('勾选的sku不在同一个楼层','error')
            } else{
                if (skuList.length){   //存在未封箱数量为0的情况
                    this.$utils.commonUtils.tip(`sku:${skuList[0]}未封箱数量为0`,'error')
                } else{
                    this.bindShow=true
                }
            }   
        },
        //绑定容器
        bindBox (){
            let params = [];
            if (this.bindForm.code.trim() == ''){
                this.$utils.commonUtils.tip('容器编号不能为空','error')
                return;
            }
            if (this.activeName == 'second' && this.bindForm.num.trim() == ''){
                this.$utils.commonUtils.tip('数量不能为空','error')
                return;
            }
            if (this.activeName == 'second' && String(this.bindForm.num) === '0'){
                this.$utils.commonUtils.tip('数量不能为0','error')
                return;
            }
            if (this.activeName == 'second' && /\D/g.test(this.bindForm.num)){
                this.$utils.commonUtils.tip('数量只能为数字','error')
                return;
            }
            this.tableList.forEach(item=>{
                item.data.forEach(_item=>{
                    let obj = {
                        sealBoxSerialNumber: this.bindForm.code,
                        sid: _item.id,
                        skuPlanNumber: _item.plannedQuantity,
                        skuFloor: _item.skuFloor,
                        warehouseCode: this.configSet.wareHouse.dataCode
                    }
                    if (this.activeName == 'second'){
                        obj.skuDefinedNumber = this.bindForm.num     
                    }
                    params.push(obj)
                })
            })
            this.$api.Warehousing.bindBox(params).then(res=>{
                if (res.errorCode === '100200'){
                    this.$utils.commonUtils.tip('容器绑定成功','success')
                    this.bindShow=false;
                    this.tableData = [];
                    this.search();
                    this.activeName = 'first';
                    this.bindForm.code = '';
                    this.bindForm.num = '';
                } else{
                    this.$refs.input4.select();
                }
            })
            
        },
        // 表格勾选
        handleSelectionChange(val,n) {
            let tableList = [...this.tableList];
            let flag = 0;
            this.tableList.forEach((item,index)=>{
                if (item.n == n){
                    if (val[0].length){
                        tableList[index].data=val[0];
                    } else{
                        tableList.splice(index,1)
                    }
                } else{
                    flag ++;
                }
            })
            if (flag == this.tableList.length){
                tableList.push({
                    n: n,
                    data: val[0]
                })
            }
            this.tableList = tableList;
            
        },
        //tab切换
        handleClick (activeName,oldActiveName){
            if (activeName == 'second'){
                if (this.judeSkuLen() == 2){
                    this.$utils.commonUtils.tip('不同的SKU只能绑定单容器','error');
                    return false
                } 
            }
        },
        //打印
        print (){
            let LODOP = getLodop()//调用getLodop获取LODOP对象
            if (!LODOP){
                return;
            } 
            if (!this.printFlag)return;
            this.printFlag = false;
            let arr = this.contactArr();
            let width = this.$utils.commonUtils.mmConversionPx(50)
            let height = this.$utils.commonUtils.mmConversionPx(20)
            if (!arr.length){
                this.$utils.commonUtils.tip('你还没有选择要打印的sku','error')
                this.printFlag = true;
                return;
            }
            let len = arr[0].goodProductNumber || 0,n = 0;
            if (arr.length > 1){
                this.$utils.commonUtils.tip('只能打印单个sku','error')
                this.printFlag = true;
                return;
            }
            if (len == 0){
                this.$utils.commonUtils.tip('良品数不能为空','error')
                this.printFlag = true;
                return;
            }
            
            let time = setInterval(()=>{
                if (n == len) {
                    clearInterval(time);
                    this.printFlag = true;
                    return;
                }
                this.printAction(n,width,height,arr[0].SKU);
                n ++;
            },1000)
            
        },
        printAction (n, width,height,SKU){
            let left = (width - 150)/2 + 'px';
            LODOP.SET_PRINT_PAGESIZE(1, 500, 200,"")
            //LODOP.ADD_PRINT_RECT(0,0,width,height,0,0);
            LODOP.ADD_PRINT_BARCODE('12px',left,'150px','32px','128B',SKU)
            LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
            // LODOP.ADD_PRINT_TEXT('45px',left,'150px','16px',`SKU:${SKU}`);
            let strStyleCSS = `<style type='text/css' rel='stylesheet'>.sku-name{height:16px;line-height:16px;text-align:center;font-size:12px;}.print-main{width:${width}px;font-size:12px;}.qc-table{float:left;margin-left:10px;}.qc-name{float:right;margin-right:10px;}</style>`
            let html = `<head>${strStyleCSS}</head><body>
                <div class='sku-name'>SKU:${SKU}</div>
                <div class='print-main'>
                    <div class='qc-table'>QC${this.configSet.delivery.dataCode}</div>
                    <div class='qc-name'>${localStorage.userAccount}</div>
                </div>
            <body>`
            LODOP.ADD_PRINT_HTM(46,0,width,height,html);
            // LODOP.ADD_PRINT_TEXT('62px','10px','60px','20px',this.configSet.delivery.dataName);
            // LODOP.ADD_PRINT_TEXT('62px',`${width-45}px`,'45px','20px',localStorage.userAccount);
            LODOP.SET_PRINTER_INDEX(this.printDefault)
            //LODOP.PREVIEW()
            LODOP.PRINT()
        },
        handleClose (){
            this.bindShow = false;
            this.activeName = 'first';
            this.bindForm = {
                code: '',
                num: ''
            }
        }
    },
    components: {
        List
    }
}
</script>


