<!-- 策略管理 -->
<template>
  <div class="shelfList">
    <!-- title -->
    <V-Title title="上架策略"></V-Title>
    <!-- 查询条件 -->
    <div class="shelfSeachFrom">
      <!-- 选择仓库select -->
      <el-select v-model="dataForm.warehouse" @change="search" clearable placeholder="选择仓库" class="iconfont icon-xiala shelfSeachSelect" slot="prepend">
        <el-option v-for="item in warehouseList" :key="item.dataCode" :label="item.dataName" :value="item.dataCode"></el-option>
      </el-select>
      <!-- 策略名称 -->
      <el-input v-model="dataForm.strategyName" clearable placeholder="请输入策略名称" style="width: 160px" @keyup.native.enter="search" @clear="search"></el-input>
      <el-button type="primary" size="small" class="ml-15" @click="search" plain>查询</el-button>
      <span class="resetBtn ml-15" @click="reset">重置</span>
    </div>
    <!-- 到货质检列表 -->
    <div class="table-container pl-20 pr-20">
      <!-- 到货质检列表表头 -->
      <div class="title">
        <span class='title-name' style="font-weight: 600">上架策略列表</span>
        <div class="head-handle">
          <button type="button" class="el-button el-button--text" @click="addDialog" v-if="btnPermission('新增')">
            <span class="icon iconfont"></span>
            <span>新增</span>
          </button>
          <!--<button type="button" class="el-button el-button&#45;&#45;text">-->
            <!--<span class="icon iconfont"></span>-->
            <!--<span>启用</span>-->
          <!--</button>-->
          <!--<button type="button" class="el-button el-button&#45;&#45;text">-->
            <!--<span class="icon iconfont"></span>-->
            <!--<span>禁用</span>-->
          <!--</button>-->
        </div>
      </div>

      <!-- 策略管理列表表格 -->
      <V-Table :dataSource="dataSource" @editHandle="editHandle" @delHandle="delHandle">
        <!--适用仓库插槽-->
        <template slot-scope="scopes" slot="warehouse">
          <!--强行将第一行的默认不可修改的默认策略的仓库名改为'所有仓库'-->
          {{scopes.scope.row.id == 1 ? '所有仓库' : returnStr(warehouseList, scopes.scope.row.warehouse)}}
        </template>
        <!--货主插槽-->
        <!--<template slot-scope="scopes" slot="shipper">-->
          <!--{{returnStr(supplierOwner, scopes.scope.row.shipper)}}-->
        <!--</template>-->
        <!--状态插槽-->
        <template slot-scope="scopes" slot="status">
          <el-switch v-model="scopes.scope.row.isDisabled" @change="toggleStrategyStatus(scopes.scope.row)"></el-switch>
        </template>
        <!--操作插槽-->
        <!--强行将第一行的默认不可修改的默认策略的操作列隐藏scopes.scope.row.id !== 1-->
        <template slot-scope="scopes" slot="operation" v-if="scopes.scope.row.id !== 1">
          <el-button
            type="text" size="small"
            v-for="(item,index) in operation.data" :key="item.label"
            @click="item.emitType(scopes.scope.$index, scopes.scope.row, item.label)"
            v-if="permission[index]">
            {{ item.label }}
          </el-button>
        </template>
      </V-Table>

      <!--数据分页-->
      <el-pagination
        class="p-20"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>


    </div>
    <el-dialog title="新增" :visible.sync="addOrUpdateVisible" width="480px" class="addDataBox">
      <div class="content">
        <el-form label-position="right" label-width="130px" ref="ruleForm" :model="addDataForm" :rules="rules">
          <el-form-item label="策略名称" prop="strategyName">
            <el-input clearable style="width:240px;" autocomplete="off" v-model="addDataForm.strategyName" placeholder="请输入策略名称"></el-input>
          </el-form-item>
          <el-form-item label="适用仓库" prop="warehouse">
            <el-select style="width:240px;" v-model="addDataForm.warehouse" placeholder="请选择仓库">
              <el-option v-for="item in warehouseList" :key="item.dataCode" :label="item.dataName" :value="item.dataCode"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="货主名称" prop="shipper">-->
            <!--<el-select style="width:240px;" v-model="addDataForm.shipper" placeholder="请选择货主">-->
              <!--<el-option v-for="item in supplierOwner" :key="item.dataCode" :label="item.dataName" :value="item.dataCode"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="策略规则" prop="strategyRule">
            <el-select style="width:240px;" v-model="addDataForm.strategyRule" placeholder="请选择策略规则">
              <el-option v-if="item.dataCode != 1" v-for="item in MaBiaoObj.strategy_ruleList" :key="item.dataCode" :value="item.dataCode" :label="item.dataName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="comment">
            <el-input clearable style="width:240px;" type="textarea" placeholder="描述" v-model="addDataForm.comment"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDataSubmitFn()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { Tactics } from './cols'
  import mixinTableModule from '@/mixin/table-module'
  export default {
    mixins: [mixinTableModule],
    data() {
      let validate = async (rule, value, callback) => {
        // 选择仓库时先查询该仓库是否已有策略
        let res = await this.$api.Warehousing.getTacticList({pageNum: 1, pageSize: 100000000, warehouse: value})
        if (res.data.pageInfo.list.length > 0) {
          callback(new Error(`该仓库已有策略, 请检查!`))
        } else {
          callback()
        }
      }
      return {
        mixinTableModuleOptions: {
          activatedIsNeed: false,
          getDataListURL: 'inbound/putawayStrategy/putawayStrategyFindAll',
          getDataListIsPage: true,
          getDataListType: 'get'
        },
        // 查询条件
        dataForm: {
          warehouse: '',
          strategyName: ''
        },
        dataSource: {
          data: [],
          cols: Tactics,
          isIndex: true
        },
        operation: {
          label: '操作',
          data: [/*{
            label: '编辑',
            emitType: (index, row) => this.editHandle(index, row),
            permission: '编辑'
          }, */{
            label: '删除',
            emitType: (index, row) => this.delHandle(index, row),
            permission: '删除'
          }]
        },
        // 新增
        addDataForm: {
          strategyName: '',
          strategyRule: '',
          warehouse: '',
          // shipper: '',
          status: '1',
          comment: ''
        },
        // 选择策略名称
        strategyList: [],
        rules: {
          strategyName: [{required:true,message: '请输入策略名称',trigger: 'blur'}],
          warehouse:[
            {required:true,message: '请选择仓库',trigger: 'change'},
            { validator: validate, trigger: 'change' }
          ],
          // shipper: [{required:true,message: '请选择货主',trigger: 'change'}],
          strategyRule: [{required:true,message: '请选择策略规则',trigger: 'change'}]
        },
        maList: ['putaway_strategy_status', 'strategy_rule'],
        // 是否有操作列的权限
        permission: []
      };
    },
    created (){
      this.operation.data.forEach(item => this.permission.push(this.btnPermission(item.permission)))
      this.getWareHouse()
      // this.getSupplierOwner()
      this.getMoreMaList(this.maList)
    },
    methods: {
      // 查询
      search() {
        this.pageNum = 1
        this.getDataList()
      },
      // 重置
      reset() {
        Object.assign(this.dataForm, this.$options.data().dataForm);
        this.search()
      },
      // 查询后的回调函数
      getDataListCallback() {
        let status = this.MaBiaoObj.putaway_strategy_statusList.find((value) => value.dataName == '启用').dataCode
        this.dataSource.data.map((value) => this.$set(value, "isDisabled", value.status == status))
      },
      //新增弹窗
      addDialog() {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs['ruleForm'].resetFields();
        })
      },
      addDataSubmitFn() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.addStrategy()
            this.addOrUpdateVisible = false
          }
        });
      },
      // 新增数据
      async addStrategy() {
        let res = await this.$api.Warehousing.addStrategy(this.addDataForm);
        if (res.errorCode === '100200'){
          this.$message.success("新增成功！");
          this.getDataList();
        } else{
          this.$utils.commonUtils.tip(res.msg,'error')
        }
      },
      // 切换启用状态
      toggleStrategyStatus(row) {
        row.isDisabled = !row.isDisabled
        if(row.id === 1) {
          this.$utils.commonUtils.tip('默认策略禁止切换状态!','error')
          return
        }
        let str1 = row.isDisabled ? '启用' : '禁用'
        let str2 = !row.isDisabled ? '启用' : '禁用'
        this.$confirm(`当前状态为${str1}, 是否确定${str2}上架策略?`, '提示', {
          type: 'warning',
          customClass: 'v-confirm'
        }).then( async () => {
          let params = {
            status: row.isDisabled ? 2 : 1,
            id: row.id
          }
          let res = await this.$api.Warehousing.toggleStrategyStatus(params)
          if (res.errorCode === '100200'){
            this.$message.success(`${str2}成功`);
            this.getDataList();
          } else{
            this.$utils.commonUtils.tip(res.msg,'error')
          }
        })
      },
      // 跳转编辑页
      editHandle(index, row) {
        console.log(index, row)
        this.$utils.commonUtils.tip('内页需求未确认, 禁止跳转!!!','error')
        // this.$router.push({ path: "/TacticsConfig" });
      },
      // 删除策略管理
      delHandle(index, row) {
        this.$confirm(`确定要删除该策略吗?`, '提示', {
          type: 'warning',
          customClass: 'v-confirm'
        }).then( async () => {
          let res = await this.$api.Warehousing.delTacticsItem(row.id)
          if (res.errorCode === '100200'){
            this.$message.success("删除成功！");
            this.getDataList();
          } else{
            this.$utils.commonUtils.tip(res.msg,'error')
          }
        })
      },
      // 格式化内容
      returnStr(arr, rowId, valueId = 'dataCode', name = 'dataName') {
        if (!Array.isArray(arr)) return
        let data = arr.find(value => rowId == value[valueId])
        return data ? data[name] : null
      },

    }
  }
</script>
<style lang='scss' scoped>
  .head-handle {
    float:right;
  }
</style>
