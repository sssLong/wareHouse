<template>
<div class="logistics-box">
    <V-Title title="物流详情页"></V-Title>
    <div class="table-container pl-20 pr-20 mt-20">
        <el-tabs v-model="activeName">
            <el-tab-pane label="物流商信息" name="first">
                <el-form  label-position="left" :rules="fromRules" ref="fromRef" :model="addlogisticsForm" label-width="120px" class="mt-5 ml-10">
                    <div class="item-prop-list clearfix">
                        <el-form-item label="客户代码" prop="customerCode">
                            <el-input :disabled="istype" v-model="addlogisticsForm.customerCode" @change="isValidFn('customerCode','客户代码')"></el-input>
                        </el-form-item>
                        <el-form-item label="token值" prop="token">
                            <el-input :disabled="istype" v-model="addlogisticsForm.token" @change="isValidFn('token','token')"></el-input>
                        </el-form-item>
                    </div>
                    <div class="item-prop-list clearfix">
                        <el-form-item label="物流商简称" prop="logisticsShortened"> 
                            <el-input :disabled="istype" @change="isValidFn('logisticsShortened','物流商简称')" v-model="addlogisticsForm.logisticsShortened"></el-input>
                        </el-form-item>
                        <el-form-item label="物流商代码" prop="logisticsCode">
                            <el-input :disabled="istype" v-model="addlogisticsForm.logisticsCode" @change="isValidFn('logisticsCode','物流商代码')"></el-input>
                        </el-form-item>
                    </div>
                    <div class="item-prop-list clearfix">
                        <el-form-item label="物流商全称" prop="logisticsFullName">
                            <el-input :disabled="istype" v-model="addlogisticsForm.logisticsFullName" @change="isValidFn('logisticsFullName','物流商全称')"></el-input>
                        </el-form-item>
                        <el-form-item label="是否api对接" prop="logisticsType">
                            <el-select :disabled="istype" v-model="addlogisticsForm.logisticsType" placeholder="请选择">
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="item-prop-list clearfix">
                        <el-form-item label="联系人1" prop="contact1">
                            <el-input :disabled="istype" v-model="addlogisticsForm.contact1"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式1" prop="mobile1">
                            <el-input :disabled="istype" v-model="addlogisticsForm.mobile1"></el-input>
                        </el-form-item>
                    </div>
                    <div class="item-prop-list clearfix">
                        <el-form-item label="联系人2" prop="contact2">
                            <el-input :disabled="istype" v-model="addlogisticsForm.contact2"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式2" prop="mobile2">
                            <el-input :disabled="istype" v-model="addlogisticsForm.mobile2"></el-input>
                        </el-form-item>
                    </div>
                    <div class="item-prop-list clearfix">
                        <el-form-item label="国家" prop="country">
                            <el-select 
                            :disabled="istype"  
                            v-model="addlogisticsForm.country" 
                            filterable  
                            placeholder="请选择" 
                            @change="val => {cascaderChangeHandle(val, 'stateList', ['state', 'city']);addlogisticsForm.state = '';addlogisticsForm.city = '';}"
                            >
                                <el-option  v-for="item in countryList" :key="item.id" :label="item.countryName" :value="item.id + ''">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="省/州" prop="state" >
                        <el-select 
                        v-model="addlogisticsForm.state" 
                        :disabled="istype || !addlogisticsForm.country"
                        @change="val => {cascaderChangeHandle(val, 'cityList', ['city']);addlogisticsForm.city = '';}"
                        placeholder="请先选择省/州"
                        >
                            <el-option v-for="item in stateList" :key="item.id" :label="item.countryName" :value="item.id + ''"></el-option>
                        </el-select>
                        </el-form-item>
                    </div>
                        <div class="item-prop-list clearfix">
                        <el-form-item label="城市" prop="city">
                            <el-select 
                            v-model="addlogisticsForm.city" 
                            :disabled="istype || !addlogisticsForm.country"
                            placeholder="请先选择城市"
                            >
                                <el-option v-for="item in cityList" :key="item.id" :label="item.countryName" :value="item.id + ''"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收件详细地址" prop="address">
                            <el-input :disabled="istype" v-model="addlogisticsForm.address"></el-input>
                        </el-form-item>
                    </div>
                    <div class="item-prop-list clearfix">
                        <el-form-item label="是否有效" prop="isValid">
                            <el-select :disabled="istype" v-model="addlogisticsForm.isValid" placeholder="请选择">
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
                <V-BottomBtn :buttonList="buttonList" @cancel="toBack" :noBack="true" @subm="submit" @changeFn='changeFn'></V-BottomBtn>
            </el-tab-pane>
            <el-tab-pane label="运输方式信息" name="second" :disabled="this.$route.query.type == 1">
                <div class="table-operation">
                    <div class="clearfix">
                        <button class="addbtn fr mb-10" v-show="btnPermission('添加运输方式')" @click="toLogisticsDetail">
                            <i class="iconfont iconchuangjianqiaban"></i>
                            <span>新添运输方式</span>
                        </button>
                    </div>
                    <V-Table
                        :dataSource = "dataSource"
                        @updateLogisticsDetail='updateLogisticsDetail'
                    >
                    <template slot-scope="scopes" slot="HasTrackingNumber">
                        <el-switch
                            :width='34'
                            v-model="scopes.scope.row.isValid"
                            active-color="#2A8BFF"
                            inactive-color="#d2d2d2"
                            @change='isEnableSwitchFn(scopes.scope.row)'
                            >
                        </el-switch>
                    </template>
                    </V-Table>
                    <el-pagination
                        class="mb-30"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="editParams.page"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="editParams.row"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="editParams.total">
                    </el-pagination>
                    <V-BottomBtn :buttonList="buttonList2" @cancel="toBack" :noBack="true"></V-BottomBtn>
                </div>
                
            </el-tab-pane>
        </el-tabs>
    </div>
        <!-- 引入表格公共组件 START -->
    </div>
