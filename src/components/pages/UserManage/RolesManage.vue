<template>
<div class="roleManageBox">
    <V-Title title="角色管理">
        <div class="search-content">
            <el-input clearable placeholder="请输入查询内容" v-model="inputContent" class="input-with-select" @clear='resetFn()' @keyup.native.enter="search();page=1">
                <el-select v-model="selectValue" slot="prepend"  placeholder="请选择" class="iconfont icon-xiala selectShelf selectScan" >
                    <el-option label="角色名称" value="1"></el-option>
                    <el-option label="创建人" value="2"></el-option>
                    <el-option label="所属仓库" value="3"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click='page=1;search();'></el-button>
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
            value-format="yyyy-MM-dd HH:mm:ss"
            @clear='clearsearch()'
            >
        </el-date-picker> 
    </div>
    <div class="table-container pl-20 pr-20">
        <div class="table-operation mb-10">
            <div class="title">角色管理列表</div>
            <div class="operation">
                <div @click="addRoleShowFn()" v-show="btnPermission('角色管理新添')">
                    <i class="iconfont iconchuangjianqiaban"></i>
                    <span>新添</span>
                </div>
            </div>
        </div>
        <!-- 引入表格公共组件 START -->
        <V-Table 
            :dataSource = "dataSource"
            @modifyRoleFn = 'modifyRoleFn'
            @deletedialogFn = 'deletedialogFn'
            @toPermissionSettingFn='toPermissionSettingFn'>
            <!-- slot 自定义列的情况 -->
            <template slot-scope="scopes" slot="data11">
                <el-switch
                    v-model="scopes.scope.row.data11"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
            </template>
        </V-Table>
        
        <div class="block mt-30 mb-30">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagination.row"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
            </el-pagination>
        </div>
    </div>
    
    
    <el-dialog
        :title="RoleShowTitle"
        :visible.sync="addRoleShow"
        width="480px"
        class='return-box'
        >
        <div class="addRoleBox">
            <el-form :model="addRole"  label-width="100px"  :rules="addRoleRules" ref="addRoleRef"  class="return-form">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input clearable v-model="addRole.roleName" placeholder="请输入角色名称" style="width:240px;"></el-input>
                </el-form-item>
                <el-form-item label="所属仓库" prop="attributionWarehouse">
                    <el-select v-model="addRole.attributionWarehouse" multiple placeholder="请选择" style="width:240px;">
                        <el-option v-for="item in warehouseOptions" :key="item.dataCode" :label="item.dataName" :value="item.dataCode+','+item.dataName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleShow=false">取 消</el-button>
                <el-button type="primary" @click='addRoleFn("addRoleRef")'>确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog
        title="删除菜单"
        :visible.sync="deleteRolesBox"
        width="480px"
        class='return-box'
        >
        <div class="modifyPwdBox">
            <p class="iconyichangp">
                <img src="../../../assets/img/warning.png"/>
            </p>
            <p class="text mt-30 mb-40">确认删除该角色名称吗？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteRolesBox=false">取 消</el-button>
                <el-button type="primary" @click="deleteRoleFn()">确 定</el-button>
            </span>
        </div>
    </el-dialog>
</div>
</template>

