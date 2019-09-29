<!--
 * @Autor: 廖佳星
 * @LastEditors: 廖佳星
 * @LastEditTime: 2019-09-11 14:10:55
 -->
<template>
<div class="AccountsManageBox">
    <V-Title title="账号管理">
        <div class="search-content">
            <el-input clearable placeholder="请输入查询内容"  v-model="inputContent" class="input-with-select" @clear='seachInputFn();page=1' @keyup.native.enter="seachInputFn();pagination.page=1">
                <el-select v-model="select1" slot="prepend" placeholder="请选择" class="iconfont icon-xiala selectShelf selectScan" >
                    <el-option label="姓名" value="4"></el-option>
                    <el-option label="账号" value="5"></el-option>
                    <el-option label="角色" value="2"></el-option>
                    <el-option label="所属仓库" value="1"></el-option>
                    <el-option label="职位" value="3"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="seachInputFn()"></el-button>
            </el-input>
        </div>
    </V-Title>
    <div class="mb-30 pl-20 pr-20 mt-20">
        <span class="ceatTimeSpan">创建时间</span>
        <el-date-picker
            class="dataTime "
            v-model="timeValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="['00:00:00', '23:59:59']"
            @change="seachTimeFn()"
            value-format="yyyy-MM-dd HH:mm:ss" >
        </el-date-picker> 
    </div>
    <div class="table-container pl-20 pr-20">
        <div class="table-operation mb-10">
            <div class="title">账号列表</div>
            <div class="operation">
                <div @click="allstartFn()" v-show="btnPermission('账号管理启用')">
                    <i class="iconfont iconqiyong"></i>
                    <span>启用</span>
                </div>
                <div @click="allEndFn()" v-show="btnPermission('账号管理禁用')">
                    <i class="iconfont iconjinyong"></i>
                    <span>禁用</span>
                </div>
                <div @click="addUserShowFn()" v-show="btnPermission('账号管理新添')">
                    <i class="iconfont iconchuangjianqiaban"></i>
                    <span>新添</span>
                </div>
            </div>
        </div>
        <!-- 引入表格公共组件 START -->
        <V-Table 
            :dataSource = "dataSource"
            @selection-change = "handleSelectionChange"
            @modifytableDataFn = "modifytableDataFn"
            @modifyPwdFn = 'modifyPwdFn'
            @modifyroleFn = 'modifyroleFn'
        >
        <!-- slot 自定义列的情况 -->
        <template slot-scope="scopes" slot="enabled">
            <el-switch
                :width='34'
                v-model="scopes.scope.row.enabled"
                active-color="#2A8BFF"
                inactive-color="#d2d2d2"
                @change='isEnableSwitchFn(scopes.scope.row)'
                >
            </el-switch>
        </template>
        </V-Table>
        <div class="block mt-30 mb-30">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagination.row"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
            </el-pagination>
        </div>
    </div>
