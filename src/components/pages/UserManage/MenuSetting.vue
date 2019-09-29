<template>
<div class="menuSetting">
  <V-Title></V-Title>
  <div class="pl-20 pr-20 table-container">
    <div class="mb-10 mt-20">
      <div class="tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="WMS菜单设置" name="wms"></el-tab-pane>
          <el-tab-pane label="PDA菜单设置" name="pda"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="table-operation">
        <div class="title">菜单列表</div>
        <div class="operation">
          <div @click="addMenuShowFn" v-show="btnPermission('菜单设置新增菜单')">
            <i class="iconfont iconchuangjianqiaban"></i>
            <span>新添菜单</span>
          </div>
        </div>
      </div>
    </div>
    <el-table
      class="tree-table"
      :data="tableData"
      row-key="id"
      :height="height"
      border
      :tree-props="{children: 'children'}">
      <el-table-column prop="name" :formatter="formatter" label="菜单名称"></el-table-column>
      <el-table-column prop="url" :formatter="formatter" label="API链接"></el-table-column>
      <el-table-column prop="type" width="100%" :formatter="formattertype" label="类型"></el-table-column>
      <el-table-column prop="seq" width="100%"  label="排序"></el-table-column>
      <!-- <el-table-column prop="icon" :formatter="formatter" label="菜单图标"></el-table-column> -->
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
        <el-button type="text" size="small" @click="changeMenuFn(scope.row)" v-show="editPermission">编辑</el-button>
        <el-button type="text" size="small" @click="addMenuFn(scope.row.id)" v-show="addPermission">新添</el-button>
        <el-button type="text" size="small" @click="deleteRolesBox=true;clickId = scope.row.id;" v-show="editPermission">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  
  <el-dialog
      :title="addMenuShowTitle"
      :visible.sync="addMenuShow"
      width="480px"
      :closeOnClickModal = 'false'
      class='return-box'
      >
          <el-form :model="addMenuData"  :rules="addmenuRoleRef" ref="addmenuRoleRef"  class="return-form" label-width="100px" >
              <el-form-item label="菜单名称" prop="name">
                  <el-input clearable v-model="addMenuData.name" placeholder="请输入菜单名称"></el-input>
              </el-form-item>
              <el-form-item label="API路径" prop="url">
                  <el-input clearable v-model="addMenuData.url" placeholder="请输入API路径" ></el-input>
              </el-form-item>
              <el-form-item label="序号" prop="seq">
                  <el-input clearable v-model="addMenuData.seq" placeholder="请输入当前目录的序号" ></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                  <el-select v-model="addMenuData.type" placeholder="请选择" >
                      <el-option  :value='0' label='菜单' ></el-option>
                      <el-option  :value='1' label='功能' ></el-option>
                      <el-option  :value='2' label='子页面' ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="菜单图标" prop="icon">
                  <el-input clearable v-model="addMenuData.icon" placeholder="菜单图标" ></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                  <el-input clearable type="textarea" v-model="addMenuData.remark" placeholder="请填写备注" ></el-input>
              </el-form-item>
          </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addMenuShow=false;">取 消</el-button>
        <el-button type="primary" @click="clickaddChildenMenuFn('addmenuRoleRef')">确 定</el-button>
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
            <p class="text mt-30 mb-40">确认删除该菜单吗？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteRolesBox=false;">取 消</el-button>
                <el-button type="primary" @click="deleteRoleFn()">确 定</el-button>
            </span>
        </div>
    </el-dialog>
</div>
</template>

