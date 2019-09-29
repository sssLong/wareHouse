<template>
    <div class="container supplier-info">
       <div class="header-container base-container">
           <V-Title title="供应商信息">
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
    import { supplierCols } from './cols'
    export default {
        name: 'BasicConfiguration_SupplierInfo',
        data() {
            return {
                inputValue: '', // 输入框的值
                selectType: '0', // 下拉框选中的值
                options: [
                    {
                        label: '供应商名称',
                        value: '0'
                    },
                    {
                        label: '所属货主',
                        value: '1'
                    },
                    {
                        label: '采购员',
                        value: '2'
                    }
                ],
                dataSource: {
                   data: [], // 表格数据
                   cols: supplierCols, // 表格的列数据
                   isSelection: false, // 表格有多选时设置
                   isOperation: true, // 表格有操作列时设置
                   operation: { // 表格有操作列时设置
                       label: '操作', // 列名
                       width: '100', // 根据实际情况给宽度
                       data: [
                           {
                               label: '查看', // 操作名称
                               emitType: 'review', // 触发父组件
                               permission: '查看供应商详情', // 后期这个操作的权限，用来控制权限
                           }
                       ]
                   }
                },
                
                multipleSelection: [],
                PageNum: 1, //页码
                PageSize: 10, //行数
                total: null, //总页数
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
                    supplierName: this.selectType === '0' ? this.inputValue : null,
                    ownerOfCargo: this.selectType === '1' ? this.inputValue : null,
                    buyer: this.selectType === '2' ? this.inputValue : null,
                    sortField: this.sortField,
                    sortType: this.sortType
                }
                this.$api.BasicConfiguration.getSupplierList(param).then(res => {
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
                console.log(val,'val')

            },
            // 查看
            handleReview(index,row) {
                this.$router.push({path:'/BasicConfiguration/SupplierInfoDetail',query: {id:row.id}})
            }
        },
        activated() {
            this.search()
        },
    }
</script>
