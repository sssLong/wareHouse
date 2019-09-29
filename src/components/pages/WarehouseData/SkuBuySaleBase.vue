/*
* @Author: 李涛
* @describe: 仓库数据/台账/SKU进销存
* @Date: 2019年6月25日11:8:59
*/
<template>
  <div class="container">
    <div class="header-container">
      <V-Title title="SKU进销存">
        <div class="search-content">
          <el-input clearable placeholder="请输入查询内容" v-model.trim="inputContent" class="input-with-select" @keyup.native.enter="search">
            <el-select v-model="selected" slot="prepend" placeholder="请选择" class="iconfont icon-xiala selectShelf selectScan">
              <el-option v-for="item in selectArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </V-Title>
      <div class="condition">
        <el-date-picker class="dataTime" v-model="timeArr" type="datetimerange" :clearable="false" style="min-width: 300px"
                        popper-class="clear-btn"
                        start-placeholder="开始时间" end-placeholder="结束时间" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00','23:59:59']">
        </el-date-picker>
        <el-select v-model="dataForm.warehouseCode" placeholder="选择仓库" style="min-width: 150px">
          <el-option v-for="item in warehouseList" :key="item.dataCode" :label="item.dataName" :value="item.dataCode"></el-option>
        </el-select>
        <el-select v-model="dataForm.customer" placeholder="选择客户" clearable style="min-width: 150px">
          <el-option v-for="item in customerList" :key="item.dataCode" :label="item.dataName" :value="item.dataCode"></el-option>
        </el-select>
        <el-input class="mr-10 select-input" v-model="categoryNames" placeholder="选择品类" readonly @click.native="selectDialog = true" />
        <el-button type="primary" @click="search">查询</el-button>
        <span class="reset" @click="reset">重置</span>
      </div>

      <div class="table-container">
        <div class="table-operation">
          <div class="title">统计列表</div>
          <div class="operation">
            <div style="color: #2A8BFF; cursor: pointer;" v-if="btnPermission('导出Excel')" @click="tableExport">
              <i class="iconfont icondaochuexcel"></i>
              <span>导出Excel</span>
            </div>
          </div>
        </div>
        <V-Table :dataSource="dataSource">
          <template slot-scope="scopes" slot="startTime">
            {{Array.isArray(timeArr) ? getFormatDate(timeArr[0]) : ''}}
          </template>
          <template slot-scope="scopes" slot="endTime">
            {{Array.isArray(timeArr) ? getFormatDate(timeArr[1]) : ''}}
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
    </div>

    <!--选择品类弹窗-->
    <el-dialog title="选择分类" :visible.sync="selectDialog" width="480px" class="addDataBox">
      <div class="content">
        <el-tree v-if="treeShow" ref="tree" :data="treeData" :props="defaultProps" show-checkbox>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectDialog = false">取 消</el-button>
        <el-button type="primary" @click="selectedSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import moment from 'moment';
  import { SkuBuySaleBase } from './cols'
  import mixinTableModule from '@/mixin/table-module'
  export default {
    name: "WarehouseData_SkuBuySaleBase",
    mixins: [mixinTableModule],
    data() {
      return {
        mixinTableModuleOptions: {
          activatedIsNeed: false,
          getDataListURL: 'center/skuInventoryDeta/list',
          getDataListIsPage: true
        },
        inputContent: '',
        selected: 'productSku',
        customerList: [],
        selectArr: [{
          label: 'SKU',
          value: 'productSku'
        }, {
          label: '产品名称',
          value: 'productSkuName'
        }, {
          label: 'SPU',
          value: 'productSpu'
        }],
        timeArr: [moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')],
        categoryNames: '',
        // 选择品类弹窗状态
        selectDialog: false,
        treeProps: {
          label: 'dataName',
          children: 'children',
          isLeaf: 'isLeaf'
        },
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        dataForm: {
          warehouseCode: '',
          customer: '',
          categoryIds: []
        },
        dataSource: {
          data: [],
          cols: SkuBuySaleBase,
          isIndex: true
        },
        maList: ['goodsOwner'],
        treeShow: true
      }
    },
    created() {
      // 获取仓库
      this.getWareHouse().then(() => {
        this.dataForm.warehouseCode = this.warehouseList[0].dataCode ? this.warehouseList[0].dataCode : ''
        // 获取码表
        this.getMoreMaList(this.maList)
      })
      // 获取客户信息
      this.getCustomerKv()
      // 获取品类
      this.getCategoryNode()
    },
    computed: {

    },
    methods: {
      search() {
        this.dataForm.startTime = Array.isArray(this.timeArr) ? this.getFormatDate(this.timeArr[0]) : ''
        this.dataForm.endTime  = Array.isArray(this.timeArr) ? this.getFormatDate(this.timeArr[1]) : ''
        let obj = {productSku: '', productSkuName: '', productSpu: ''}
        obj[this.selected] = this.inputContent
        Object.assign(this.dataForm, obj)
        this.pageNum = 1
        this.getDataList()
      },
      // 重置
      reset() {
        Object.assign(this.dataForm, this.$options.data().dataForm);
        this.inputContent = ''
        this.categoryNames = ''
        this.timeArr = this.$options.data().timeArr
        this.dataForm.warehouseCode = this.warehouseList[0] ? this.warehouseList[0].dataCode : ''
        // 利用v-if的操作来重置el-tree
        this.treeShow = !this.treeShow
        setTimeout(() => {
          this.treeShow = true
        })
      },
      tableExport(){
        let url = '/center/skuInventoryDeta/export'
        this.$utils.commonUtils.export('get',url,{...this.dataForm},'SKU进销存表格','.xls')
      },
      // 获取品类节点
      async getCategoryNode(resolve, params = '', level) {
        let res = await this.$api.WarehouseData.getCategoryNode()
        if (res.errorCode === '100200') {
          this.treeData = this.getTree(res.data, 0)
          console.log(this.treeData)
        } else {
          this.$utils.commonUtils.tip(res.msg, 'error')
        }
      },
      // 转成树
      getTree(data, pid) {
        let result = []
        let temp
        for (let i = 0; i < data.length; i++) {
          if (data[i].pid == pid) {
            temp = this.getTree(data, data[i].id)
            if (temp.length > 0) {
              data[i].children = temp
            }
            result.push(data[i])
          }
        }
        return result
      },
      selectedSubmit() {
        this.dataForm.categoryIds = this.$refs.tree.getCheckedNodes().map(value => value.id)
        this.categoryNames = this.$refs.tree.getCheckedNodes().map(value => value.name).toString()
        this.selectDialog = false
        // this.search()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .select-input {
    width: 126px;
    /deep/ .el-input__inner {
      cursor: pointer;
    }
  }
</style>
