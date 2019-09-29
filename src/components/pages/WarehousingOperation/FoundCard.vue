<!-- 创建卡板页  页面开发：廖佳星 样式文件：ArrivalNotice.scss-->
<template>
    <div class="arrivalNotice">
        <V-Title title="创建卡板">
            <div class="title-bar-icon" @click="dialogVisible=true"><i class="iconfont iconcanshupeizhi"></i>&nbsp;参数配置</div>
        </V-Title>
        
        <!-- 筛选条件 -->
        <div class="flexBOX width130px p-20 pt-15">
            <el-button type="primary" @click="getCardBord" class='create-card' v-if='showCard'>创建卡板号</el-button>
            <template v-else>
                <el-input v-model="cardNumber" disabled class="mr-10 cardBord"></el-input>
                <div class="resetStyle" style="min-width:60px;" @click="bindBord">打印卡板号</div>
            </template>
            <el-input
            clearable
            v-model="procurementNumber"
            placeholder="请扫描运单号"
            @keyup.native='procurementNumber=procurementNumber.replace(/\s/g,"")'
            @keydown.native='scanEnter'
            spellcheck ='false'
            class='order-input'
            ref="order"
            ></el-input>
            <el-input v-model="packWeight" ref="weight" placeholder="包装称重" clearable class="ml-10" @keydown.native='getWeight' @keyup.native='packWeight=packWeight.replace(/[^\d,\.]/g,"")'>
            <!-- <div slot="suffix" style="position: relative;right: 8px;top: 5px;">g</div> -->
            </el-input><span style="color:#2A8BFF;line-height:29px;display:block;height:32px">&nbsp;g</span> 
            <!-- <div class="resetStyle" @click="showErrorBox" style="color:#FF9F21" v-show='btnPermission("异常上报")'>异常上报</div> -->
        </div>
        <!-- <div class="flexBOX width130px p-20 pt-0">
            <el-checkbox v-model="checkStala" label>
            <el-input clearable v-model="checkValue" placeholder="请输入来源单号" :disabled="!checkStala" @keyup.native='checkValue=checkValue.replace(/\s/g,"")'></el-input>
            </el-checkbox>
            <div
            class="resetStyle"
            :style="checkStala?'color:#2A8BFF':'color:#999'"
            @click="findBaseSource"
            v-show='btnPermission("查询")'
            >查询</div>
            <div
            class="resetStyle"
            style="color:#FF9F21"
            @click="showErrorBox"
            v-show='btnPermission("异常上报")'
            >
            <i class="el-icon-warning"></i> 异常上报
            </div>
        </div> -->
        <!-- 信息展示，输入采购单号后显示 -->
        <div class="bgf2 ml-20" v-show="inforShow">
            <span>
            <span class="cor6">仓库：</span>{{configSet.wareHouse.dataName}}
            </span>
            <span class="ml-30">
            <span class="cor6">来源单号：</span>{{currentSourceId}}
            </span>
            <span class="ml-30">
            <span class="cor6">收货台：</span>{{configSet.delivery.dataName}}
            </span>
        </div>
        <!-- 包裹接收列表 -->
        <div class="flexBOX flexBOXS Operation p-20 pb-10">
            <div>包裹接收列表</div>
            <ul>
            <li @click='removeRow'>
                <i class="iconfont iconyichu"></i>移除
            </li>
            </ul>
        </div>
        <!-- 表格 -->
        <div class="tableBox table-container pl-20 pr-20">
            <el-table
            :data="tableData"
            style="width: 100%"
            class="shelfTable"
            @selection-change="handleSelectionChange"
            >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="waybillId" label="运单号"></el-table-column>
            <el-table-column prop="sourceId" label="来源单号"></el-table-column>
            <el-table-column prop="receiveArrivalNotice.sourceType" label="来源类型">
                <template slot-scope='scope'>
                    <span>{{getNameByMaId('put_type',scope.row.receiveArrivalNotice.sourceType)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="receiveArrivalNotice.customerName" label="客户名称"></el-table-column>
            <!-- <el-table-column prop="receiveArrivalNotice.creater" label="采购员"></el-table-column> -->
            <el-table-column prop="receiveArrivalNotice.warehouse" label="仓库"></el-table-column>
            <el-table-column prop="receiver" label="接收员"></el-table-column>
            <el-table-column prop="receiveTime" label="接收时间" width=180></el-table-column>
            <el-table-column prop="weight" label="重量（g）"></el-table-column>
            </el-table>
        </div>
        <V-BottomBtn :noBack='true' :buttonList='buttonList' @goBack='$router.push("/WarehousingOperation/ArrivalNotice")'></V-BottomBtn> 
        <!-- 错误提示框 -->
        <el-dialog title="提示" :visible.sync="waybillVisible" width="480px">
        <div class="fz16 pl-20 pr-20" style="text-align:center">
            <i class="el-icon-warning corORG fz16"></i>
            {{tishiTITLE?`运单号:${procurementNumber} 未录入订单,请检查`:'未查询到对应运单号，请检查来源单号后重试或将异常上报'}}
        </div>
        <span slot="footer">
            <el-button type="primary" @click="waybillVisible = false">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 包裹异常确认 -->
        <el-dialog
        title="包裹异常确认"
        :visible.sync="errVisible"
        :close-on-click-modal="false"
        class="errDialog"
        width="480px"
        >
        <el-form
            :model="formData"
            :rules="errRules"
            ref="formData"
            label-width="80px"
            class="pl-20 pr-20"
        >
            <el-form-item label="运单号" prop="value1">
                <el-input clearable v-model="formData.value1"></el-input>
            </el-form-item>
            <el-form-item label="仓库" prop="value2">
                <el-input v-model="configSet.wareHouse.dataName" disabled></el-input>
            </el-form-item>
            <el-form-item label="运输方式" prop="value3">
            <el-select v-model="formData.value3" placeholder>
                <el-option
                v-for="item in yunList"
                :key="item.methodCode"
                :label="item.methodName"
                :value="item.methodCode"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="受理人" prop="value4">
            <el-select v-model="formData.value4" placeholder value-key="id" filterable>
                <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item"
                ></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="包裹数" prop="value5">
            <el-input clearable v-model="formData.value5"></el-input>
            </el-form-item>
        </el-form>
        <p style="text-align:center;color:#FF4949;font-size:12px;">注意：异常包裹不装在卡板上，受理人为包裹的收货人</p>
        <span slot="footer">
            <el-button @click="errVisible = false">取 消</el-button>
            <el-button type="primary" @click="sureError">确 定</el-button>
        </span>
        </el-dialog>
        <!-- <PrintNotice :printAlert.sync="printAlert"></PrintNotice> -->
        <!-- 参数配置 -->
        <configSet @configSet="config" :dialogVisible.sync="dialogVisible" type='接收台'></configSet>
    </div>
</template>

<script>
import { getLodop } from './../../../plugin/LodopFuncs' 
export default {
    name: 'WarehousingOperation_FoundCard',
    data() {
        return {
            showCard: true,
            cardLet: "", //创建时的卡板号
            cardNumber: "", //卡板号
            procurementNumber: "", //运单号
            packWeight: "", //包装称重
            checkStala: false, //来源单号勾选
            checkValue: "", //来源单号数据
            tishiTITLE: true, //1为未扫描打运单号    2为未查询到对应运单号
            waybillVisible: false, //错误提示框
            errVisible: false, //异常提示框
            dialogVisible: true, //参数配置弹窗
            printAlert: false,
            tableList: [], //表格勾选
            // 表格数据
            tableData: [],
            // 包裹异常确认表单数据
            formData: {
                value1: "",
                value2: "",
                value3: "",
                value4: "",
                value5: ""
            },
            errRules: {
                value1: [{ required: true, message: "请扫描运单号", trigger: "blur" }],
                value3: [
                { required: true, message: "请选择运输方式", trigger: "change" }
                ],
                value4: [
                { required: true, message: "请选择受理人", trigger: "change" }
                ],
                value5: [{ required: true, message: "请输入包裹数", trigger: "blur" }]
            },
            options3: [
                {
                    lable: '顺丰',
                    value: '1'
                }
            ],
            canBind: false,     //运单号可以绑定来源单号
            inforShow: false,
            currentSourceId: '',
            configSet: {
                wareHouse: {},
                delivery: {},
                friendList: []
            },
            buttonList:[
                {
                    name:'返回',    //按钮名称
                    type:true,    //是否为主按钮-可不传
                    emitType:'goBack'    //方法
                },
            ],
            yunList: []
        };
    },
    created() {
        this.getMoreMaList('put_type');
    },
    activated (){
        if (this.configSet.wareHouse.dataName){
            this.dialogVisible = false;
        } else{
            this.dialogVisible = true;
        }
    },
    deactivated (){
        this.dialogVisible && (this.dialogVisible = false);
    },
    methods: {
        search (){
            
        },
        afterScan (){
            this.$refs.weight.select();
        },
        getWeight (e){
            if(e.which == 13) {
                this.scanJude();
            }
        },
        getShippingMethods (){
            let params = {
                page: 1,
                row: 1000,
                warehouse: this.configSet.wareHouse.dataCode
            }
            this.$api.Warehousing.getShippingMethods(params).then(res=>{
                if(res.errorCode == '100200'){
                    this.yunList = res.data.pageInfo.list;
                }
            })
        },
        scanJude (){
            if (this.showCard){    //还没创建卡板号
                this.$utils.commonUtils.tip('请先创建卡板号','error')
                return;
            }
            if (this.packWeight.trim() === ''){  //还没称重
                this.$utils.commonUtils.tip('包裹还没称重','error')
                return;
            }
            if (this.checkStala ){      //如果来源单号被勾选则是在来源单号里插入运单号
                this.canBind && this.bindSourceId();
            } else{
                let flag = this.tableData.some(item =>item.waybillId===this.procurementNumber)  //判断当前运单号是否已经扫描
                if (!flag){
                    this.getDetail();
                } else{
                    this.$utils.commonUtils.tip('该运单号已经扫描','error')
                }
            }
        },
        getCardBord (){
            this.$api.Warehousing.getCardBord().then(res=>{
                if (res.errorCode === '100200'){
                    this.cardNumber = res.data;
                    this.showCard = false;
                    this.$refs.order.focus();
                    this.$store.dispatch('GET_CARDBORD',{cardBord:res.data,len: this.tableData.length});
                } 
            })
        },
        //运单详情
        getDetail (){
            let params = {
                wayBillId: this.procurementNumber,
                weight: Math.ceil(this.packWeight),
                warehouseCode: this.configSet.wareHouse.dataCode
            }
            this.$api.Warehousing.baseOrderDetail(params).then(res=>{
                if (res.errorCode === '100200'){
                    this.$refs.order.select();
                    this.tableData.unshift(res.data);
                    this.currentSourceId = res.data.sourceId;
                    this.$store.dispatch('GET_CARDBORD',{cardBord:this.cardNumber,len: 1});
                } else if(res.errorCode === '100501'){
                    this.tishiTITLE = true;
                    this.waybillVisible = true;
                }
            })
        },
        //根据来源单号查询运单号列表
        findBaseSource (){
            if (!this.checkStala)return;
            if (this.showCard){    //还没创建卡板号
                this.$utils.commonUtils.tip('请先创建卡板号','error')
                return;
            }
            let params = {
                 sourceId: this.checkValue,
                 warehouseCode: this.configSet.wareHouse.dataCode
            }
            this.$api.Warehousing.baseOrderDetail(params).then(res=>{
                if (res.errorCode === '100200'){
                    if (res.data === true){
                        this.$utils.commonUtils.tip('来源单号存在','success')
                        this.$refs.order.select();
                        this.canBind = true;
                    }
                } else if(res.errorCode === '100501'){
                    this.tishiTITLE = false;
                    this.canBind = false;
                    this.waybillVisible = true;
                } 
            })
        },
        //运单号绑定来源单号
        bindSourceId (){
            let params = {
                wayBillId: this.procurementNumber,
                sourceId: this.checkValue,
                weight: this.packWeight
            }
            this.$api.Warehousing.bindSourceId(params).then(res=>{
                if (res.errorCode === '100200'){
                    this.tableData.unshift(res.data);
                    this.currentSourceId = res.data.sourceId;
                    //this.canBind = false;
                    !this.inforShow && (this.inforShow = true);
                } 
            })
        },
        // 移除选中项
        removeRow() {
            if (!this.tableList.length){
                this.$utils.commonUtils.tip('你没有勾选任何单据','error');
                return;
            }
            let tableData = [...this.tableData];
            this.tableData = [];
            tableData.forEach((item,n)=>{
                let flag = true;
                this.tableList.forEach(itemList=>{
                    if (item.id == itemList.id){
                        flag = false
                    }
                })
                flag && this.tableData.push(item)
            })
        },
        sureError (){         //确认异常
            this.$refs['formData'].validate(valid => {
                if (valid){
                    let params = {
                        waybillId: this.formData.value1,
                        warehouse: this.configSet.wareHouse.dataCode,
                        logistics: this.formData.value3,
                        handler: this.formData.value4.name,
                        handlerId: this.formData.value4.id,
                        parcelQuantity: this.formData.value5
                    }
                    this.$api.Warehousing.packageError(params).then(res=>{
                        if (res.errorCode === '100200'){
                            this.errVisible=false
                            this.$utils.commonUtils.tip('异常上报成功','success')
                            this.formData = this.$options.data().formData;
                            this.$nextTick(()=>{
                                this.$refs['formData'].clearValidate()
                            })
                        }
                    })
                }
            })
        },
        showErrorBox (){
            this.errVisible = true;
            this.$nextTick(()=>{
                this.$refs['formData'].clearValidate();
            })
        },
        config(form,userList) {   //参数配置
            if (this.configSet.wareHouse.dataCode != form.wareHouse.dataCode || this.configSet.delivery.dataCode != form.delivery.dataCode ){
                 let MaBiaoObj = this.MaBiaoObj;
                Object.assign(this.$data, this.$options.data());
                this.userList = [...userList];
                this.MaBiaoObj = MaBiaoObj;
            }
            this.configSet = Object.assign(this.configSet,form);
            this.getShippingMethods()
            !this.inforShow && (this.inforShow = true);
        },
        //打印并绑定卡板号
        bindBord (){
            let synergyName = [];
            this.configSet.friendList.forEach(item=>{
                synergyName.push({
                    synergyName: item.name,
                    synergyId: item.id
                })
            })
            let params = [];
            this.tableData.forEach(item=>{
                params.push({
                    cardBoardId: this.cardNumber,
                    sourceId: item.sourceId,
                    waybillId: item.waybillId,
                    cardBoardCreateNumber: this.configSet.delivery.dataCode,   //质检台id
                    reserve1: this.configSet.wareHouse.dataCode,        //仓库code
                    synergyName: JSON.stringify(synergyName)     //协同人数组
                })
            })
            this.$api.Warehousing.bindBord(params).then(res=>{
                if (res.errorCode === '100200'){
                    this.$utils.commonUtils.tip('打印卡板号成功','success');
                    this.printCard();
                    let configSet = this.configSet;
                    this.reset();
                    this.configSet = configSet;
                }
            })
        },
        printCard (){
            let LODOP = getLodop()//调用getLodop获取LODOP对象
            if (!LODOP){
                return;
            } 
            let width = this.$utils.commonUtils.mmConversionPx(100)
            let height = this.$utils.commonUtils.mmConversionPx(100)
            let left = (width - 200)/2 + 10 + 'px';
            //LODOP.SET_PRINT_PAGESIZE(1, 1000, 1000,"")
            LODOP.ADD_PRINT_BARCODE('120px',left,'200px','60px','128B',this.cardNumber)
            LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
            let strStyleCSS = `<style type='text/css' rel='stylesheet'>.print-card{width:${width}px;height:250px;}.print-card p{font-size: 16px;text-align: center;}.card{margin: 20px 0;}.pack-num {margin-bottom: 50px;}.time {margin-bottom: 20px;}</style>`
            let html = `<head>${strStyleCSS}</head><body><div class='print-card'>
                <p class='card'>卡板号: ${this.cardNumber}</p>
                <p class='pack-num'>包裹数量: ${this.tableData.length}</p>
                <p class="time">时间: ${this.getNowFormatDate()}</p>
                <p class="user">操作人: ${localStorage.userAccount}-${localStorage.accountName}</p>
            </div><body>`
            LODOP.ADD_PRINT_HTM(220,0,width,316,html);
            //LODOP.PREVIEW()
            LODOP.PRINT()
            //LODOP.ADD_PRINT_TEXT('45px',left,'150px','16px',`SKU`);
        },
        getNowFormatDate() {//获取当前时间
            let date = new Date();
            return this.$utils.commonUtils.format(date,'YYYY-MM-DD hh:mm:ss') 
        },
        // 表格勾选
        handleSelectionChange(val) {
            this.tableList = val;
        },
        //重置
        reset (){
            let configSet = this.configSet;
            let MaBiaoObj = this.MaBiaoObj;
            Object.assign(this.$data, this.$options.data());
            this.configSet = configSet;
            this.MaBiaoObj = MaBiaoObj;
            this.dialogVisible = false;
        }
    }
};
</script>
<style lang='scss' scoped>
.print-card {
    width: 377px;
    height: 377px;

}
.print-card p{
    font-size: 16px;
    text-align: center;
}
.card {
    margin: 20px 0;
}
.pack-num {
    margin-bottom: 50px;
}
.time {
    margin-bottom: 20px;
}
</style>
