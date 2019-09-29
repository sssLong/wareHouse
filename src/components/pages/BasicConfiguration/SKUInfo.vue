<template>
    <div class="container">
       <div class="header-container base-container">
           <V-Title title="SKU信息">
                <el-input
                    clearable
                    @clear="PageNum=1;search()"
                    placeholder="请输入查询内容"
                    v-model.trim="inputValue"
                    @keyup.native.enter="PageNum=1;search()"
                    class="input-select">
                    <el-select v-model="selectType" slot="prepend" placeholder="请选择" @change="PageNum=1;search()">
                        <el-option v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="PageNum=1;search()"></el-button>
               </el-input>
            </V-Title>
       </div>
       <div class="table-container">

           <!-- 引入表格公共组件 START -->
          <V-Table 
             :dataSource="dataSource"
             @sort-change="handleSort"
             @selection-change="handleSelectionChange"
             @review="handleReview"
          >
            <!-- slot 自定义列的情况 -->
            <!-- <template slot-scope="scopes" slot="zip">
                <el-popover
                    placement="right"
                    title=""
                    trigger="hover">
                    <img :src="scopes.scope.row.productPictures" alt="" width="240" height="240">
                    <img slot="reference" :src="scopes.scope.row.productPictures" alt="" width="40" height="40">
                </el-popover>
            </template> -->
            <template slot-scope="scopes" slot="zip">{{scopes.scope.row.packageLength}}/{{scopes.scope.row.packageWidth}}/{{scopes.scope.row.packageHeight}}</template>
            <template slot-scope="scopes" slot="zip1">{{scopes.scope.row.packageLength * scopes.scope.row.packageWidth * scopes.scope.row.packageHeight.toFixed(2)}}</template>

          </V-Table>
           <!-- 引入表格公共组件 END -->
           
             <div class="block">
                <el-pagination
                class="p-20"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="PageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="PageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                ></el-pagination>
            </div>
       </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { SKUCols } from './cols'
    export default {
        name: 'BasicConfiguration_SKUInfo',
        data() {
            return {
                inputValue: '', // 输入框的值
                selectType: '0', // 下拉框选中的值
                options: [
                    {
                        label: 'SKU',
                        value: '0'
                    },
                    {
                        label: '产品名称',
                        value: '1'
                    },
                    {
                        label: '客户名称',
                        value: '2'
                    },
                    {
                        label: '货主',
                        value: '3'
                    }
                ],
                dataSource: {
                   data: [], // 表格数据
                   cols: SKUCols, // 表格的列数据
                   isSelection: false, // 表格有多选时设置
                   isOperation: true, // 表格有操作列时设置
                   operation: { // 表格有操作列时设置
                       label: '操作', // 列名
                       width: '100', // 根据实际情况给宽度
                       data: [
                           {
                               label: '查看', // 操作名称
                               emitType: 'review', // 触发父组件
                               permission: 'SKU详情', // 后期这个操作的权限，用来控制权限
                           }
                       ]
                   }
                },
                
                multipleSelection: [],
                PageNum: 1, //页码
                PageSize: 10, //行数
                total: null, //总页数
                rules: {
                    warehouse: [{ required: true, message: '请选择仓库', trigger: 'blur' }],
                    returnType: [{ required: true, message: '请选择退货类型', trigger: 'blur' }],
                    waybillNumber: [{ required: true, message: '请扫描单号', trigger: 'blur' }]
                },
                sortField: null, // 排序字段
                sortType: null // 排序类型
            }
        },
        methods: {
            // 列表时间排序事件  升序-asc,降序-desc 
            handleSort(colData) {
                // 驼峰转下横线
                this.sortField = colData.prop.replace(/([A-Z])/g,"_$1").toLowerCase()
                this.sortType = colData.order==='ascending' ? 'asc' : 'desc'
                this.search()
            },
            // 查询列表数据
            search() {
                let param = {
                    pageNum: this.PageNum,
                    pageSize: this.PageSize,
                    productSku: this.selectType === '0' ? this.inputValue : null,
                    productName: this.selectType === '1' ? this.inputValue : null,
                    customer: this.selectType === '2' ? this.inputValue : null,
                    shipper: this.selectType === '3' ? this.inputValue : null,
                    sortField: this.sortField,
                    sortType: this.sortType
                }
            
                this.$api.BasicConfiguration.getSkuList(param).then(res => {
                    if(res.errorCode === '100200'){
                        this.dataSource.data = res.data.list
                        this.total = res.data.total
                    }else{
                        this.$message.error(res.msg)
                    }
                }).catch(error => {

                });
            },
            // 多选
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            // 查看
            handleReview(index,row) {
                this.$router.push({path:'/BasicConfiguration/SKUInfoDetail',query: {id:row.id}})
            }
        },
        activated() {
            console.log('2222222222222');
            
            this.search()
        },
    }
</script>