<!--    新添修改账户弹窗-->

    <el-dialog
        :title="dialotitle"
        :visible.sync="returnShow"
        width="480px"
        class='return-box'
        :close-on-click-modal='false' 
        >
        <el-form :model="returnForm" :rules="rules" ref="volidReturnForm" label-width="100px" class="return-form">
            <el-form-item label="账号" prop="account">
                <el-input :disabled="isdisabledFn" maxlength='6' clearable v-model="returnForm.account" type="text" placeholder="请输入员工工号"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input :disabled="isdisabledFn"  clearable v-model="returnForm.name" placeholder="请输入员工姓名" ></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contactWay">
                <el-input clearable v-model="returnForm.contactWay" placeholder="请输入员工联系方式" ></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="returnForm.sex" placeholder="请选择">
                    <el-option :value='0' label="男"></el-option>
                    <el-option :value='1' label="女"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账号状态" prop="enabled">
                <el-select v-model="returnForm.enabled" placeholder="请选择">
                    <el-option :value='0' label="启用"></el-option>
                    <el-option :value='1' label="停用"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="部门" prop="departmentName">
                <el-cascader
                    :options="companyDataList" 
                    v-model="returnForm.departmentName"   
                    ref="cascaderCompany" 
                    :props="companyDataprops"
                    @change="formCompanyFn" 
                    :change-on-select='true'
                    clearable>
                    </el-cascader>
            </el-form-item>
            <el-form-item label="职位" prop="position">
            <el-select v-model="returnForm.position">
                <el-option v-for="(item,key) in companyOptions" :key="key" :label="item" :value="item"></el-option>
            </el-select>
            </el-form-item>
            <div class="relative">
                <el-form-item label="角色" prop="roleList">
                    <div class="el-select">
                        <el-cascader-multi
                            v-model="returnForm.roleList"
                            :data="warehousingArray"
                            :props="roleConfigProps"
                        ></el-cascader-multi>
                    </div>
                </el-form-item>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="returnShow=false">取 消</el-button>
            <el-button type="primary" @click="addUserFn('volidReturnForm')" >确 定</el-button>
        </span>
    </el-dialog>
    
    <el-dialog
        title="重置密码"
        :visible.sync="modifyPwdShow"
        width="480px"
        class='return-box'
        >
        <div class="modifyPwdBox">
            <p class="iconyichangp"><i class="iconfont iconyichang"></i></p>
            <p class="text mt-30 mb-40">是否确认对当前账号密码重置为初始密码6个1？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyPwdShow=false">取 消</el-button>
                <el-button type="primary" @click="modifyPwdsuccessFn()">确 定</el-button>
            </span>
        </div>
    </el-dialog>
    <el-dialog
        title="绑定角色"
        :visible.sync="modifyroleShow"
        width="480px"
        class='return-box'
        >
        <div class="modifyRoleBox">
            <el-form label-width="100px" :model="modifyRoleForm"  ref='modifyRoleFormRef' class="return-form">
                <el-form-item label="角色" prop="modifyRoleValue" :rules="[{ required: true, message: '角色必填', trigger: 'change' }]">
                    <el-cascader-multi
                    v-model="modifyRoleForm.modifyRoleValue"
                    :data="warehousingArray"
                    :props="roleConfigProps"
                ></el-cascader-multi>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="modifyroleShow=false;modifyRoleForm.modifyRoleValue=[]">取 消</el-button>
            <el-button type="primary" @click="bindingRole('modifyRoleFormRef')">确 定</el-button>
        </span>
    </el-dialog>

</div>
</template>