<script>
import { rolestable } from './cols'
export default {
    name:'UserManage_AccountsManage',
    data () {
    return {
        deleteRolesBox:false,
        RoleShowTitle:'新增角色',
        addRoleShow:false,
        addRole:{    //新增角色表单
            roleName:'',
            attributionWarehouse:[]
        },    
        addRoleRules:{
            roleName: [{ required: true, message: '角色名称必填', trigger: 'blur' },{max:15,message:'角色名称只能输入15个字符',trigger:'blur'}],
            attributionWarehouse: [{ required: true, message: '所属仓库必填', trigger: 'change' }]
        },
        inputContent:"", //顶部搜索框val
        selectValue:'1',     //顶部selectval
        timeValue:'', //时间检索val
        startTime:'',   //开始时间  
        endTime:'',     //结束时间
        page:1,
        dataSource: {
            data: [], // 表格数据
            cols: rolestable, // 表格的列数据
            // isSelection: true, // 表格有多选时设置
            isOperation: true, // 表格有操作列时设置
            operation: { // 表格有操作列时设置
                label: '操作', // 列名
                width: '170', // 根据实际情况给宽度
                data: [
                    {
                        label: '编辑', // 操作名称
                        emitType: 'modifyRoleFn', // 触发父组件
                        permission: '角色管理编辑', // 后期这个操作的权限，用来控制权限
                    },
                    {
                        label: '删除', // 操作名称
                        emitType: 'deletedialogFn', // 触发父组件
                        permission: '角色管理删除', // 后期这个操作的权限，用来控制权限
                    },
                    {
                        label: '权限设置', // 操作名称
                        emitType: 'toPermissionSettingFn', // 触发父组件
                        permission: '权限设置', // 后期这个操作的权限，用来控制权限
                    },
                ]
            }
        },
        warehouseOptions: [], // 仓库名称下拉数据
        clickId:'',
        pagination:{
            total:0,
            row:10
        }
    }
  },
  created(){
      this.search();
      this.getWareHouseList();
  },
  deactivated(){
    this.deleteRolesBox = false
    this.addRoleShow = false
  },
  methods:{
    addRoleShowFn(){  //添加角色弹窗
        this.addRoleShow=true;
        this.RoleShowTitle='新增角色';
        this.clickId='';
        this.addRole={    //新增角色表单
            roleName:'',
            attributionWarehouse:[]
        },    
        this.$refs.addRoleRef && this.$refs.addRoleRef.resetFields();        
    },
    addRoleFn(addRoleRef){  //添加角色确定
        let addRole = this.addRole;
        let params = {
            roleName:addRole.roleName,
            warehouseName:[],
            warehouseCode:[]
        };
        addRole.attributionWarehouse.forEach(element => {
            let item = element.split(',');
            params.warehouseName.push(item[1])
            params.warehouseCode.push(item[0])
        });
        params.warehouseName = params.warehouseName.join(',');
        params.warehouseCode = params.warehouseCode.join(',');
        this.$refs[addRoleRef].validate((valid)=>{ 
            if(valid){
                if(this.clickId != ''){
                    params.id = this.clickId;
                    this.$api.UserManage.UpdateRole(params).then(res=>{
                        if(res.errorCode === '100200'){
                            this.search()
                            this.addRoleShow=false
                        }else{
                            this.$utils.commonUtils.tip(res.msg,'error')
                        }
                    })
                }else{
                    this.$api.UserManage.addRole(params).then(res=>{
                        if(res.errorCode === '100200'){
                            this.search()
                            this.addRoleShow=false
                        }else{
                            this.$utils.commonUtils.tip(res.msg,'error')
                        }
                    })
                }
            }
        })
    },
    search(){ //获取表格数据
        let params={
            "page":this.page,
            "row":this.pagination.row,
            "roleName":"",
            "warehouseName":"",
            "createBy":"",
            "createTime":this.startTime,
            "lastUpdateTime":this.endTime
        };
        if (this.selectValue == 1){
            params.roleName=this.inputContent
            params.createBy=''
            params.warehouseName=''
        }else if(this.selectValue == 2){
            params.roleName=''
            params.createBy=this.inputContent
            params.warehouseName=''
        }
        else if(this.selectValue == 3){
            params.roleName=''
            params.createBy=''
            params.warehouseName=this.inputContent
        }
        this.$set(this.dataSource,'loading',true)
        this.$api.UserManage.getUserList(params).then(res=>{
            if(res.errorCode === '100200'){
                
                let tableData = res.data.pageInfo.list;
                tableData.warehouseName = [];
                tableData.forEach(item=>{
                    item.warehouseName=[];
                    item.warehouseList.forEach(wareItem=>{
                        item.warehouseName.push(wareItem.warehouseName)
                    })
                    item.warehouseName = item.warehouseName.join('、')
                })
                this.dataSource.data = tableData;
                this.pagination.total = res.data.pageInfo.total;
            }else{
                this.$utils.commonUtils.tip(res.msg,'error')
            }
            this.$set(this.dataSource,'loading',false)
        })
    },
    seachTimeFn(val){   //根据时间获取内容
        if(this.timeValue != null){
            this.page = 1
            this.startTime = this.timeValue[0]
            this.endTime = this.timeValue[1]
        }else{
            Object.assign(this.$data, this.$options.data())
        }
        this.search()
    },
    modifyRoleFn(index,rowData){    //编辑角色弹窗控制
        this.$refs.addRoleRef && this.$refs.addRoleRef.resetFields()
        this.RoleShowTitle ='编辑角色';
        this.addRoleShow = true;
        this.clickId = rowData.id;
        this.addRole.roleName = rowData.roleName;
        let warehouseList = rowData.warehouseList;
        this.addRole.attributionWarehouse = [];
        warehouseList.forEach(item=>{
            if(item.warehouseCode !=''){
                this.addRole.attributionWarehouse.push(item.warehouseCode+','+item.warehouseName)
            }
        })
    },
    deletedialogFn(index,rowData){       //删除角色按钮弹窗
        this.deleteRolesBox = true;
        this.clickId = rowData.id;
    },
    deleteRoleFn(){         //确定删除角色
        let params = this.clickId;
        this.pagination.total
        this.pagination.row
        let {total,row} = this.pagination;
        let pageNum = (total-1)/row;
        if(!this.ifFloat(pageNum)){
            this.page = this.page-1
        }
        this.$api.UserManage.deleteRole(params).then(res=>{
            if(res.errorCode === '100200'){
                this.search();
                this.$utils.commonUtils.tip('删除成功','success')
            }else{
              this.$utils.commonUtils.tip(res.msg,'error')
            }
        })
        this.deleteRolesBox = false;
    },
    ifFloat(n){ //判断是否为浮点型
        return ~~n !==n;
    },
    toPermissionSettingFn(index,rowData){    //跳转到权限设置页面
        this.$router.push({path:'/UserManage/PermissionSettings',query:{id:rowData.id}})
    },
    // 获取仓库下拉框数据
    getWareHouseList() {
        this.$api.Warehousing.getWareHouseList().then(res => {
            if(res.errorCode === '100200'){
                this.warehouseOptions = res.data
            }else{
                this.$utils.commonUtils.tip(res.msg,'error')
            }
        }).catch(error => {

        });
    },
    handleSizeChange(val) {         //调整条数
        this.pagination.row = val;
        this.search();
    },
    handleCurrentChange(val) {       //分页
        this.page = val;
        this.search();
    },
    resetFn(){
        Object.assign(this.$data, this.$options.data());
        this.search();
    },
  }
}
</script>

<style lang='scss' scoped>
.roleManageBox{
    .ceatTimeSpan{
        border: 1px solid #DCDFE6;
        border-right: none;
        float: left;
        border-radius: 4px 0 0 4px;
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        display: inline-block;
    }
    .el-date-editor--datetimerange{
        border-left: none;
        border-radius: 0 4px 4px 0;
    }
.modifyPwdBox{
        text-align: center;
        .text{}
        .dialog-footer{button{display: inline-block;}}
        .iconyichangp{
            i.iconyichang{
                font-size: 80px !important;
                color: #FFBB43;
                border: 6px solid #F9DFB9;
                border-radius: 50%;
            }
        }
    }
.table-operation{
        display: flex;
        justify-content: space-between;
        .title{
            // font-size: 12px;
            color: #333333;
            font-weight: bold;
        }
        .operation{display: flex;
            div{margin-right: 30px;
            cursor: pointer;
                i{
                    color: #2A8BFF;
                    margin-right: 2px;
                }
                span{
                    color: #2A8BFF;
                    letter-spacing: 0;
                }
            }
        }
    }  




}</style>