<script>
import utils from '../../../utils/element'
import '../../../assets/css/UserManame/Menusetting.scss'
export default {
  name:'UserManage_MenuSetting',
  data () {
    return {
      deleteRolesBox:false,
      addMenuShowTitle:'新增菜单',
      addMenuShow:false, //控制弹窗
      height: 0, // 表格高度
      addMenuData:{
        name:'',  //菜单名称
        url:'',   //路径
        type:0,    //菜单类型
        icon:'',    //权限代码
        remark:'',   //备注
        seq:''    //序号
      },
      activeName:'wms',
      addmenuRoleRef:{
        name: [{ required: true, message: '菜单名称必填', trigger: 'blur' }],
        type:[{ required: true, message: '菜单类型必填', trigger: 'change' }],
        seq:[{ required: true, message: '菜单序号必填', trigger: 'blur' }]
      },
      tableData:[],
      clickId:'', //操作当前列的id
      editPermission: '',
      addPermission: '',
      deletePermission: '',
    }
  },
  created(){
    this.editPermission = this.btnPermission('菜单设置编辑')
    this.addPermission = this.btnPermission('菜单设置新增')
    this.deletePermission = this.btnPermission('菜单设置删除')
    this.search();

  },
  deactivated(){
    this.addMenuShow = false
    this.deleteRolesBox = false
  },
  mounted(){
    this.$nextTick( async() => {
      this.SettingTableHeightFn()
      let height = await this.$utils.element.setTableHeight()
      this.height = height-10
    })
    
  },
  methods: {
    handleClick(tab, event){
      this.search();
    },
    addMenuShowFn(){  // 控制新建菜单弹窗
      this.addMenuShow=true;
      this.addMenuShowTitle='新增菜单';
      this.clickId = '';
      this.addMenuData = {
        name:'',  //菜单名称
        url:'',   //路径
        type:0,    //菜单类型
        icon:'',    //权限代码
        remark:'',   //备注
        seq:''    //序号
      }
    },
    search(){  //获取菜单表格数据
      let params
      this.activeName == 'wms'? params = 0 : params = 1;
      this.$api.UserManage.getMenuAllTree(params).then(res=>{
        if(res.errorCode == '100200'){
          this.tableData = res.data;
        }
      })
    },
    changeMenuFn(rowData){ //编辑菜单
      this.addMenuShow=true;
      this.addMenuShowTitle='编辑菜单';
      this.clickId = rowData.id;
      this.addMenuData = {
        icon:rowData.icon,
        name:rowData.name,
        url:rowData.url,
        type:rowData.type,
        remark:rowData.remark,
        seq:rowData.seq
      }
    },
    deleteRoleFn(){ //删除菜单
      let clickrowId = this.clickId;
      this.$api.UserManage.deleteMenu(clickrowId).then(res=>{
        if(res.errorCode == '100200'){
          this.$utils.commonUtils.tip(res.msg,'success')
          this.search();
          this.deleteRolesBox = false;
        }else{
          this.$utils.commonUtils.tip(res.msg,'error')
        }
      })
    },
    clickaddChildenMenuFn(formName){    //新增菜单点击确定事件
      let addMenuData = this.addMenuData;
      let clickrowId = this.clickId;
      this.activeName == 'wms'? addMenuData.belong = 0 : addMenuData.belong = 1;

      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(clickrowId != ''){
              if(this.addMenuShowTitle =='新增菜单'){
                this.$api.UserManage.addChildenMenu(addMenuData,clickrowId).then(res=>{
                  if(res.errorCode == '100200'){
                    this.$utils.commonUtils.tip(res.msg,'success')
                    this.search();
                    this.addMenuShow = false;
                  }else{
                    this.$utils.commonUtils.tip(res.msg,'error')
                  }
                })
              }else if(this.addMenuShowTitle =='编辑菜单'){
                this.$api.UserManage.changeMenu(addMenuData,clickrowId).then(res=>{
                  if(res.errorCode == '100200'){
                    this.$utils.commonUtils.tip(res.msg,'success')
                    this.search();
                    this.addMenuShow = false;
                  }else{
                    this.$utils.commonUtils.tip(res.msg,'error')
                  }
                })
              }
            }
            else{
              this.$api.UserManage.addMenu(addMenuData).then(res=>{
                  if(res.errorCode == '100200'){
                    this.$utils.commonUtils.tip(res.msg,'success')
                    this.search();
                    this.addMenuShow = false;
                  }else{
                    this.$utils.commonUtils.tip(res.msg,'error')
                  }
              })
            }
          } else {
            return false;
          }
        });
    },
    addMenuFn(clickId){
      this.addMenuShow=true;
      this.addMenuShowTitle='新增菜单';
      this.clickId = clickId;
      this.removeFromData()
    },
    formatter () {
      return arguments[2] || '--'
    },
    formattertype(){
      let typeName = '';
      switch (arguments[2]){
        case 0: typeName = '菜单' 
        break;
        case 1: typeName = '功能' 
        break;
        case 2: typeName = '子页面' 
        break;
      }
      return typeName
    },
    configSet (value) {
      console.log(value)
    },
    removeFromData(){   //清空表单内容
      this.addMenuData = {
        name:'',  
        url:'',   
        type:0,    
        authorityCode:'',    
        remark:''  
      }
    },
    SettingTableHeightFn(){   //设置表格高度
      let mainDom = document.getElementsByClassName('main')[0]
      let tableDom = document.getElementsByClassName('table-container')[0]
      console.log('tableDom: ', tableDom);
      let elTableDom= document.getElementsByClassName('el-table')[0].parentElement
      let elTableDomMarginTop = utils._getMarginTop(tableDom,'marginTop') + utils._getMarginTop(tableDom,'marginBottom') + utils._getMarginTop(tableDom,'paddingTop') + utils._getMarginTop(tableDom,'paddingBottom')
      let arr =  utils._siblings(tableDom)
      let elArr =  utils._siblings(elTableDom)
      console.log('elArr: ', elArr);
      let outSum =  utils._getSum(arr)
      let innerSum =  utils._getSum(elArr)
      this.height = mainDom.offsetHeight-outSum-innerSum-elTableDomMarginTop
      document.getElementsByClassName('el-table__empty-block')[0].style.height = this.height + 'px' // 设置"暂无数据"的高度
    },
  }
}
</script>