<script>
import Vue from "vue";
import { AccountManagetable } from './cols'
import elCascaderMulti from "el-cascader-multi";
import '../../../assets/css/UserManame/AccountsManage.scss'
Vue.use(elCascaderMulti);
export default {
    name:'UserManage_AccountsManage',
    data () {
    const validateNumber = (rule, value, callback) => {
        if (!value) {
            callback(new Error('账号不能为空'))
        }
        value = Number(value)
        if (typeof value === 'number' && !isNaN(value)) {
            callback()
        } else {
            callback(new Error('账号必须为数字'))
        }
    }
    const validatorName=(rule,val,callback)=>{
        if(!val){
            callback(new Error('姓名不能为空'))
        }
        else if(!/^[0-9\u4e00-\u9fa5]+$/i.test(val)){
            callback(new Error('只能输入中文和数字'))
        }else{
            callback()
        }
    }
    return {
        modifyRoleForm:{
            modifyRoleValue:[],
        },
        roleConfigProps:{
            label: 'dataName',
            value: 'dataCode',
            children:'children',
            multiple: true,
        },
        returnFormPosition:[],
        warehousingArray: [],
        warehousingArrayNull:[],    //仓库下没有绑定任何角色下标
        modifyroleShow:false,    //绑定角色弹窗
        modifyPwdShow:false, //弹窗修改密码是否显示
        returnShow:false,   //弹窗表单是否显示
        dialotitle:'新添账号',  //弹窗title
        timeValue:'',       //检索时间
        inputContent:'',    //头部搜索框
        select1:'4',     //头部下拉框
        returnForm:{    //弹框里面的value
            account:'',    //账户
            name:'',    //姓名
            sex:0,         //姓名
            enabled:0,      //账号状态
            contactWay:'',       //联系方式
            departmentName:[],     //部门
            position:'',    //职位
            roleList:[],        //角色
        },
        rules:{
            account: [{validator: validateNumber, required: true,trigger: 'blur'}],
            name: [{ validator:validatorName,required: true, trigger: 'blur'  },{max:10,message:'最多只能输入10个字符',trigger:'blur'}],
            sex: [{ required: true, message: '性别必填', trigger: 'blur' }],
            // contactWay: [{ required: true, message: '联系方式必填', trigger: 'blur' }],
            enabled: [{ required: true, message: '账号状态必填', trigger: 'blur' }],
            departmentName: [{ required: true, message: '部门必填', trigger: 'change' }],
            position: [{ required: true, message: '职位必填', trigger: 'change' }],
            roleList: [{ required: true, message: '角色必填', trigger: 'change' }],
        },
        dataSource: {
            data: [], // 表格数据
            cols: AccountManagetable, // 表格的列数据
            isSelection: true, // 表格有多选时设置
            isOperation: true, // 表格有操作列时设置
            operation: { // 表格有操作列时设置
                label: '操作', // 列名
                width: '170', // 根据实际情况给宽度
                data: [
                    {
                        label: '重置密码', // 操作名称
                        emitType: 'modifyPwdFn', // 触发父组件
                        permission: '账户管理重置密码', // 后期这个操作的权限，用来控制权限
                    },
                    {
                        label: '绑定', // 操作名称
                        emitType: 'modifyroleFn', // 触发父组件
                        permission: '账号管理绑定', // 后期这个操作的权限，用来控制权限
                    },
                    {
                        label: '修改', // 操作名称
                        emitType: 'modifytableDataFn', // 触发父组件
                        permission: '账号管理修改', // 后期这个操作的权限，用来控制权限
                    },
                ]
            }
        },
        multipleSelection:[],   //批量账号启用停用
        roleDataList:[],
        clickRowId:'',    //被操作的行数id
        companyDataList:[],
        companyDataprops:{
            label: 'name',
            value: 'id',
            children:'children',
        },
        companyOptions:[],
        isdisabledFn:false, //控制修改添加角色input框
        pagination:{
            total:100,
            page:1,
            row:10,
            endTime:'',
            startTime:'',
            role: "",
            warehouseName: "",
            position: "",
            account:'',
            name:''
        },
        newcompanyList:[]
    }
  },
  created(){
      this.search();
  },
  deactivated(){
    this.modifyroleShow = false
    this.modifyPwdShow = false
    this.returnShow = false
  },
  methods:{
        modifytableDataFn(index,row){    //修改账户信息弹窗 并回填内容
            this.$refs.volidReturnForm && this.$refs.volidReturnForm.resetFields();
            const rowData = {};
            this.clickRowId = row.id;
            let returnDepartmentName = [];
            let companyName = row.companyName;  //公司名称
            let departmentId = row.departmentId;
            let departmentName = row.departmentName;
            let key = 0;
            let name = [...[companyName],...departmentName.split('-')];
            newData(this.companyDataList,key)
            function newData (data,index){  //回填部门
                data.forEach(item=>{
                    if(item.name == name[index] || item.id == name[index] ){
                        returnDepartmentName.push(item.id)
                        if(item.children != undefined ){
                            if(item.children.length != 0){
                                newData(item.children,index+1)
                            }
                        }
                    }
                })
            }
            this.returnShow = true;
            this.dialotitle = '编辑';
            row.enabled==true?rowData.enabled=0:rowData.enabled=1;
            rowData.roleList = this.returnRoleDataFn(row);
            rowData.departmentName = returnDepartmentName;
            this.formCompanyFn(returnDepartmentName)
            rowData.account = row.account
            rowData.name = row.name
            rowData.sex = row.sex
            rowData.position = row.position
            rowData.contactWay = row.contactWay
            this.returnForm = rowData;
            this.isdisabledFn = true;
        },
        addUserShowFn(){        //添加账户按钮现实弹窗
            this.$refs.volidReturnForm && this.$refs.volidReturnForm.resetFields();
            this.returnShow = true;
            this.dialotitle = '新添';
            this.clickRowId = '';
            this.isdisabledFn = false;
            this.returnForm = {    //弹框里面的value
                account:'',    //账户
                name:'',    //姓名
                sex:0,         //姓名
                enabled:0,      //账号状态
                contactWay:'',       //联系方式
                departmentName:[],     //部门
                position:'',    //职位
                roleList:[],        //角色
            }
        },
        addUserFn(volidReturnForm){    //添加账户确定按钮
            let returnFormData = this.returnForm;
            let paramswarehouseData = this.findWarehouseIdAndName(returnFormData.roleList);
            let roleIdsList = paramswarehouseData.params.roleIds.split(',');
            let departmentName = this.$refs['cascaderCompany'].currentLabels.slice(1,this.$refs['cascaderCompany'].currentLabels.length);
            if(roleIdsList.some(item=>{return item == ""})){
                this.$utils.commonUtils.tip('仓库未绑定角色，请检查','error')
                return false
            }
            let departmentList = []   //拼凑部门键值对
            this.returnForm.departmentName.forEach((item,index)=>{
                let departmentDict = {}
                departmentDict.id = item
                departmentDict.name = this.$refs['cascaderCompany'].currentLabels[index]  //根据refs拿到name
                departmentDict.seq = index
                departmentList.push(departmentDict)
            })
            departmentList.shift();
            let params={
                id:this.clickRowId,
                account:returnFormData.account,                        //账户
                name:returnFormData.name,                               //姓名
                contactWay:returnFormData.contactWay,                        //联系方式
                companyName:this.$refs['cascaderCompany'].currentLabels[0],
                companyId:JSON.stringify(returnFormData.departmentName[0]),           //所属公司id ,
                departmentDetailList:departmentList,  //部门,
                enabled:returnFormData.enabled,                          //是否启用
                position:returnFormData.position,                           //职位 ,
                roleIds:roleIdsList,                                    //角色id集合 ,
                sex:returnFormData.sex,                                 //性别
                warehouseList:paramswarehouseData.paramswarehouse,      //所属仓库信息
            };
            this.$refs[volidReturnForm].validate((valid)=>{                    
                if(valid) {
                    if(this.dialotitle == '新添'){
                        this.$api.UserManage.addUser(params).then(res=>{
                            if(res.errorCode === '100200'){
                                this.$message({message:'新添账号成功，密码是初始密码6个1.', type: 'success',duration:'3000',showClose:true})
                                this.search()
                                this.returnShow = false;
                                this.$refs.volidReturnForm && this.$refs.volidReturnForm.resetFields();
                            }else{
                                this.$utils.commonUtils.tip(res.msg,'error')
                            }
                        })
                    }
                    else{
                        this.$api.UserManage.updateUser(params).then(res=>{
                            if(res.errorCode === '100200'){
                                this.$utils.commonUtils.tip(res.msg,'success')
                                this.search()
                                this.returnShow = false;
                                this.$refs.volidReturnForm && this.$refs.volidReturnForm.resetFields();
                            }else{
                              this.$utils.commonUtils.tip(res.msg,'error')
                            }
                        })
                    }
                }
            })
        },
        getCompanyDataList(){     //获取组织架构
          this.$api.UserManage.getCompanyTree().then(res=>{
            if(res.errorCode == '100200'){
              let newDataFn = (data)=>{
                data.forEach(item=>{
                  try{
                    if(item.children.length == 0){
                        delete item['children'];
                    }else{
                        newDataFn(item.children)
                    }
                  }catch (e) {

                  }
                })
              }
              newDataFn(res.data)
              this.companyDataList = res.data;
              this.newcompanyListFn()
            }
          })
        },
        formCompanyFn(val){     //新添账户时选择部门 与职位联动
            try{
                let vallength = val.length;
                let companyDatalist = this.companyDataList;
                let position = '';
                this.returnForm.position = '';
                let companyItem = this.newcompanyList.find(item=>{
                    return item.id == val[vallength-1]
                })
                this.companyOptions = companyItem.position.split(',')
            }catch(e){}
        },
        newcompanyListFn(){
            let newcompany = []
            newcompanyListFn(this.companyDataList)
            function newcompanyListFn(data){
                data.forEach(item=>{
                    if(item.children != null){
                        newcompanyListFn(item.children)
                    }
                    newcompany.push(item)
                })
            }

            this.newcompanyList = newcompany
        },
        modifyroleFn(index,row){     //绑定角色按钮现实弹窗
            this.modifyroleShow = true;
            this.clickRowId = row.id;
            this.returnRoleDataFn(row)
            this.modifyRoleForm.modifyRoleValue =  this.returnRoleDataFn(row);
        },
        returnRoleDataFn(data){     //回填角色选项
                try{
                    let roleList = data.roleList.split(',');
                    let warehousList = data.warehouseList;
                    let returnRoleData=[];
                    warehousList.forEach(item=>{        //找到符合条件的仓库
                        let warehousString = item.warehouseName.split('-')[0]
                        let rolePositionString =  item.warehouseName.split('-')[1]
                        let b = this.warehousingArray.find(warehousitem=>{ return warehousitem.label == warehousString})
                        let rolePostion = b.children.find(childrenItem=>{return childrenItem.label == rolePositionString})
                        let returnRoleList = []
                        returnRoleList[0] = b.value
                        returnRoleList[1] = rolePostion.value
                        returnRoleData.push(returnRoleList)
                    
                    })
                    return returnRoleData;
                }catch(e){
                    this.returnShow = false;
                    this.$utils.commonUtils.tip('当前账号数据出现错误，请重新绑定角色','error')
                }
            
        },
        bindingRole(modifyRoleFormRef){  //绑定角色确定按钮
            let paramsDataDict = this.findWarehouseIdAndName(this.modifyRoleForm.modifyRoleValue)
            let params = paramsDataDict.params;
            let paramswarehouse = paramsDataDict.paramswarehouse
            this.$refs[modifyRoleFormRef].validate((valid)=>{ 
                if(valid){
                    this.$api.UserManage.bindingRoles(params,paramswarehouse).then(res=>{
                        if(res.errorCode === '100200'){
                            this.$utils.commonUtils.tip(res.msg,'success')
                            this.search()
                            this.modifyroleShow = false
                        }else{
                            this.$utils.commonUtils.tip(res.msg,'error')
                        }
                    })
                }else{
                  this.$utils.commonUtils.tip('验证不通过','error')
                }
            })
        }, 
        // 绑定角色时取出仓库id和职位名字 
        findWarehouseIdAndName(data){
            let warehousingMap = {};    //仓库map
            let RoleMap = {};       //角色map
            let roleDataList = [];
            this.warehousingArray.forEach((item,index)=>{
                warehousingMap[item.value] = item.label;    
                item.children.forEach(childrenItem=>{
                    roleDataList.push(childrenItem);
                })
            })
            roleDataList.forEach(item=>{
                RoleMap[item.value] = item.label;    
            })
            let wparamsId = new Set();
            let paramsRoleId = [];
            let paramswarehouse = [];
            data.forEach((childrenitem,index)=>{
                wparamsId.add(childrenitem[0])
                paramsRoleId.push(childrenitem[1])
                let paramswarehouseDict = {
                    warehouseCode:childrenitem[0],
                    warehouseName:warehousingMap[childrenitem[0]] +'-'+ RoleMap[childrenitem[1]],
                };
                paramswarehouse.push(paramswarehouseDict)
            })
            let params = {
                id:this.clickRowId,
                roleIds:paramsRoleId.join(',')
            }
            let returnData = {
                params:params,
                paramswarehouse:paramswarehouse
            }
            return returnData
        },
        getWarehouseRoleListFn(val){  //获取仓库下有什么角色列表
            this.$api.UserManage.getRoleListByWarehouseCode(1).then(res=>{
                if(res.errorCode == '100200'){
                    let newData = res.data.map(item=>({
                        label:item.warehouseName,
                        value:item.warehouseCode,
                        children:item.roleList.map(childrenitem=>({
                            label:childrenitem.roleName,
                            value:childrenitem.id,
                        }))
                    }))
                    this.warehousingArray = newData.filter(item=>{return item.children.length != 0});
                }
            })
        },
        search(){       //初始获取账户数据
            let params = this.pagination
            this.getWarehouseRoleListFn();
            this.getCompanyDataList();
            this.$set(this.dataSource,'loading',true)
            this.$api.UserManage.getAccountsList(params).then(res=>{
                if(res.errorCode === '100200'){
                    this.pagination.total = res.data.pageInfo.total;
                    let dataList = res.data.pageInfo.list;
                    dataList.forEach(element => {
                        element.enabled == 0?element.enabled=true:element.enabled=false;   
                        let roleList = [];
                        let warehouseList  = [];
                        element.roleList.forEach(item=>{
                            roleList.push(item.roleName)
                        })
                        element.warehouseList.forEach(item=>{
                            warehouseList.push(item.warehouseName)
                        })
                        element.roleList =  warehouseList.join(',');
                    });
                    this.dataSource.data = dataList;
                }else{
                  this.$utils.commonUtils.tip(res.msg,'error')
                }
                this.$set(this.dataSource,'loading',false)
            })
        },
        handleSelectionChange(val){     //表格checkbox
            this.multipleSelection = val;
        },
        allstartFn(){   //批量账户启用
            let multipleSelection = this.multipleSelection;
            if(multipleSelection.length == 0) {
                this.$utils.commonUtils.tip('还没有选择任何一个账户','error')
                return false;
            }
            let accountEnabledList = new Set();           
            this.dataSource.data.forEach(item =>{
                multipleSelection.forEach(childitem =>{
                    accountEnabledList.add(childitem.id)
                    if(childitem.id == item.id){
                        item.enabled = true;
                    }
                })
            })
            accountEnabledList = JSON.parse(JSON.stringify(accountEnabledList));
            this.$api.UserManage.accountEnabled(accountEnabledList).then(res=>{
                if(res.errorCode === '100200'){
                    this.$utils.commonUtils.tip(res.msg,'success')
                }else{
                  this.$utils.commonUtils.tip(res.msg,'error')
                }
            })
        },
        allEndFn(){ //批量账户停用
            let multipleSelection = this.multipleSelection;
            if(multipleSelection.length == 0) {
                this.$utils.commonUtils.tip('还没有选择任何一个账户','error')
                return false;
            }
            let accountDisabledList = new Set();
            this.dataSource.data.forEach(item =>{
                multipleSelection.forEach(childitem =>{
                    accountDisabledList.add(childitem.id)
                    if(childitem.id == item.id){
                        item.enabled = false;
                    }
                })
            })
           accountDisabledList = JSON.parse(JSON.stringify(accountDisabledList));
            this.$api.UserManage.accountDisabled(accountDisabledList).then(res=>{
                if(res.errorCode === '100200'){
                    this.$utils.commonUtils.tip(res.msg,'success')
                }else{
                    this.$utils.commonUtils.tip(res.msg,'error')
                }
            })
        },
        isEnableSwitchFn(data){         //单个账户启用停用
            if(data.enabled){
                this.$api.UserManage.accountEnabled(data.id).then(res=>{
                    if(res.errorCode === '100200'){
                        this.$utils.commonUtils.tip(res.msg,'success')
                    }else{
                        this.$utils.commonUtils.tip(res.msg,'error')
                    }
                })
            }else{
                this.$api.UserManage.accountDisabled(data.id).then(res=>{
                    if(res.errorCode === '100200'){
                        this.$utils.commonUtils.tip(res.msg,'success')
                    }else{
                        this.$utils.commonUtils.tip(res.msg,'error')
                    }
                })
            }
        },
        modifyPwdFn(index,rowData){      //重置密码按钮显示弹窗
            this.modifyPwdShow = true;
            this.clickRowId  = rowData.id;
        },
        modifyPwdsuccessFn(){   //重置密码确定按钮
            let params = this.clickRowId;
            this.$api.UserManage.modifyPwd(params).then(res => {
                if(res.errorCode === '100200'){
                    this.$utils.commonUtils.tip(res.msg,'success')
                }else{
                    this.$utils.commonUtils.tip(res.msg,'error')
                }
            }).catch(error => {

            });
            this.modifyPwdShow = false;
        },
        handleSizeChange(val) {         //调整条数
            this.pagination.row = val;
            this.search();
        },
        handleCurrentChange(val) {       //分页
            this.pagination.page = val;
            this.search();
        },
        seachTimeFn(val){   //根据时间获取内容
            this.pagination.page = 1
            if(this.timeValue != null){
                this.pagination.startTime = this.timeValue[0];
                this.pagination.endTime = this.timeValue[1];
            }else{
                Object.assign(this.$data, this.$options.data())
            }
            this.search();
        },
        seachInputFn(){
            let selectValue = this.select1;
            let inputContent = this.inputContent;
            this.pagination.page = 1
            Object.assign(this.$data, this.$options.data())
            switch(selectValue){
                case '1':{
                    this.pagination.warehouseName = inputContent
                    break;
                }
                case '2':{
                    this.pagination.role = inputContent
                    break;
                }
                case '3':{
                    this.pagination.position = inputContent
                    break;
                }
                case '4':{
                    this.pagination.name =inputContent
                    break;
                }
                case '5':{
                    this.pagination.account  = inputContent
                    break;
                }
            }
            this.select1 = selectValue
            this.inputContent = inputContent
            this.search();
        }
  }
}
</script>