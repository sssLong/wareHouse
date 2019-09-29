<template>
<div class="permission-box">
  <V-Title title="权限设置"></V-Title>
  <div class="condition pl-20 pr-20 mt-20 ">
        <div class="titleSearch">
            <el-form :inline="true" :model="titleSearch" class="demo-form-inline">
                <el-form-item label="角色名称">
                    <el-input v-model="titleSearch.roleName" :disabled="true" placeholder="审批人"></el-input>
                </el-form-item>
                <el-form-item label="所属仓库">
                    <p class="attributionWarehouse">{{titleSearch.attributionWarehouse}}</p>
                    <!-- <el-input v-model="titleSearch.attributionWarehouse" :disabled="true" placeholder="审批人"></el-input> -->
                </el-form-item>
            </el-form>
        </div>
        <el-tabs class="el-tabs-permission" v-model="activeName" @tab-click="handleClick" >
            <el-tab-pane label="WMS权限设置" name="WMS"></el-tab-pane>
            <el-tab-pane label="PDA权限设置" name="PDA"></el-tab-pane>
        </el-tabs>
        <div class="treeBox">
            <ul>
                <li>一级菜单</li>
                <li>二级菜单</li>
                <li>功能权限</li>
            </ul>
            <div class="permission-tree-box " :style="{height:treeHeight}">
                <el-tree
                    :data="menuDataList"
                    show-checkbox
                    node-key="id"
                    ref="wmsTree"
                    :default-expanded-keys="defaultexpanded"
                    :default-checked-keys="defaultchecked"
                    getCheckedNodes=true
                    :props="defaultProps">
                </el-tree>
            </div>
            
            <V-BottomBtn :buttonList="buttonList"  @view="getCheckedPermissionFn" ></V-BottomBtn>
            <!-- <div class="mt-40 mb-40 btnBox">
                <router-link to="/UserManage/RolesManage"><el-button type="info">取消</el-button></router-link>
                <el-button type="primary" class="ml-40" @click="getCheckedPermissionFn">确定</el-button>
            </div> -->
        </div>
    </div>
</div>
</template>

<script>
import '../../../assets/css/UserManame/PermissionSetting.scss'
export default {
    name:"UserManage_PermissionSettings",
  data () {
    return {
        roleId:'',      //角色id
        titleSearch:{   //头部角色名称和所属仓库
            roleName:'',
            attributionWarehouse:''
        },
        defaultchecked:[],
        activeName: 'WMS',
        menuDataList:[],        //tree菜单list
        menuDataExpandList:[],  //菜单平铺展开list
        defaultexpanded:[],     //tree需要展开的id
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        buttonList:[
            {
                name:'确定',    //按钮名称
                type:true,    //是否为主按钮-可不传
                emitType:'view'    //方法
            },
        ],
        indexFeaturesList:[],
        treeHeight:''
    }
  },
  activated(){
        Object.assign(this.$data, this.$options.data())
        this.roleId = this.$route.query.id;
        this.search();
  },
  mounted(){
      this.$nextTick(async() =>{
          this.treeHight()
      })
  },
  methods:{
      search(){      //获取初始数据 菜单列表&
        let params;
        this.activeName == 'WMS'? params = 0 : params = 1;
        this.$api.UserManage.getMenuAllTree(params).then(res=>{      //获取菜单列表
            if(res.errorCode == '100200'){
                if(this.activeName == 'WMS'){
                    let indexItem = res.data.find(item=>{
                        return item.name == '首页'
                    })
                    let indexId = indexItem.id
                    let that = this
                    findIndexchildren(indexItem)
                    function findIndexchildren (data){
                        data.disabled = true
                        if(data.children.length != 0){
                            data.children.forEach(childrenItem =>{
                                if(childrenItem.type == 1){
                                    childrenItem.disabled = true
                                    that.indexFeaturesList.push(childrenItem.id)
                                }
                                if(childrenItem.children != null){
                                    findIndexchildren(childrenItem)
                                }
                            })
                        
                        }
                    }
                }
                this.menuDataList = res.data;
            }
        }).then(()=>{
            this.$api.UserManage.getRolePermission(this.roleId,params).then(res=>{  //当前角色所拥有的权限
                if(res.errorCode == '100200'){
                    this.titleSearch = {
                        roleName:res.data.roleName,
                        attributionWarehouse:res.data.warehouseName
                    }
                    this.defaultchecked = [...res.data.menus,...this.indexFeaturesList];     //设置默认选中的菜单
                    // this.defaultchecked =[364];     //设置默认选中的菜单
                    this.getMenuAllIdFn(this.menuDataList)
                    let defaultexpanded = [];
                    res.data.menus.forEach(item=>{      //遍历出 默认展开的层级
                        this.menuDataExpandList.forEach(menuItem=>{
                            if(menuItem.id == item){
                                defaultexpanded.push(menuItem.id);
                            }
                        })
                    })
                    this.defaultexpanded= defaultexpanded;
                }else{
                    this.$utils.commonUtils.tip(res.msg,'error')
                }
            })
        })
    },
    toBack(){
        this.$router.push('/UserManage/RolesManage')
    },
    getMenuAllIdFn(data){       //设置默认选中的菜单
        data.forEach(menuItem=>{
            let menuDataDict = {};
            menuDataDict.id = menuItem.id;
            menuDataDict.name = menuItem.name;
            if(menuItem.children != null && menuItem.children.length != 0){
                this.getMenuAllIdFn(menuItem.children)
            }
            
            this.menuDataExpandList.push(menuDataDict);
        })
    },
    getCheckedPermissionFn() {
        let type = ''
        this.activeName == 'WMS'?  type = 0 : type = 1;
        let menuIds = this.$refs.wmsTree.getCheckedKeys().concat(this.$refs.wmsTree.getHalfCheckedKeys())
        let params = {
            id:this.roleId,
            menuIds:[...menuIds,...this.indexFeaturesList].join(','),
            flag:type
        }
        this.$api.UserManage.addPermission(params).then(res=>{
            if(res.errorCode == '100200'){
                this.$utils.commonUtils.tip(res.msg,'success')
                this.$router.push({path:'/UserManage/RolesManage'});
            }else{
                 this.$utils.commonUtils.tip(res.msg,'error')
            }
        })
        
      },
    handleClick(val){
        this.search()
    },
    treeHight(){    //设置treeBox高度
        let mainDom = document.getElementsByClassName('main')[0].offsetHeight
        let titleDom = document.getElementsByClassName('titleSearch')[0].offsetHeight+30
        let elTabsDom = document.getElementsByClassName('el-tabs-permission')[0].offsetHeight
        let treeHeight = mainDom-(titleDom+elTabsDom)-130
        this.treeHeight = treeHeight+'px'
    }
  }
}
</script>