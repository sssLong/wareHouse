<template>
<div class="client-manage-box">
    <V-Title title="客户信息">
        <div class="search-content">
            <el-input clearable @clear='clearableFn' v-model="seachClientTypeInput"  placeholder="请输入查询内容" class="input-with-select">
                <el-select slot="prepend" v-model="seachClientType"  class="iconfont icon-xiala selectShelf selectScan" >
                    <el-option label="客户编码" value="1"></el-option>
                    <el-option label="客户名称" value="2"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="seachClientTypeFn"></el-button>
            </el-input>
        </div>
    </V-Title>
    <div class="mb-30 pl-20 pr-20 mt-20">
      <el-select clearable v-model="seachClientStatus" placeholder="客户状态" @change="clientStatus">
        <el-option  v-for="item in MaBiaoObj.putaway_strategy_statusList"
              :key="item.dataCode" :label="item.dataName" :value="item.dataCode"
            ></el-option>
      </el-select>
    </div>
    <div class="table-container pl-20 pr-20">
        <div class="table-operation mb-10">
            <div class="title">账号列表</div>
            <div class="operation">
                <router-link to="/UserManage/ClientInfoAdd" v-show="btnPermission('客户管理新添')">
                    <i class="iconfont iconchuangjianqiaban"></i>
                    <span>新添客户</span>
                </router-link>
            </div>
        </div>
        <!-- 引入表格公共组件 START -->
        <V-Table
          :dataSource = "dataSource"
          @clientInfoDetailFn='clientInfoDetailFn'
          @modifyroleFn = 'modifyroleFn'
        >
        <template slot-scope="scopes" slot="status">
            {{scopes.scope.row.status === '1' ? '启用' : '停用'}}
        </template>

        </V-Table>
        <div class="block mt-30 mb-30">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchparams.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="searchparams.row"
            layout="total, sizes, prev, pager, next, jumper"
            :total="searchparams.total">
            </el-pagination>
        </div>
    </div>
</div>
</template>

<script>
import { ClientInfoTable } from './cols'
import '../../../assets/css/UserManame/client.scss'
export default {
    name:'UserManage_ClientInfo',
    data () {
    return {
      seachClientStatus:'',   //检索客户状态
      seachClientType:'1', //顶部检索类型
      seachClientTypeInput:'',  //顶部检索内容
      searchparams:{
        page:1,
        row:10,
        total:0,
        customerCode:'',
        customerName:'',
        status:''
      },
      dataSource: {
        data: [], // 表格数据
        cols: ClientInfoTable, // 表格的列数据
        isSelection: false, // 表格有多选时设置
        isOperation: true, // 表格有操作列时设置
        operation: { // 表格有操作列时设置
          label: '操作', // 列名
          width: '100', // 根据实际情况给宽度
          data: [
            {
                label: '查看', // 操作名称
                emitType: 'clientInfoDetailFn', // 触发父组件
                permission: '客户详细信息', // 后期这个操作的权限，用来控制权限
            },
            {
                label: '修改', // 操作名称
                emitType: 'modifyroleFn', // 触发父组件
                permission: '客户管理修改', // 后期这个操作的权限，用来控制权限
            },
          ]
        }
      },
    }
  },
  created(){},
  activated(){
    this.search()
    this.getMoreMaList('putaway_strategy_status')
  },
  methods:{
    search(){
      let params = this.searchparams
      this.$set(this.dataSource,'loading',true)
      this.$api.UserManage.getCustomerList(params).then(res=>{
        if (res.errorCode == '100200'){
          this.dataSource.data = res.data.pageInfo.list
          this.searchparams.total = res.data.pageInfo.total
        }else{
          this.$utils.commonUtils.tip(res.msg,'error')
        }
        this.$set(this.dataSource,'loading',false)
      })
    },
    clientStatus(val){
      this.searchparams.page = 1
      this.searchparams.status = val
      this.search()
    },
    seachClientTypeFn(val){
      if(this.seachClientType == 1){
        this.searchparams.customerCode = this.seachClientTypeInput
      }else{
        this.searchparams.customerName = this.seachClientTypeInput
      }
      this.searchparams.page = 1
      this.search()
    },
    clearableFn(){
      Object.assign(this.$data, this.$options.data())
      this.search()
    },
    modifyroleFn(index,rowData){
      this.$router.push({path:'/UserManage/ClientInfoModify',query:{id:rowData.id}})
    },
    handleSizeChange(val) {         //调整条数
      this.searchparams.row = val;
      this.search()
    },
    handleCurrentChange(val) {       //分页
      this.searchparams.page = val;
      this.search()
    },
    clientInfoDetailFn(index,rowData){
      this.$router.push({path:'/UserManage/ClientInfoDetail',query:{id:rowData.id}})
    },
    formatter () {
      return arguments[2] || '--'
    },
  }
}
</script>