</template>

<script>
import { transportType } from './cols'
export default {
    name:'LogisticsManage_LogisticsManManage',
    data () {
    return {
        addlogisticsForm:{
            state:'',   //省、州
            customerCode:"",		//客户代码
            token:"",		//token
            logisticsShortened:"",		//物流商简称
            logisticsCode:"",		//物流商代码
            logisticsFullName:"",		//物流商全称
            logisticsType:1,		//是否api对接
            contact1:"",			//联系人1
            mobile1:"",			//联系方式1
            contact2:"",			//联系人2
            mobile2:"",			//联系方式2
            country:"",			//国家
            state:"",			//省/州
            city:"",			//城市
            address:"",			//收件详细地址
            isValid:1,			//是否有效
        },
        fromRules:{
            logisticsShortened:[{ required: true, message: '请填写物流商简称', trigger: 'blur' }],
            logisticsCode:[{ required: true, message: '请填写物流商代码', trigger: 'blur' }],
            logisticsFullName:[{ required: true, message: '请填写物流商全称', trigger: 'blur' }],
            logisticsType:[{ required: true, message: '请选择物流商类型', trigger: 'change' }],
            country:[{ required: true, message: '请选择国家', trigger: 'change' }],
            state:[{ required: true, message: '请选择地区', trigger: 'change'}],
            address:[{ required: true, message: '请填写收件详细地址', trigger: 'blur' }],
        },
        activeName:'first',
        inputContent:'',
        selectType:'',
        dataSource: {
            data: [], // 表格数据
            cols: transportType, // 表格的列数据
            // isSelection: true, // 表格有多选时设置
            isOperation: true, // 表格有操作列时设置
            operation: { // 表格有操作列时设置
                label: '操作', // 列名
                width: '120', // 根据实际情况给宽度
                data: [
                    {
                        label: '查看', // 操作名称
                        emitType: 'updateLogisticsDetail', // 触发父组件
                        permission: '运输方式查看', // 后期这个操作的权限，用来控制权限
                    },
                ]
            }
        },
        countryList:[], //国家列表
        buttonList:[
            {
                name:'返回',    //按钮名称
                emitType:'cancel'    //方法
            },
        ],
        buttonList2:[
            {
                name:'返回',    //按钮名称
                emitType:'cancel'    //方法
            },
        ],
        buttonType:{},
        props: {
            label:'dataName',
            value: 'dataCode',
            children: 'children',
            id:'dataCode'
        },
        stateList:[],       //省份列表  
        cityList:[],        //城市列表
        istype:false,      //是否修改&查看&新添
        params:{},          //get 参数
        editParams:{        //获取运输方式接口参数
            providerId:'',
            page:1,
            row:10,
            total:0
        },    
        oldLogisticsData:{},
        isValidFnData:{
            customerCode:false,
            token:false,
            logisticsShortened:false,
            logisticsCode:false,
            logisticsFullName:false
        }
    }
  },
  activated(){
        this.ischange()
        this.editParams.providerId = this.$route.query.id
        this.editParams.page = 1
        if(this.$route.query.type == 2){
            this.$refs['fromRef'].resetFields()
        }
        if(this.$route.query.activeName) {
            this.activeName = this.$route.query.activeName
        } else {
            this.activeName='first'
        }
        if(this.$route.query.type){
            if(this.$route.query.type != 1){
                this.buttonList = [
                    {
                        name:'返回',    //按钮名称
                        emitType:'cancel'    //方法
                    },
                    {
                        name:'修改',    //按钮名称
                        type:true,    //是否为主按钮-可不传
                        emitType:'changeFn'    //方法
                    },
                ]
            }else{
                this.buttonList = [
                    {
                        name:'返回',    //按钮名称
                        emitType:'cancel'    //方法
                    },
                    {
                        name:'保存',    //按钮名称
                        type:true,    //是否为主按钮-可不传
                        emitType:'subm'    //方法
                    },
                ]
            }
        }
  },
  watch:{
      activeName(val, oldVal){
          if(val == 'second'){
              this.getEditMethod()
          }
      }
  },
  methods:{
    // 跳到物流商云途详情页面  点击新添
    toLogisticsDetail() {
        this.$router.push({path: '/LogisticsManage/LogisticsDetail', query: {id: this.$route.query.id,type:'1'}})
        this.$store.commit("getFreshAddL", true)
    },
    // 跳到物流商云途详情页面  点击查看
    updateLogisticsDetail(index,rowData){
        localStorage.setItem('Logistics', JSON.stringify(rowData));
        // query参数：id为物流商id, Logistics为运输方式id
        this.$store.commit("getFreshAddL", true)
        this.$router.push({path: '/LogisticsManage/LogisticsDetail', query: {id: this.$route.query.id,Logistics:rowData.id,type:'2'}})
    },
    search(){
        let params = this.params
        this.$set(this.dataSource,'loading',true)
        this.$api.LogisticsManage.getLogisticsList(params).then(res=>{
            if(res.errorCode == '100200'){
                this.addlogisticsForm = res.data.pageInfo.list[0]
                delete this.addlogisticsForm.createBy
                delete this.addlogisticsForm.createDate
                this.oldLogisticsData = Object.assign({},res.data.pageInfo.list[0])     // 用来判断客户代码、token 、简称、物流商代码、物流商全程是否在数据库中存在
            }else{
                this.$utils.commonUtils.tip(res.msg,'error')
            }
            this.$set(this.dataSource,'loading',false)
            // 获取国家
            this.cascaderChangeHandle('', 'countryList').then(() => {
                if (!this.addlogisticsForm.country) return
                this.cascaderChangeHandle(this.addlogisticsForm.country, 'stateList').then(() => {
                if (!this.addlogisticsForm.state) return
                this.cascaderChangeHandle(this.addlogisticsForm.state, 'cityList')
                })
            })
        })
    },
    submit(){   //提交物流商表单
        this.$refs['fromRef'].validate((valid)=>{
            if(valid){
                if(this.$route.query.type == 1) delete this.addlogisticsForm.id
                for(let key in this.isValidFnData){
                    if(this.isValidFnData[key] === true){
                        this.$utils.commonUtils.tip('存在重复值，请修改之后再提交','error')
                        return false
                    }
                }
                this.$api.LogisticsManage.addlogisticsData(this.addlogisticsForm).then(res=>{
                    if(res.errorCode == '100200'){
                        this.$utils.commonUtils.tip(res.msg,'success')
                        this.$refs['fromRef'].clearValidate()
                        this.$router.push('/LogisticsManage/LogisticsManManage')
                    }
                })
            }else{
                this.$utils.commonUtils.tip('请先通过验证','error')
            }
        })
    },
    async isValidFn(keyName,name){    //判断 物流商简称、物流商编码、客户代码、token、物流商全称 在历史物流商中是否有重复
        if(this.$route.query.type === '2' && this.oldLogisticsData[keyName] === this.addlogisticsForm[keyName]) {
            return
        }
        let params = {page:1,row:10}
        params[keyName] = this.addlogisticsForm[keyName]
        this.$api.LogisticsManage.getLogisticsList(params).then(res=>{
            if(res.errorCode == '100200'){
                if(res.data.pageInfo.list.length != 0){
                    this.isValidFnData[keyName] = true
                    this.$utils.commonUtils.tip(name+'已经存在，请更换','error')
                }else{
                    this.isValidFnData[keyName] = false
                    
                }
            }
        })
    },
    async ischange(){ //1：新添，2：查看，  3:修改
        if(this.$route.query.type ==2){    
            this.istype = true
            this.params={
                page:1,
                row:10,
                id:this.$route.query.id
            }
            this.search();
        }
        else if(this.$route.query.type ==1){
            this.$refs.fromRef.resetFields()
            this.istype = false
            this.cascaderChangeHandle('', 'countryList');
        }
        else if(this.$route.query.type ==3){
            this.istype = false
            this.params={
                page:1,
                row:10,
                id:this.$route.query.id
            }
            this.search();
        }
        
        
    },
    toBack(){
        this.$router.push('/LogisticsManage/LogisticsManManage')
    },
    handleSizeChange(val){  //每页条数
        this.editParams.row =  val
        this.getEditMethod()
        
    },
    handleCurrentChange(val){  //翻页 
        this.editParams.page =  val
        this.getEditMethod()
    },
    isEnableSwitchFn(rowData){  //物流商启用停用 
        rowData.isValid == true ? rowData.isValid = 1 : rowData.isValid = 2
        let params = {
            methodId:rowData.id,
            isValid:rowData.isValid
        }
        this.$api.LogisticsManage.enableDisableMethod(params).then(res=>{
            if(res.errorCode == '100200'){
                rowData.isValid == 1 ? rowData.isValid = true : rowData.isValid = false
                this.$utils.commonUtils.tip(res.msg,'success')
            }else{
                this.$utils.commonUtils.tip(res.msg,'error')
            }
        })
    // operatingEditMethod
    },    
    getEditMethod(){   //获取运输方式
        let editParams = this.editParams
        this.$api.LogisticsManage.getEditMethod(editParams).then(res=>{
            if(res.errorCode == '100200'){
                res.data.pageInfo.list.map(item=>{
                    item.isValid == 2?item.isValid = false:item.isValid = true
                })
                this.editParams.total = res.data.pageInfo.total
                this.dataSource.data = res.data.pageInfo.list
            }
        })
    },
    async cascaderChangeHandle(val, propList, clearProps = []) {
        if (this.istype) return
        let { data = [] } = await this.$api.LogisticsManage.getCountryCascader(val)
        this[propList] = data
    },
    async changeFn(){
        this.istype = false
        this.buttonList = [
            {
                name:'返回',    //按钮名称
                emitType:'cancel'    //方法
            },
            {
                name:'保存',    //按钮名称
                type:true,    //是否为主按钮-可不传
                emitType:'subm'    //方法
            },
        ]
        if (!this['countryList'] || !this['countryList'].length) {
            let { data = [] } = await this.$api.LogisticsManage.getCountryCascader()
            this['countryList'] = data
        }
    },
  }
}
</script>
<style lang="scss" scoped>
    .logistics-box{
        .item-prop-list{
            margin-bottom: 20px;
            .el-form-item{
                float: left;
                margin-bottom: 0;
                .el-input,.el-select,.el-cascader{width: 240px;}
            }
            .el-form-item:nth-child(1){margin-right: 100px;}
        }
        .table-operation{
            .addbtn{color: #2A8BFF ;font-size: 12px;background: none;border: none;cursor: pointer;}
        }
    }
</style>
