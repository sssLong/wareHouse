<!--
 * @Autor: 廖佳星
 * @LastEditors: 廖佳星
 * @LastEditTime: 2019-06-25 15:53:34
 -->
<template>
    <div>
        <el-container :style="{ height: $store.state.screenHeight + 'px' }">
            <el-header>
                <div class="headerLeft">
                    <i class="iconfont iconlogo"></i>
                    <span class="title">WMS系统平台</span>
                </div>
                <div class="head-loding-cont"></div>
                <div class="headerRight">
                    <div class="icons">
                        <i class="iconfont iconce"></i>
                        <i class="iconfont iconshan"></i>
                        <i class="iconfont iconshezhi"></i>
                    </div>
                    <div class="login">
                        <div class="shuxian"></div>
                        <div class="headImg">
                            <!-- <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565070296525&di=c5b3a571c488be6538e92dee0dcd0066&imgtype=0&src=http%3A%2F%2Fimg1.gtimg.com%2Ffashion%2Fpics%2Fhv1%2F183%2F145%2F2207%2F143547333.jpg"> -->
                            <img src="https://testimg.brandslink.com/wms/2019-08-16/img.png">
                        </div>
                        <el-dropdown>
                            <div class="el-dropdown-link">
                                <span>{{userName}}</span>
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native='changePasswordShowFn()'>修改密码</el-dropdown-item>
                                <el-dropdown-item @click.native='loginOut'>退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </el-header>
            <el-container :style="homepageHeight">
                <el-aside>
                    <!-- 左侧导航菜单 -->
                    <el-menu :default-active="route>2?activeMenu:menuRouterPathFn" class="el-menu-vertical-demo" :default-openeds="openeds" :unique-opened="false" router>
                        <menuDom :menuItems="menuRouterListFn"></menuDom>
                    </el-menu>
                </el-aside>
                <el-main>
                    <div class="nav">
                      <!-- 标签云 -->
                        <div class="tagView">
                            <Tags class="tagComponent"></Tags>
                            <!-- 刷新按钮 -->
                            <div class="refresh el-icon-refresh" @click="refresh"></div>
                            <div class="close el-icon-close" @click="closeAll(true)"></div>
                        </div>
                    </div>
                    <div class="main">
                        <keep-alive :include="cachedViews">
                            <router-view ref="children"/>
                        </keep-alive>
                    </div>    
                </el-main>
            </el-container>
        </el-container>
        <el-dialog title="修改密码" :visible.sync="changePasswordBox" width="480px" >
            <el-form :model="changePasswordData" autocomplete="off" :rules="changePasswordRules" ref="changePasswordRef" label-width="100px" class="return-form">
                <el-form-item label="账号" prop="user">
                    <el-input clearable autocomplete="off" v-model="userAccount" disabled style="width:240px;"></el-input>
                </el-form-item>
                <el-form-item label="原密码" prop="oldPassword">
                    <el-input clearable autocomplete="off" placeholder="请输入原密码" v-model="changePasswordData.oldPassword" style="width:240px;"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="changePassword">
                    <el-input clearable autocomplete="off" type="password" v-model="changePasswordData.changePassword" placeholder="请输入8-16位数字字母组合的新密码" style="width:240px;"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="successPasswrod">
                    <el-input clearable type="password" autocomplete="off" v-model="changePasswordData.successPasswrod" placeholder="请再次输入新密码" style="width:240px;"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changePasswordBox=false">取 消</el-button>
                <el-button type="primary" @click="changepswFn('changePasswordRef')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog 
            title="提示"
            :visible.sync="defword"
            width="422px">
            <p><i class="el-icon-warning mr-10 ml-10" style="color:#ffbb43;font-size:16px"></i>当前登录账号是初始密码，请及时修改密码!</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="defword=false">取 消</el-button>
                <el-button type="primary" @click="changePasswordShowFn()">确 定</el-button>
            </span>
            
        </el-dialog>
    </div>
</template>

