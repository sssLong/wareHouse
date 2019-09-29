<template>
  <div class="container">
    <div class="header-container base-container">
      <V-Title title="库区信息">
        <el-input
          clearable
          placeholder="请输入查询内容"
          v-model.trim="inputValue"
          @keyup.native.enter="PageNum=1;search()"
          @clear="PageNum=1;search()"
          class="input-select">
          <el-select v-model="selectValue" slot="prepend" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
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
        <el-select v-model="selectValue2" placeholder="分区功能" @change="PageNum=1;search()">
          <el-option
            v-for="(item,index) in options2"
            :key="index"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select  v-model="selectValue1" placeholder="库区状态" @change="PageNum=1;search()">
            <el-option v-for="(item,index) in options1" 
            :key="index" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <span @click="reset" class="resetSpan">重置</span>
      </div>
    </div>
    <div class="table-container">
      <div class="table-operation">
        <div class="title">库区信息列表</div>
        <div class="operation">
          <div @click="handleAdd" v-show="btnPermission('新增库区')">
            <i class="iconfont iconchuangjianqiaban"></i>
            <span>新添</span>
          </div>
        </div>
      </div>

      <!-- 引入表格公共组件 START -->
      <V-Table
        :dataSource="dataSource"
        @sort-change="handleSort"
        @update="handleUpdate"
        @use="handleUse"
        @ban="handleBan"
      >
        <!-- slot 自定义列的情况 -->
        <template slot-scope="scopes" slot="zip">{{scopes.scope.row.areaState === 1 ? '启用' : '禁用'}}</template>
        <template slot-scope="scopes" slot="zip1">{{scopes.scope.row.areaManager.join('、')}}</template>
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
import axios from "axios";
import { areaCols } from "./cols";
export default {
  name: 'BasicConfiguration_AreaInfo',
  data() {
    return {
      warehouseCode: '', // 仓库id
      inputValue: "", // 输入框的值
      options: [
        {
          label: "库区名称",
          value: "1"
        },
        {
          label: "库区编码",
          value: "0"
        },
        {
          label: "分区楼层",
          value: "2"
        }
      ],
      selectValue: "1", // 查询条件选中的值
      options2: [], //分区功能数组
      selectValue2: "", //分区功能选中值
      selectValue1: "", //分区功能选中值
      options1: [
        {
          label: '启用',
          value: '1'
        },
        {
          label: '禁用',
          value: '0'
        }
      ],
      ids: [], // 多选 选中数据id数组
      dataSource: {
        data: [], // 表格数据
        cols: areaCols, // 表格的列数据
        isOperation: true, // 表格有操作列时设置
        operation: {
          // 表格有操作列时设置
          label: "操作", // 列名
          width: "120", // 根据实际情况给宽度
          data: [
            {
              label: "修改", // 操作名称
              emitType: "update", // 触发父组件
              permission: "编辑库区" // 后期这个操作的权限，用来控制权限
            },
            {
              label: '启用', // 操作名称
              invisibleKey: 'useDisable', // 隐藏启用按钮
              emitType: 'use', // 触发父组件
              permission: '启用库区', // 后期这个操作的权限，用来控制权限
            },{
              label: '禁用', // 操作名称
              invisibleKey: 'banDisable', // 隐藏禁用按钮
              emitType: 'ban', // 触发父组件
              permission: '禁用库区', // 后期这个操作的权限，用来控制权限
            }
          ]
        }
      },
      multipleSelection: [],
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      d:[],
      sortField: null, // 排序字段
      sortType: null // 排序类型
    };
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
      const that = this;
      let sv = that.selectValue;
      let param = {
        pageNum: that.PageNum, //页码
        pageSize: that.PageSize, //行数
        warehouseCode: that.warehouseCode || null, //分区功能
        areaCode: sv === "0" ? that.inputValue : "", //仓库名称
        areaName: sv === "1" ? that.inputValue : "", //库区名称
        areaFloor: sv === "2" ? that.inputValue : "", //楼层
        areaFunction: that.selectValue2 || null, //分区功能
        areaState: that.selectValue1 || null, //分区功能
        sortField: this.sortField,
        sortType: this.sortType
      };
      that.$api.BasicConfiguration.listArea(param).then(res => {
        if (res.errorCode === "100200") {
          console.log(res.data, "查询列表");
          // that.dataSource.data = res.data.list;
          this.dataSource.data = res.data.list.map(item => {
            if (item.areaState === 0) {
              item.banDisable = true // 隐藏禁用按钮
            }
            if (item.areaState === 1) {
              item.useDisable = true // 隐藏启用按钮
            }
            return item
          })
          that.total = res.data.total;
          // 循环列表
          res.data.list.forEach((v,index) => {
            let a=[];
            // 循环分类，转换为字符类型
            v.categoryList.forEach(e => {
              a.push(e.dataName)
            });
            that.dataSource.data[index].categoryList = a.join(",")
          });
        } else {
          that.$message.error(res.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    // 获取分区功能下拉数据
    getDictCode() {
      this.$api.BasicConfiguration.getDictCode({dictCode:"area_function"}).then(res => {
        if (res.errorCode === "100200") {
          console.log(res.data, "查询分区功能");
          this.options2 = res.data;
        } else {
          this.$message.error(res.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    
    // 修改跳转页面
    handleUpdate(index, row) {
      this.$router.push({ path: "/BasicConfiguration/AreaInfoEdit", query: { id: row.id } });
    },
    // 重置
    reset() {
      Object.assign(this.$data, this.$options.data())
      this.search()
      this.getDictCode()
      this.getWareHouse()
    },
    // 启用 
    handleUse() {
      this.ids = []
      let data = arguments[1]
      this.ids.push(data.id)
      this.handleUseBan('1')
    },
    // 禁用 
    handleBan() {
      this.ids = []
      let data = arguments[1]  
      this.ids.push(data.id)
      this.handleUseBan('0')
    },
    // 启用 禁用
    handleUseBan(val) {
      this.$api.BasicConfiguration.stateArea(val,this.ids).then(res => {
        if (res.errorCode === "100200") {
          this.$message.success("操作成功！");
          this.search();
        } else {
          this.$message.error(res.msg);
        }
      }).catch(error => {})
    },
    // 新添
    handleAdd() {
      this.$router.push('/BasicConfiguration/AreaInfoAdd')
      this.$store.commit("getFreshAddA", true)
    },
  },
  activated() {
    this.search()
    this.getDictCode()
    this.getWareHouse()
  }
};
</script>
