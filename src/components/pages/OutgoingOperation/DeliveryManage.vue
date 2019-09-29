/*
 * @Author: 周建强 
 * @Date: 2019-06-02 18:00:07 
 * @Last Modified time: 2019-06-04 11:22:56
 */
<template>
    <div class="container">
       <div class="header-container">
           <V-Title title="发货管理">
                <!-- <div class="title-bar-icon" @click="dialogVisible=true"><i class="iconfont iconcanshupeizhi"></i>&nbsp;参数配置</div> -->
                <div class="search-content">
                    <el-input
                        @clear="deliveryOrderList(true)"
                        clearable placeholder="请输入查询内容"
                        v-model.trim="form.inputValue"
                        @keyup.enter.native="$event.target.select(); deliveryOrderList(true);"
                        class="input-with-select">
                        <el-select
                            v-model="form.selectValue"
                            placeholder="请选择"
                            class="iconfont icon-xiala selectShelf"
                            slot="prepend"
                        >
                            <el-option label="发货单号" value="deliveryOrderNum"></el-option>
                            <el-option label="创建人" value="createUserName"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="deliveryOrderList(true)"></el-button>
                    </el-input>
                </div>
            </V-Title>
           <div class="condition">
                <el-date-picker
                    class="dataTime"
                    v-model="form.dateTimeRange"
                    type="datetimerange"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="deliveryOrderList()"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间">
                </el-date-picker> 
                <el-select filterable clearable v-model="form.warehouseCode" placeholder="选择仓库" @change="deliveryOrderList()">
                    <el-option
                        v-for="item in warehouseList"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item.dataCode">
                    </el-option>
                </el-select>
                <el-select clearable v-model="form.orderType" placeholder="选择订单类型" @change="deliveryOrderList()">
                    <el-option
                        v-for="item in MaBiaoObj.orderTypeList"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item.dataCode">
                    </el-option>
                </el-select>
                <el-select clearable v-model="form.sendStatus" placeholder="选择发货单状态" @change="deliveryOrderList()">
                    <el-option
                        v-for="item in MaBiaoObj.sendStatusList"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item.dataCode">
                    </el-option>
                </el-select>
                <el-select clearable filterable v-model="form.receiver" placeholder="选择揽收商" @change="deliveryOrderList()">
                    <el-option
                        v-for="item in collectorList"
                        :label="item.collectorName"
                        :value="item.collectorName"
                        :key="item.collectorCode">
                    </el-option>
                </el-select>
                <el-button type="text" @click='handleReset'>重置</el-button>
           </div>
       </div>
       <div class="table-container">
           <div class="table-operation">
               <div class="title">发货单列表</div>
               <div class="operation">
                   <div @click="returnShow=true" v-if="false">
                       <i class="iconfont icondayinji"></i>
                       <span>交接清单打印</span>
                   </div>
                   <el-button @click="deliveryOver" type="text" :disabled="!multipleSelection.length">
                       <i class="iconfont icondaoru"></i>
                       <span>结单</span>
                   </el-button>
               </div>
           </div>

           <!-- 引入表格公共组件 START -->
          <V-Table 
             :dataSource = "dataSource"
             @selection-change = "handleSelectionChange"
             @sort-change="handleSort"
             @review = "handleReview"
          >
            <!-- slot 自定义列的情况 -->
            <template slot-scope="scopes" slot="zip">
                 <el-input clearable  type="text" placeholder="输入备注" v-model="scopes.scope.row.info" maxlength="20" show-word-limit>
                </el-input>
            </template>
            <template slot-scope="scopes" slot="warehouseName">
                {{ filterWarehouseName(scopes.scope.row.warehouseCode, scopes.scope.row.warehouseName) }}
                <!-- {{ scopes.scope.row.warehouseName || warehouseList.find(item => item.dataCode === (scopes.scope.row.warehouseCode) || {}).dataName || '' }} -->
            </template>
          </V-Table>
           <!-- 引入表格公共组件 END -->
             <div class="block">
                <el-pagination
                    class="pt-20 pb-20"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="deliveryOrderList()"
                    @size-change="deliveryOrderList()"
                    :page-sizes="pageSizes"
                    :current-page.sync="pageNum"
                    :page-size.sync="pageSize"
                    :total="total">
                </el-pagination>
            </div>
       </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { DeliveryCols } from './cols'
    import { query } from '@/config'
    export default {
        name: 'OutgoingOperation_PickingManage',
        data() {
            return {
                form: {
                    warehouseCode: '', // 仓库
                    orderType: '', // 订单类型
                    sendStatus: '', // 发货单状态
                    inputValue: '', // 右上角
                    selectValue: 'deliveryOrderNum', // 右上角
                    dateTimeRange: '', // 日期时间选择器
                    receiver: '' // 揽收商
                },
                order: '',  //运单号
                selectValue: '', // 下拉框选中的值
                returnShow: false, // 销退弹窗
                collectorList: [], // 揽收商列表
                returnForm: {
                    warehouse: '1',
                    returnType: '1',
                    waybillNumber: ''
                }, // 销退表单
                options: [
                    {
                        label: '运单号',
                        value: '1'
                    },  
                ],
                dataSource: {
                   data: [], // 表格数据
                   cols: DeliveryCols, // 表格的列数据
                   selectable: this.selectFunc, // 勾选框禁用方法
                   isSelection: true, // 表格有多选时设置
                   isOperation: true, // 表格有操作列时设置
                   operation: { // 表格有操作列时设置
                       label: '操作', // 列名
                       width: '100', // 根据实际情况给宽度
                       data: [
                           {
                               label: '查看', // 操作名称
                               emitType: 'review', // 触发父组件
                               permission: '发货查看', // 后期这个操作的权限，用来控制权限
                           },
                       ]
                   }
                },
                sortParams: {}, // 排序参数
                multipleSelection: [],
                total: null, // 列表总数，默认设置null和0有区别
                pageNum: 1,
                pageSize: query.limit,
                pageSizes: [
                    query.limit,
                    query.limit * 2,
                    query.limit * 5,
                    query.limit * 10,
                    query.limit * 20
                ],
                rules: {
                    warehouse: [{ required: true, message: '请选择仓库', trigger: 'blur' }],
                    returnType: [{ required: true, message: '请选择退货类型', trigger: 'blur' }],
                    waybillNumber: [{ required: true, message: '请扫描单号', trigger: 'blur' }]
                }
            }
        },
        async created () {
            await Promise.all([
                this.getWareHouse(), // 仓库列表
                this.getSelectCollector(), // 揽收商列表
                this.batchMaTableList('order_type', 'send_status') // 订单类型，发货单状态
            ])
            // 默认B2C订单
            this.form.orderType = (this.MaBiaoObj.orderTypeList.find(item => item.dataName.toLowerCase().indexOf('b2c') > -1) || {}).dataCode || ''
            this.deliveryOrderList()
        },
        computed: {
            startTime (val) {
                if (!this.form.dateTimeRange) return ''
                return this.$utils.commonUtils.format(this.form.dateTimeRange[0], 'YYYY-MM-DD HH:mm:ss')
            },
            endTime () {
                if (!this.form.dateTimeRange) return ''
                return this.$utils.commonUtils.format(this.form.dateTimeRange[1], 'YYYY-MM-DD HH:mm:ss')
            }
        },
        methods: {
            async deliveryOrderList (pageReset) { // 发货单列表
                if (pageReset) {
                    this.pageNum = 1
                }
                let getCustomObjByKes = this.$utils.commonUtils.getCustomObjByKes
                let params = getCustomObjByKes(this.form, [ 'warehouseCode', 'orderType', 'sendStatus-deliveryStatus', 'receiver' ])
                let params2 = getCustomObjByKes(this, [ 'pageNum-page', 'pageSize-row', 'startTime', 'endTime' ])
                let { selectValue, inputValue } = this.form
                const { data = {} } = await this.$api.OutgoingOperation.deliveryOrderList(Object.assign({}, params, params2, this.sortParams, { [selectValue]: inputValue }))
                let { pageInfo = {} } = data
                let { list = [], total = null } = pageInfo
                this.total = total
                this.dataSource.data = list.map(item => {
                    item.weightSum = this.$utils.commonUtils.numDiv(item.weightSum, 1000)
                    return item
                })
            },
            async deliveryOver () { // 结单
                let orderArr = this.multipleSelection.map(item => item.deliveryOrderNum)
                const { errorCode } = await this.$api.OutgoingOperation.deliveryOver(orderArr)
                if (errorCode === '100200') {
                    this.$utils.commonUtils.tip('结单成功', 'success')
                    this.deliveryOrderList()
                }
            },
            async getSelectCollector () { // 获取揽收商列表
                const { data = {} } = await this.$api.LogisticsManage.getSelectCollector({
                page: 1,
                row: 999999
                })
                const { pageInfo = {} } = data
                const { list = [] } = pageInfo
                this.collectorList = list
            },
            selectFunc (row) { // 禁用勾选
                return ~~row.deliveryStatus !== 3
            },
            // 重置
            handleReset (){
                this.form = this.$options.data().form
                this.deliveryOrderList(true)
            },
            // 多选
           handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSort ({ prop, order }) { // 排序变化
                if (prop) { // 没有排序直接获取
                let sort = order === 'descending' ? 'desc' : 'asc' // 降序0，升序1
                this.sortParams = {
                    sortName: prop,
                    sortType: sort
                }
                } else {
                this.sortParams = {}
                }
                this.deliveryOrderList()
            },
           // 查看
           handleReview(index, row) {
               this.$router.push('/OutgoingOperation/DeliveryManageDetails?deliveryOrderNum=' + row.deliveryOrderNum)
           },
           search () {
               this.deliveryOrderList(true)
           },
            filterWarehouseName (code, name) {
                if (name) return name
                let theOne = this.warehouseList.find(item => item.dataCode === code)
                return (theOne || {}).dataName || ''
            }
        },
    }
</script>
