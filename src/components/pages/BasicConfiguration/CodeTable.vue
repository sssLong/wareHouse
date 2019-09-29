<template>
    <div class="container">
       <div class="header-container base-container">
           <V-Title title="码表管理">
                <el-input clearable
                    placeholder="请输入查询内容"
                    v-model.trim="inputValue"
                    @keyup.native.enter="PageNum=1;search()"
                    @clear="PageNum=1;search()"
                    class="input-select">
                    <el-select v-model="selectValue" slot="prepend" placeholder="请选择">
                        <el-option v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="PageNum=1;search()"></el-button>
               </el-input>
            </V-Title>
           <div class="condition">
                <el-select  v-model="dictState1" placeholder="状态"  @change="PageNum=1;search()">
                     <el-option v-for="(item,index) in stateOptions" 
                     :key="index" :label="item.label" :value="item.value">
                     </el-option>
                </el-select>
                <!-- <span @click='reset'>重置</span> -->
           </div>
       </div>
       <div class="table-container">
           <div class="table-operation">
               <div class="title">码表管理列表</div>
               <div class="operation">
                    <div @click="handleAddCode" v-show="btnPermission('新增码表')">
                       <i class="iconfont iconchuangjianqiaban"></i>
                       <span>新增</span>
                   </div>
               </div>
           </div>

           <!-- 引入表格公共组件 START -->
          <V-Table 
             :dataSource="dataSource"
             @sort-change="handleSort"
             @selection-change="handleSelectionChange"
             @review="handleReview"
             @amend="handleChangeCode"
          >
            <!-- slot 自定义列的情况 -->
            <template slot-scope="scopes" slot="zip">
                {{scopes.scope.row.dictState === 1 ? '启用' : '禁用'}}
            </template>

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
    import { codeCols } from './cols'
    export default {
        name: 'BasicConfiguration_CodeTable',
        data() {
            return {
                typeOptions: [
                  {
                    value: '1',
                    label: '类型名称'
                  },
                  {
                    value: '0',
                    label: '类型编码'
                  }
                ],
                stateOptions: [
                  {
                    value: 1,
                    label: '启用'
                  },
                  {
                    value: 0,
                    label: '禁用'
                  }
                ],
                inputValue: '', // 输入框的值
                selectValue: '1', // 下拉框选中的值
                dictState1: '',
                dataSource: {
                   data: [], // 表格数据
                   cols: codeCols, // 表格的列数据
                   isSelection: false, // 表格有多选时设置
                   isOperation: true, // 表格有操作列时设置
                   operation: { // 表格有操作列时设置
                       label: '操作', // 列名
                       width: '140', // 根据实际情况给宽度
                       data: [
                           {
                               label: '查看', // 操作名称
                               emitType: 'review', // 触发父组件
                               permission: '码表详情', // 后期这个操作的权限，用来控制权限
                           },
                            {
                               label: '修改', // 操作名称
                               emitType: 'amend', // 触发父组件
                               permission: '码表修改', // 后期这个操作的权限，用来控制权限
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
                    dictCode: this.selectValue === '0'?this.inputValue:"",
                    dictName: this.selectValue === '1'?this.inputValue:"",
                    dictState:this.dictState1,
                    sortField: this.sortField,
                    sortType: this.sortType
                }
                this.$api.BasicConfiguration.getCodeList(param).then(res => {
                    if(res.errorCode === '100200'){
                        console.log(res)
                        this.dataSource.data = res.data.list
                        this.total = res.data.total
                    }else{
                        this.$message.error(res.msg);
                    }
                }).catch(error => {

                });
            },
            // 重置
            // reset (){
            //     Object.assign(this.$data, this.$options.data());
            //     this.search()
            // },
            // 表格多选
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleAddCode(){  //新增码表
                this.$router.push({ path: "/BasicConfiguration/CodeTableAdd" })
                this.$store.commit("getFreshAddC", true)
            },
            handleReview(index,row) {  //码表详情
                this.$router.push({ path: "/BasicConfiguration/CodeTableDetail", query:{code:row.dictCode} });
            },
            handleChangeCode(index,row){  //修改码表
                this.$router.push({ path: "/BasicConfiguration/CodeTableChange", query:{code:row.dictCode} }); 
            }
        },
        activated() {
            this.search()
        },
    }
</script>
