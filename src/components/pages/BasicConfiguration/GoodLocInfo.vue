<template>
    <div class="container">
       <div class="header-container base-container">
           <V-Title title="货位信息">
                <el-input clearable
                    @clear="PageNum=1;search()"
                    placeholder="请输入查询内容"
                    v-model.trim="inputValue"
                    @keyup.native.enter="PageNum=1;search()"
                    class="input-select">
                <el-select v-model="selectValue" slot="prepend" placeholder="请选择"  @change="PageNum=1;search()">
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
                <el-select  v-model="warehouseCode" placeholder="仓库名称" @change="PageNum=1;search()">
                     <el-option v-for="(item,index) in warehouseList" 
                     :key="index" :label="item.dataName" :value="item.dataCode">
                     </el-option>
                </el-select>
                <el-select  v-model="positionType" placeholder="货位类型" @change="PageNum=1;search()">
                     <el-option v-for="(item,index) in options2" 
                     :key="index" :label="item.dataName" :value="item.dataCode">
                     </el-option>
                </el-select>
                <span @click='reset' class="resetSpan">重置</span>
           </div>
       </div>
       <div class="table-container">
           <div class="table-operation">
               <div class="title">货位信息列表</div>
               <div class="operation">
                    <div @click="handleAdd" v-show="btnPermission('新增货位')">
                       <i class="iconfont iconchuangjianqiaban"></i>
                       <span>新添</span>
                   </div>
                   <div @click="useClick('1')" v-show="btnPermission('批量锁定货位')">
                       <i class="iconfont iconqiyong"></i>
                       <span>批量锁定</span>
                   </div>
                   <div @click="useClick('0')" v-show="btnPermission('批量解锁货位')">
                       <i class="iconfont iconjinyong"></i>
                       <span>批量解锁</span>
                   </div>
               </div>
           </div>

           <!-- 引入表格公共组件 START -->
          <V-Table 
             :dataSource="dataSource"
             @sort-change="handleSort"
             @selection-change="handleSelectionChange">
            <!-- slot 自定义列的情况 -->
            <template slot-scope="scopes" slot="zip">
                <span>{{scopes.scope.row.length}}/{{scopes.scope.row.width}}/{{scopes.scope.row.height}}</span>
            </template>
            <template slot-scope="scopes" slot="zip1">
                <span>{{scopes.scope.row.lockState === 1 ? '锁定' : '不锁定'}}</span>
            </template>
            <template slot-scope="scopes" slot="zip2">
                <span>{{scopes.scope.row.positionState === 1 ? '满货位' : '空货位'}}</span>
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
    import { goodLocCols } from './cols'
    export default {
        name: 'BasicConfiguration_GoodLocInfo',
        data() {
            return {
                ids: [], // 多选 选中数据id数组
                inputValue: '', // 输入框的值
                selectValue: '0', // 下拉框选中的值
                warehouseCode: '', // 仓库id
                positionType: '', // 货位类型id
                options: [
                    {
                        label: '库区名称',
                        value: '0'
                    }, 
                    {
                        label: '货列编码',
                        value: '1'
                    },
                    {
                        label: '货位编码',
                        value: '2'
                    }
                ],
                options2: [],
                dataSource: {
                   data: [], // 表格数据
                   cols: goodLocCols, // 表格的列数据
                   isSelection: true, // 表格有多选时设置
                   isOperation: false, // 表格有操作列时设置
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
            // 批量锁定 解锁
            useClick(val) {
                if(this.ids.length) {
                    // if(val === '1') {
                    //     let statusData = this.multipleSelection.filter(item => {
                    //         return item.lockState == '1'
                    //     })
                    //     if(statusData.length) {
                    //         this.$utils.commonUtils.tip(`货位编码${statusData[0].positionCode}状态已经是锁定状态`,'error')
                    //         return
                    //     }
                    // }
                    // if(val === '0') {
                    //     let statusData = this.multipleSelection.filter(item => {
                    //         return item.lockState == '0'
                    //     })
                    //     if(statusData.length) {
                    //         this.$utils.commonUtils.tip(`货位编码${statusData[0].positionCode}状态已经是不锁定状态`,'error')
                    //         return
                    //     }
                    // }
                    let params =this.ids
                    this.$api.BasicConfiguration.lockPosition(val,params).then(res => {
                        if(res.errorCode === '100200'){
                            console.log(res.data)
                            this.$message.success('操作成功！')
                            this.search()
                        }else{
                            this.$message.error(res.msg)
                        }
                    }).catch(error => {

                    })
                } else {
                    this.$message.error('没有选中项！')
                }
            },
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
                areaName: this.selectValue === '0' ? this.inputValue : null,
                rowCode: this.selectValue === '1' ? this.inputValue : null,
                positionCode: this.selectValue === '2' ? this.inputValue : null,
                warehouseCode: this.warehouseCode ? this.warehouseCode : null,
                positionType: this.positionType ? this.positionType : null,
                sortField: this.sortField,
                sortType: this.sortType
              }
              this.$api.BasicConfiguration.listPosition(param).then(res => {
                  if(res.errorCode === '100200'){
                        console.log(res.data)
                        this.dataSource.data = res.data.list
                        res.data.list.forEach((item,index) => {
                            let a = []
                            // 循环分类，转换为字符类型
                            item.categoryList.forEach(item1 => {
                                a.push(item1.dataName)
                            })
                            this.dataSource.data[index].categoryList=a.join(",")
                        })
                        this.total = res.data.total
                  }else{
                      this.$message.error(res.msg)
                  }
                }).catch(error => {

                })
            },
            // 获取货位类型下拉数据
            getDictCode() {
                this.$api.BasicConfiguration.getDictCode({dictCode:"position_type"}).then(res => {
                  if(res.errorCode === '100200'){
                      console.log(res.data)
                      this.options2 = res.data
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
                this.getDictCode()
                this.getWareHouse()
            },
            // 多选
            handleSelectionChange(val) {
                console.log(val)
                this.ids = []
                this.multipleSelection = val
                this.multipleSelection.forEach(item => {
                    this.ids.push(item.id)
                })
                console.log(val,'val')
            },
            // 新添
            handleAdd() {
               this.$router.push('/BasicConfiguration/GoodLocInfoAdd')
               this.$store.commit("getFreshAddG", true)
            }
        },
        activated() {
            this.search()
            this.getDictCode()
            this.getWareHouse()
        },
    }
</script>

<style  lang="scss" scoped>

</style>
