<!-- 登录  页面开发：高友谊 -->
<template>
  <div class="login-container">
    <div class="head-loding-cont"></div>
    <div class="inner-cont">
      <img src="../assets/img/logo.png" class="logo">
      <el-input clearable placeholder="请输入账号" v-model="form.username">
        <i slot="prefix" class="iconfont iconyonghu"></i>
      </el-input>
      <el-input clearable placeholder="请输入密码" type="password" v-model="form.password">
        <i slot="prefix" class="iconfont iconmima"></i>
      </el-input>
      <SliderVerification v-if="sliderTrue" ref="SliderVerification" class="mb-30" ></SliderVerification>
      <el-button type="primary" class="login-btn" :loading="clickloginBtn" @click="login">{{clicklogintext}}</el-button>
    </div>
  </div>
</template>

<script>
import SliderVerification from '@/components/common/SliderVerification'
import '@/assets/css/Login.scss';
import axios from 'axios';
import qs from 'qs'
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      sliderTrue:true,
      form: {
        username: '',
        password: '',
        platformType:'0'
      },
      clickloginBtn:false,
      clicklogintext:'登　　录',
      accountId : ''
    };
  },
  methods: {
    ...mapActions({add_Routes: 'add_Routes'}),
    async login() {
      if(this.$refs.SliderVerification.confirmSuccess){
        if(this.form.username != '' && this.form.password != ''){
          this.clickloginBtn = true
          this.clicklogintext = '加载中...'
          this.$store.state.defaultPwd = this.form.password 
          // if(this.form.password === '111111') this.$store.state.defaultPwd = '111111'
          let Base64 = require('js-base64').Base64
          this.form.password = Base64.encode(this.form.password+'-'+this.form.username)
          let params = { ...this.form, noLoading: true }
          this.$api.UserManage.login(params).then(res=>{
            if(res.errorCode == '100200'){
              this.accountId = res.data.id
              localStorage.setItem("accountName", res.data.name)
              localStorage.setItem("accountId", res.data.id)
              localStorage.setItem("userAccount", res.data.account)
              localStorage.setItem("token", res.data.token)
              localStorage.setItem("platformType", res.data.platformType)
              this.getRoleMenuListTree()
            }else{
              this.clickloginBtn = false
              this.clicklogintext ='登　　录'
              this.sliderTrue = false
              this.$nextTick(() => {
                this.sliderTrue = true
              })
              this.form.password=""
            }
          })
        }else{
          this.$utils.commonUtils.tip('请输入账号密码','error')
        }
      }else{
        this.clickloginBtn = false
        this.clicklogintext = '登　　录'
        this.$message.error({ message: '请先通过验证',duration:1000,showClose: true,})
      }
    },
    getRoleMenuListTree(){
      this.$api.UserManage.getRoleMenuListTree(this.accountId).then(res=>{  //获取当前用户左侧菜单栏列表--不带功能
        if(res.errorCode == '100200'){
            this.$store.state.RoleMenuList = res.data
            localStorage.setItem("RoleMenuList", JSON.stringify(res.data));
            this.getRoleMenuTree()    
        }else{
            this.$message.error({ message: res.msg,duration:1000})
        }
      })
    },
    async getRoleMenuTree(){
      this.$api.UserManage.getRoleMenuTree(this.accountId).then(res=>{   //获取当前用户菜单栏列表--带功能
          if(res.errorCode == '100200'){
              this.$store.state.RoleMenuTree = res.data
              localStorage.setItem("RoleMenuTree", JSON.stringify(res.data))
              this.$router.push("/");
          }else{
              this.$message.error({ message: res.msg,duration:1000})
          }
      })
    }
  },
  
  components:{
    SliderVerification
  }
};
</script>
