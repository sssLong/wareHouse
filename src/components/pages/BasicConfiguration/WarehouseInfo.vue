<template>
    <div class="container">
       <div class="header-container base-container">
           <V-Title title="仓库信息">
                <el-input clearable
                    @clear="PageNum=1;search()"
                    placeholder="请输入查询内容"
                    v-model.trim="inputValue"
                    @keyup.native.enter="PageNum=1;search()"
                    class="input-select">
                    <el-select v-model="selectValue" slot="prepend" placeholder="选择仓库" @change="PageNum=1;search()">
                        <el-option v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="PageNum=1;search()"></el-button>
               </el-input>
            </V-Title>
           <div class="condition">
                <el-select  v-model="selectValue1" placeholder="仓库类型" @change="PageNum=1;search()">
                     <el-option v-for="(item,index) in options1"
                     :key="index" :label="item.dataName" :value="item.dataCode">
                     </el-option>
                </el-select>
                <el-select  v-model="selectValue2" placeholder="是否启用" @change="PageNum=1;search()">
                     <el-option v-for="(item,index) in options2" 
                     :key="index" :label="item.label" :value="item.value">
                     </el-option>
                </el-select>
                <span @click='reset' class="resetSpan">重置</span>
           </div>
       </div>
       <div class="table-container">
           <div class="table-operation">
               <div class="title">仓库列表</div>
               <div class="operation">
                    <div @click="handleAdd" v-show="btnPermission('新添仓库')">
                       <i class="iconfont iconchuangjianqiaban"></i>
                       <span>新添</span>
                   </div>
               </div>
           </div>

           <!-- 引入表格公共组件 START -->
          <V-Table 
             :dataSource="dataSource"
             @sort-change="handleSort"
             @selection-change="handleSelectionChange"
             @edit="handleEdit"
             @review='handleReview'
             @use="handleUse"
             @ban="handleBan"
          >
            <!-- slot 自定义列的情况 -->
            <template slot-scope="scopes" slot="zip">
                {{scopes.scope.row.warehouseState === '1' ? '是' : '否'}}
            </template>

          </V-Table>
           <!-- 引入表格公共组件 END -->
       </div>
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
</template>

<script>
    import axios from 'axios'
    import { warehouseCols } from './cols'
    export default {
        name: 'BasicConfiguration_WarehouseInfo',
        data() {
            return {
                inputValue: '', // 输入框的值
                selectValue: '0', // 下拉框选中的值
                selectValue1: '',
                selectValue2: '',
                options: [
                    {
                        label: '仓库名称',
                        value: '0'
                    },
                    {
                        label: '仓库编码',
                        value: '1'
                    }
                ],
                options1: [],
                options2: [
                    {
                        label: '是',
                        value: '1'
                    },
                    {
                        label: '否',
                        value: '0'
                    }
                ],
                dataSource: {
                   data: [], // 表格数据
                   cols: warehouseCols, // 表格的列数据
                   isSelection: false, // 表格有多选时设置
                   isOperation: true, // 表格有操作列时设置
                   operation: { // 表格有操作列时设置
                       label: '操作', // 列名
                       width: '150', // 根据实际情况给宽度
                       data: [
                           {
                               label: '查看', // 操作名称
                               emitType: 'review', // 触发父组件
                               permission: '仓库详情', // 后期这个操作的权限，用来控制权限
                           },
                            {
                               label: '修改', // 操作名称
                               emitType: 'edit', // 触发父组件
                               permission: '编辑仓库', // 后期这个操作的权限，用来控制权限
                           },
                           {
                                label: '启用', // 操作名称
                                invisibleKey: 'useDisable', // 隐藏启用按钮
                                emitType: 'use', // 触发父组件
                                permission: '启用仓库', // 后期这个操作的权限，用来控制权限
                            },{
                                label: '禁用', // 操作名称
                                invisibleKey: 'banDisable', // 隐藏禁用按钮
                                emitType: 'ban', // 触发父组件
                                permission: '禁用仓库', // 后期这个操作的权限，用来控制权限
                            },
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
                sortType: null, // 排序类型
                id: '' // 启用 禁用id
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
            search() {
                let param = {
                    pageNum: this.PageNum,
                    pageSize: this.PageSize,
                    warehouseName: this.selectValue === '0' ? this.inputValue : null,
                    warehouseCode: this.selectValue === '1' ? this.inputValue : null,
                    warehouseType: this.selectValue1 ? this.selectValue1 : null,
                    warehouseState: this.selectValue2 ? this.selectValue2 : null,
                    sortField: this.sortField,
                    sortType: this.sortType
                }
                this.$api.BasicConfiguration.listWarehouse(param).then(res => {
                    if(res.errorCode === '100200'){
                        console.log(res.data)
                        this.dataSource.data = res.data.list.map(item => {
                            if (item.warehouseState === '0') {
                                item.banDisable = true // 隐藏禁用按钮
                            }
                            if (item.warehouseState === '1') {
                                item.useDisable = true // 隐藏启用按钮
                            }
                            return item
                        })
                        this.total = res.data.total
                    }else{
                        this.$message.error(res.msg)
                    }
                }).catch(error => {

                });
            },
            getWarehouseType() {
                this.$api.BasicConfiguration.getWarehouseType().then(res => {
                    if(res.errorCode === '100200'){
                        console.log(res.data)
                        this.options1 = res.data
                    }else{
                        this.$message.error(res.msg)
                    }
                }).catch(error => {

                });
            },
            // 重置
            reset (){
                Object.assign(this.$data, this.$options.data())
                this.search()
                this.getWarehouseType()
            },
            // 多选
           handleSelectionChange(val) {
                this.multipleSelection = val
                console.log(val,'val')

            },
           // 查看
           handleReview(index,row) {
               console.log(index,row,'查看')
               this.$router.push({path:'/BasicConfiguration/WarehouseInfoDetail',query: {id:row.id}})
           },
           // 新添
           handleAdd() {
               this.$router.push('/BasicConfiguration/WarehouseInfoAdd')
               this.$store.commit("getFreshAdd", true)
           },
           // 修改
           handleEdit(index,row) {
             this.$store.commit("getFormDetail", false)
             this.$router.push({path:'/BasicConfiguration/WarehouseInfoEdit',query: {id:row.id}})
           },
            // 启用 
            handleUse() {
                let data = arguments[1]
                this.id = data.id
                this.handleUseBan('1')
            },
            // 禁用 
            handleBan() {
                let data = arguments[1]  
                this.id = data.id
                this.handleUseBan('0')
            },
            // 启用 禁用
            handleUseBan(val) {
                this.$api.BasicConfiguration.stateWarehouse(val,this.id).then(res => {
                    if (res.errorCode === "100200") {
                    this.$message.success("操作成功！");
                    this.search();
                    } else {
                    this.$message.error(res.msg);
                    }
                }).catch(error => {})
            },
        },
        activated() {
            this.search()
            this.getWarehouseType()
        },
    }
</script>
