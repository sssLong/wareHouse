<!-- 
    使用方式 <ConfigSet :dialogVisible.sync="dialogVisible" @configSet="configSet"></ConfigSet>
    在组件中监听configSet事件，对应的回调函数默认的第一个参数是表单数据
 -->
<template>
    <!--  参数配置  -->
    <el-dialog
        title="参数配置"
        :visible.sync="dialogVisible"
        width="480px"
        class='config-set'
        :show-close='true'
        :before-close="handleClose"
        :close-on-click-modal="false"
        >
        <el-form :model="configForm" ref="configForm" label-width="100px" class="box-form">
            <el-form-item label="仓库" prop="wareHouse" :rules="{required: true, message: '您还没选择仓库', trigger: 'change'}">
                <el-select v-model="configForm.wareHouse" placeholder="请选择仓库" value-key='dataCode' @change='wareHouseChange'>
                    <el-option
                        v-for="item in warehouseList"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="`${type}`" ref="delivery" prop="delivery" :rules="{required: true, message: `您还没选择${type}`, trigger: 'change'}">
                <el-select v-model="configForm.delivery" :placeholder="`请选择${type}`"  value-key='dataCode' :disabled="configForm.wareHouse==''">
                    <el-option
                        v-for="item in qcTableList"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="协同人" v-show="isShowFriend" prop="friend" ref="friendList" class='friend-box'>
                <el-select v-model="configForm.friendList" placeholder="请选择协同人" filterable multiple value-key='id' :disabled="configForm.wareHouse==''" :multiple-limit='2'>
                    <el-option :label="item.name + '-' + item.account" :value="item" v-for='item in userList' :key='item.id'></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <!-- <el-button @click="handleClose">取 消</el-button> -->
            <el-button type="primary" @click="sure">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { getLodop } from './../../plugin/LodopFuncs' 
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            required: true
        },
        isShowFriend: {
            type: Boolean,
            default: true
        }
    },
    data (){
        return {
            configForm: {
                wareHouse: '',
                delivery: '',
                friendList: '',
            },
            configFormClone: {           //克隆一份configForm
                wareHouse: '',
                delivery: '',
                friendList: '',
            },
            userList: [],   //协同人列表
            qcTableList: [],  //质检台列表
            jumpJude: false,
            nowRoute: ''
        }
    },
    computed: {
        tags() {
            return this.$store.state.tags.tagsView
        }
    },
    created (){
        this.nowRoute = this.$route.path.split('/')[2];
        let configFormObj = localStorage.configFormObj;
        if (configFormObj){
            configFormObj = JSON.parse(configFormObj);
            if (configFormObj[localStorage.userAccount] && configFormObj[localStorage.userAccount][this.nowRoute]){
                this.configForm = configFormObj[localStorage.userAccount][this.nowRoute]
            }
        }
        this.getWareHouseByUser();
    },
    methods: {
        getWareHouseByUser (){
            this.$api.Warehousing.getWareHouseByUser().then(res=>{
                if (res.errorCode === '100200'){
                    this.warehouseList = res.data;
                    if (this.configForm.wareHouse != ''){
                        //this.configForm.wareHouse = res.data[0];
                        this.getQcTableList();
                        this.getUserListByWareHouse();
                    }
                }
            })
        },
        getQcTableList (){
            let params = {
               warehouseCode: this.configForm.wareHouse.dataCode
            }
            this.$api.Warehousing.getQcTableList(params).then(res=>{
                if (res.errorCode === '100200'){
                    this.qcTableList = res.data;
                }
            })
        },
        getUserListByWareHouse (){
            let params = {
               warehouseCode: this.configForm.wareHouse.dataCode
            }
            this.$api.Warehousing.getUserListByWareHouse(params).then(res=>{
                if (res.errorCode === '100200'){
                    this.userList = res.data;
                }
            })
        },
        wareHouseChange (){
            this.configForm.delivery = '';
            this.configForm.friendList = [];
            this.$nextTick(()=>{
                this.$refs['delivery'].clearValidate()
                this.$refs['friendList'].clearValidate()
            })
            this.getQcTableList();
            this.getUserListByWareHouse()
        },
        sure (){
            this.$refs['configForm'].validate((valid) => {
                if (valid) {
                    this.jumpJude = true;
                    this.saveData();
                    this.$emit('configSet',this.configForm,this.userList);
                    this.$emit('update:dialogVisible', false)
                    Object.assign(this.configFormClone,this.configForm)
                } 
            });
        },
        saveData (){
            let configForm = this.configForm;
            let configFormObj = localStorage.configFormObj
            if (!configFormObj){
                configFormObj = {
                    [localStorage.userAccount]: {
                        [this.nowRoute]:configForm
                    }
                }
            } else{
                configFormObj = JSON.parse(configFormObj);
                if (configFormObj[localStorage.userAccount]){
                    configFormObj[localStorage.userAccount][this.nowRoute] = configForm
                } else{
                    configFormObj[localStorage.userAccount] = {
                        [this.nowRoute]:configForm
                    }
                }               
            }
            localStorage.configFormObj = JSON.stringify(configFormObj)
        },
        jumpTo (){
            if (this.$route.path == '/WarehousingOperation/ScanSignIn'){
                this.deleteTags('/WarehousingOperation/ScanSignIn')
                this.$router.push({path: '/WarehousingOperation/ArrivalNotice'});
            } else if (this.$route.path == '/WarehousingOperation/FoundCard'){
                this.deleteTags('/WarehousingOperation/FoundCard')
                this.$router.push({path: '/WarehousingOperation/ArrivalNotice'})
            } else if (this.$route.path == '/WarehousingOperation/ArrivalCheck'){
                this.deleteTags('/WarehousingOperation/ArrivalCheck')
                this.$router.push({path: '/'})
            } else if (this.$route.path == '/WarehousingOperation/ReturnCheck'){
                this.deleteTags('/WarehousingOperation/ReturnCheck')
                this.$router.push({path: '/WarehousingOperation/ReturnReceipt'})
            }
        },
        handleClose (){
            this.$emit('update:dialogVisible', false);
            if (!this.jumpJude){ 
                this.jumpTo();
            } else{
                Object.assign(this.configForm,this.configFormClone)
                this.getQcTableList();
                this.getUserListByWareHouse()
            }
        },
        deleteTags (target){
            let index = this.findIndex(target)
            this.$store.dispatch('delTagsView',target).then( newTags => {
                index==newTags.length-1?index=index:index=index-1
                let lastestTag = newTags[index]
            })
            this.$store.dispatch('delCachedView',target)
        },
        findIndex(target) {
            let i ;
            this.$store.state.tags.tagsView.forEach( (v,index) => {
                if(v.path == target) {
                    i = index
                }
            })
            return i
        },
    }
}
</script>
<style scoped>
.friend-box {
    position: relative;
}
.match-freind {
    position: absolute;
    border: 1px solid #999;
    top: 42px;
    left: 0;
    background: #fff;
    width: 200px;
}
.friend-name {
    margin: 0 15px 0 10px;
}
.add-friend {
    margin-left: 3px;
    color: #999;
    cursor: not-allowed;
}
.active {
    color: #2A8BFF;
    cursor: pointer;
}
.have-friend {
    margin-top: -18px;
}
.have-friend li {
    background: #F1F8FF;
    height: 32px;
    width: 200px;
    line-height: 32px;
    color: #2A8BFF;
    margin-top: 10px;
    text-indent: 15px;
    border-radius: 3px;
}
.iconguanbi1 {
    float: right;
    margin-right: 20px;
}
</style>
