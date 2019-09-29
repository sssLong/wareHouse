<template>
<div class="AccountsManageBox">
    <V-Title>
        <div class="search-content">
            <el-input clearable placeholder="请输入查询内容"  v-model="inputContent" class="input-with-select" @clear='clear' @keyup.native.enter="params.page=1;seachInputFn()">
                <el-select v-model="selectType" slot="prepend" placeholder="请选择" class="iconfont icon-xiala selectShelf selectScan" >
                    <el-option label="物流商简称" value="1"></el-option>
                    <el-option label="物流商编码" value="2"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="seachInputFn()"></el-button>
            </el-input>
        </div>
    </V-Title>
    <div class="table-container pl-20 pr-20 mt-20">
        <div class="table-operation mb-10">
            <div class="title">物流商列表</div>
            <div class="operation">
                <div @click="addUserShowFn()" v-show="btnPermission('新添物流商')">
                    <i class="iconfont iconchuangjianqiaban"></i>
                    <span>新添物流商</span>
                </div>
            </div>
        </div>
        <!-- 引入表格公共组件 START -->
        <V-Table 
            :dataSource = "dataSource"
            @gotoDetail = 'gotoDetail'
            @modifylogistics = 'modifylogistics'
        >
        <!-- slot 自定义列的情况 -->
        <template slot-scope="scopes" slot="logisticsType">
            <div v-if="scopes.scope.row.logisticsType == '1'">API对接物流商</div>
            <div v-else>无对接物流商</div>
        </template>
        <template slot-scope="scopes" slot="isValid">
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
        <div class="block mt-30 mb-30">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="params.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="params.row"
            layout="total, sizes, prev, pager, next, jumper"
            :total="params.total">
            </el-pagination>
        </div>
    </div>
</div>
</template>

<script>
import { LogisticsManManage } from './cols'
export default {
    name:'LogisticsManage_LogisticsManManage',
    data () {
    return {
        inputContent:'',
        selectType:'1',
        dialogVisible:false,    //启用禁用弹窗
        dataSource: {
            data: [], // 表格数据
            cols: LogisticsManManage, // 表格的列数据
            isSelection: false, // 表格有多选时设置
            isOperation: true, // 表格有操作列时设置
            operation: { // 表格有操作列时设置
                label: '操作', // 列名
                width: '120', // 根据实际情况给宽度
                data: [
                    {
                        label: '查看', // 操作名称
                        emitType: 'gotoDetail', // 触发父组件
                        permission: '物流商详情查看', // 后期这个操作的权限，用来控制权限
                    },
                ]
            }
        },
        params:{
            page:1,
            row:10,
            total:0
        },
        isValidparams:{}
    }
  },
  activated(){
      this.search();
  },
  methods:{
    search(){
        let params = this.params
        this.$set(this.dataSource,'loading',true)
        this.$api.LogisticsManage.getLogisticsList(params).then(res=>{
            if(res.errorCode == '100200'){
                res.data.pageInfo.list.forEach(item=>{
                    item.isValid == 2 ? item.isValid = false:item.isValid = true
                })
                this.params.total = res.data.pageInfo.total
                this.dataSource.data = res.data.pageInfo.list
            }else{
                this.$utils.commonUtils.tip(res.msg,'error')
            }
            this.$set(this.dataSource,'loading',false)
            
        })
    },
    seachInputFn(){     //头部检索
        if(this.selectType == 1){
            this.params.logisticsCode = ''
            this.params.logisticsShortened = this.inputContent
        }else{
            this.params.logisticsShortened = ''
            this.params.logisticsCode = this.inputContent
        }
        this.params.row=10
        this.params.page=1
        this.search()
    },
    clear(){
        this.params = {
            page:1,
            row:10,
            total:0
        }
        this.search()
    },
    handleSizeChange(val){  //每页条数
        this.params.row = val
        this.search()
    },
    handleCurrentChange(val){  //翻页
        this.params.page = val
        this.search()
    },
    isValidFn(params){
        this.$api.LogisticsManage.addlogisticsData(params).then(res=>{
            if(res.errorCode == '100200'){
                this.search()
                this.$utils.commonUtils.tip(res.msg,'success')
            }
        })
    },
    isEnableSwitchFn(rowData){  //物流商启用停用 
        let str1 = !rowData.isValid ? '启用' : '禁用'
        let str2 = rowData.isValid ? '启用' : '禁用'
        this.$confirm(`当前状态为${str1}, 是否确定${str2}该平台信息状态?`, '提示', {
          type: 'warning',
          customClass: 'v-confirm'
        }).then( async () => {
            let isValidparams={
                "address": rowData.address,
                "city": rowData.city,
                "country": rowData.country,
                "createBy": rowData.createBy,
                "customerCode":rowData.customerCode,
                "id": rowData.id,
                "isValid": rowData.isValid? 1 : 2,
                "logisticsCode":rowData.logisticsCode,
                "logisticsFullName": rowData.logisticsFullName,
                "logisticsShortened": rowData.logisticsShortened,
                "logisticsType": rowData.logisticsType,
                "state": rowData.state,
                "token": rowData.token,
            }
            this.isValidFn(isValidparams)
        }).catch(action => {
            rowData.isValid == true ? rowData.isValid = false : rowData.isValid = true
        });
    },    
    addUserShowFn(){ //跳转添加物流商
        this.$router.push({path:'/LogisticsManage/LogisticsManManageDetail',query:{type:1}})
    },
    gotoDetail(index,rowData){  //跳转详情查看
         this.$router.push({path:'/LogisticsManage/LogisticsManManageDetail',query:{id:rowData.id,type:2}})
    },
    modifylogistics(index,rowData){
        this.$router.push({path:'/LogisticsManage/LogisticsManManageDetail',query:{id:rowData.id,type:3}})
    },
  }
}
</script>
<style lang="scss" scoped>
.AccountsManageBox{
    .return-form{
        .returnFormAddBtn{
            position: absolute;
            color: #2A8BFF;
            top: 16px;
            right: 47px;
            cursor: pointer;
            z-index: 2;
        }
        .returnFormDeleteBtn{
            position: absolute;
            color: #2A8BFF;
            top: 7px;
            right: 89px;
            cursor: pointer;
            z-index: 2;
        }
        .el-cascader{
            display: block;
            line-height: 31px;
        }
        .el-input,.el-select,.el-cascader{
            width: 280px !important;
        }
    }

    .relative{
    position: relative;
    }
    .modifyRoleBox{
        position: relative;
        .addbtn{
            position: absolute;
            color: #2A8BFF;
            top: 14px;
            right:47px;
            cursor: pointer;
            z-index: 2;
        }
        .deleteBtn{
             position: absolute;
            color: #2A8BFF;
            top: 5px;
            right:100px;
            cursor: pointer;
            z-index: 2;
        }
    }
    .modifyPwdBox{
        text-align: center;
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
}

</style>