<script>
    import { Tags } from '@/components/common'
    import menuDom from 'pages/UserManage/menuDom'
    import {mapActions} from 'vuex'
    import _ from 'lodash'
    export default {
        data() {
            return {
                changePasswordBox:false,    //修改密码弹窗
                changePasswordRules:{ },   
                userName:'',
                userAccount:'',
                changePasswordData:{
                    id:'',
                    oldPassword:'',
                    changePassword:'',
                    successPasswrod:''
                },
                homepageHeight: {
                    height: 0
                },
                breadcrumbList: [],
                routes: [],
                openeds: ["/index"], //默认打开菜单
                menuList: [], // 导航路由列表
                // 前端定义路由
                options2: [
                    {
                        value: '1',
                        label: '设置'
                    }, {
                        value: '2',
                        label: '退出',
                    }
                ],
                loginName: '0',
                screenHeight: document.body.clientHeight,
                defword:false
            }
        },
        computed: {
            menuRouterPathFn() {   
                // 第二级以下菜单栏聚焦取父级path
                var menuPath = ''
                if(this.$route.meta.level > 1) {
                  this.$store.state.permission.permissionList[1].children.forEach(item => {
                    if(this.$route.meta.parentId == item.id) {
                      menuPath = item.path               
                      return
                    }
                  })
                }
                let activeMenu = ( this.$route.meta.level > 1 && menuPath.indexOf('/')>0 ? ('/'+menuPath) : this.$route.path)
                localStorage.setItem('activeMenu',activeMenu)
                this.$store.commit('SET_ACTIVE',activeMenu)
                return activeMenu
            },
            cachedViews() {
              let cachedViews = _.cloneDeep(this.$store.state.tags.cachedViews)
              cachedViews.forEach((item,index)=>{
                 return this.$set(cachedViews,index,item.substring(1).replace('/','_'))
              })
              return cachedViews
            },
            menuRouterListFn() {          
                return (this.$store.state.RoleMenuList ||  JSON.parse(localStorage.getItem('RoleMenuList')))
            },
            activeMenu() {
                return this.$store.state.activeMenu || localStorage.getItem('activeMenu')
            },
            route() {
              return this.$route.meta.level
            }
        },
        components: {
            Tags,menuDom  
        },
        mounted() {
            let that = this;
            let defaultPwd = this.$store.state.defaultPwd;
            this.resizeChange()
            if(defaultPwd == '111111'){
                this.defword = true
            }
            that.screenHeight = document.body.clientHeight
            that.$store.commit('SET_SCREENHEIGHT',that.screenHeight)
            window.addEventListener('resize',()=>{
                 window.screenHeight = document.body.clientHeight
                 that.screenHeight = window.screenHeight
                 that.$store.commit('SET_SCREENHEIGHT',that.screenHeight)
            })
        },
        created() {
            this.changePasswordRulesFn()
        },
         watch: {
            screenHeight (val) {
                // 为了避免频繁触发resize函数使用定时器
                if (!this.timer) {
                // 一旦监听到的screenHeight值改变，就将其重新赋给data里的screenHeight
                this.screenHeight = val
                this.timer = true
                let that = this
                setTimeout(function () {
                    // 打印screenHeight变化的值
                    that.timer = false
                    that.$store.commit('SET_SCREENHEIGHT',that.screenHeight)
                }, 300)
                }
            }
         },
        destroyed(){
            this.defword = false
        },
        methods: {
            ...mapActions({add_Routes: 'add_Routes'}),
            changePasswordShowFn(){       //修改密码弹窗
                this.changePasswordBox = true
            },
            resizeChange () {
                this.homepageHeight.height = `${document.documentElement.clientHeight}` - 48 + 'px';
                this.userName = localStorage.getItem('accountName')
                this.userAccount = localStorage.getItem('userAccount')
            },
            loginOut(){ //退出登录
                this.$store.state.defaultPwd=''
                this.$api.UserManage.loginOut().then(res=>{
                    if(res.errorCode == '100200'){
                        this.closeAll(false);
                        this.$utils.commonUtils.tip(res.msg,'success')
                        let configFormObj = localStorage.getItem('configFormObj')
                        localStorage.clear();
                        if (configFormObj){
                            localStorage.setItem('configFormObj',configFormObj)
                        }
                        this.closeAll();
                        this.$router.push("/Login");
                    }
                })
            },
            changepswFn(changePasswordRef){  //修改密码提交
                let param = this.changePasswordData;
                param.id = localStorage.getItem('accountId');
                this.$refs[changePasswordRef].validate((valid)=>{
                    if(valid){
                        this.$api.UserManage.changeAccountPwd(param).then(res=>{
                            if(res.errorCode == '100200'){
                                this.$utils.commonUtils.tip('修改密码成功','success')
                                this.changePasswordBox = false
                            }
                        })
                    }
                })
            },
            changePasswordRulesFn(){        //修改密码校验
                this.changePasswordRules = {  
                    oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
                    changePassword: [
                        { required: true, message: '请输入新密码', min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur'},
                        { validator:(rule,val,fn)=>{
                                if(/[\u4E00-\u9FA5]/g.test(val)){
                                    fn(new Error('不能输入中文'))
                                }
                                else if(/^[1-9]\d*$|^0$/i.test(val)){
                                    fn(new Error('不能输入纯数字'))
                                }
                                else if(/^[a-zA-Z]+$/.test(val)){
                                    fn(new Error('不能输入纯英文'))
                                }
                                else if(/\s/.test(val)){
                                    fn(new Error('不能输入空格'))
                                }
                               else{
                                    fn()
                                }
                            } 
                        }
                    ],
                    successPasswrod: [
                        { required: true, message: '请输入新密码', trigger: 'blur' ,min: 8, max: 16, message: '长度在 8 到 16 个字符', },
                        {validator:(rule,val,fn)=>{
                            if(/[\u4E00-\u9FA5]/g.test(val)){
                                fn(new Error('不能输入中文'))
                            }
                            else if(/^[1-9]\d*$|^0$/i.test(val)){
                                fn(new Error('不能输入纯数字'))
                            }
                            else if(/^[a-zA-Z]+$/.test(val)){
                                fn(new Error('不能输入纯英文'))
                            }
                            else if(/\s/.test(val)){
                                fn(new Error('不能输入空格'))
                            }
                            else if(val!==this.changePasswordData.changePassword){
                                fn(new Error('两次输入密码不一致'))
                            }else{
                                fn();
                            }
                        }
                    }]
                }
            },
            // 刷新
            refresh() {
                this.$refs.children.search && this.$refs.children.search()
            },
            // 关闭所有标签
            closeAll(type) {
                this.$store.dispatch('delAll')
                this.$store.dispatch('delAllCachedViews')
                if(type){
                    this.$router.push('/')
                    this.$store.dispatch('addView',{
                        meta: {title:"首页"},
                        name: "home",
                        path: "/",
                    })
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
.el-dropdown-menu{z-index: 99999 !important;}
.el-header {
    padding-left: 0px;
    z-index: 999999;
    background: #fff;
    position: relative;
    height: 48px!important;
    line-height: 48px!important;
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    .headerLeft {
        width: 184px;
        padding-left: 16px;
        padding-top: 8px;
        background-color: #2A8BFF;
        border-top-right-radius: 20px;
        .iconlogo {
            color: #fff;
            font-size: 27px !important;
        }
        .title {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #FFFFFF;
            letter-spacing: 0;
        }
    }
    .headerRight {
        display: flex;
        .icons {
            .iconfont {
                font-size: 20px!important;
                margin: 0 10px;
                border-radius: 50%;
                cursor: pointer;
            }
            .iconce {
                color: #FFBB43;
                background: #FFF;
                box-shadow:0px 0px 0px 2px #FFBB43 inset;
            }
            .iconshan {
                color: #13CE66;
                background: #FFF;
                box-shadow:0px 0px 0px 2px #13CE66 inset;
            }
            .iconshezhi {
                color: #B5B9C9;;
            }
        }
        .login{
            display: flex;
            .shuxian{
                width: 1px;
                height: 24px;
                margin: 12px 0px;
                background-color: #DCDFE6;
            }
            .headImg{
                margin: 6.5px 20px;
                img{
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    overflow: hidden;
                }
            }
            .el-dropdown-link{
                cursor: pointer;
                color: #B5B9C9;
            }
            .el-icon-arrow-down:before{
                content: "\e790"
            }
        }
        
    }
    
}
.el-aside {
    width: 200px!important;
    background-color:#2A8BFF;
    border-top: solid 20px #2A8BFF;
    z-index: 99999;
    // background: linear-gradient(top, #2A8BFF, #2A8BFF);
}
.tagView{
    z-index: 99999;
}
.el-main {
    display: flex;
    flex-direction: column;
    background: #EEEEEE;
    .nav {
        height: 36px;
        background-color: #fff;
        padding-top: 3px;
        box-shadow: 0 0 4px 0 rgba(0,145,255,0.18) inset;
        position: relative;
        z-index: 99998;
    }
    .main {
        overflow-y: scroll;
        margin: 20px;
        background-color: #fff;
        border-radius: 5px;
        height: 100%;
    }
}
.el-menu-item.is-active .iconwenjianguanbi:before,
.el-submenu.is-opened .el-submenu.is-opened .iconwenjianguanbi:before{
    content:'\e61d'
}

</style>
