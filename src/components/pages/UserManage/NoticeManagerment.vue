<!-- 公告管理
开发人：廖佳星

 -->
<template>
  <div class="WarehouseInside">
    <div class="NoticeManagerment">
      <div class="flexBOX flexBOXS">
        <V-Title title="公告管理" style="width:100%;">
          <div class="search-content">
            <el-input
              clearable
              @clear="PageNum=1;search()"
              @keyup.native.enter="PageNum=1;search()"
              placeholder="请输入"
              v-model.trim="inputContent"
              class="input-with-select"
            >
              <el-select
                v-model="value1"
                placeholder="请选择"
                class="iconfont icon-xiala selectShelf"
                slot="prepend"
              >
                <el-option
                  v-for="item in option1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="PageNum=1;search()"></el-button>
            </el-input>
          </div>
        </V-Title>
      </div>
      <!-- 表格 -->
      <div class="table-container pl-20 pr-20 pt-20">
        <!-- 批量操作 -->
        <div class="flexBOX flexBOXS Operation">
          <div>公告列表</div>
          <ul>
            <li @click="addViewTo" v-show="btnPermission('新添公告')">
              <i class="iconfont iconchuangjianqiaban"></i>新添公告
            </li>
          </ul>
        </div>
      </div>
      <V-Table
        class="pl-20 pr-20"
        :dataSource="dataSource"
        @ViweTO="ViewTo"
        @EditTO="EditTo"
        @deleMessage="removeRow"
      >
      </V-Table>
      <!-- 引入表格公共组件 END -->
      <el-pagination
        class="p-20"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="PageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { NoticeManagermentCols } from "./cols";
export default {
  name: "UserManage_NoticeManagerment",
  data() {
    return {
      inputContent: "", //搜索值
      value1: 1, //搜索类型
      option1: [{ value: 1, label: "标题" }],
      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      // 表格组件数据
      dataSource: {
        data: [], // 表格数据
        cols: NoticeManagermentCols, // 表格的列数据
        isOperation: true, // 表格有操作列时设置
        isIndex: true, //序号
        operation: {
          // 表格有操作列时设置
          label: "操作", // 列名
          width: "150", // 根据实际情况给宽度
          data: [
            {
              label: "查看", // 操作名称
              emitType: "ViweTO", // 触发父组件
              permission: "公告详情页" // 后期这个操作的权限，用来控制权限
            },
            {
              label: "修改", // 操作名称
              emitType: "EditTO", // 触发父组件
              permission: "修改公告" // 后期这个操作的权限，用来控制权限
            },
            {
              label: "删除", // 操作名称
              emitType: "deleMessage", // 触发父组件
              permission: "删除公告" // 后期这个操作的权限，用来控制权限
            }
          ]
        }
      }
    };
  },

  methods: {
    search() {
      const that = this;
      that.$set(that.dataSource,'loading',true)
      let params = {
        page: that.PageNum,
        row: that.PageSize,
        title: that.inputContent
      };
      that.$api.UserManage.getMessageList(params)
        .then(res => {
          that.dataSource.data = res.data.pageInfo.list;
          that.total = res.data.pageInfo.total;
          that.$set(that.dataSource,'loading',false)
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除公告
    removeRow(index, row) {
      this.$api.UserManage.removeMessage(row.id)
        .then(res => {
          if (res.errorCode === "100200") {
            this.$message.success("删除成功！");
            this.search();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 跳转去新添公告页
    addViewTo() {
      this.$router.push({
        path: "/UserManage/NoticeManagermentAdd",
        query: { state: 1 }
      });
    },
    // 跳转去详情页-查看
    ViewTo(index, row) {
      this.$router.push({
        path: "/UserManage/NoticeManagermentVive",
        query: { id: row.id, state: 2 }
      });
    },
    EditTo(index, row) {
      this.$router.push({
        path: "/UserManage/NoticeManagermentEdit",
        query: { id: row.id, state: 3 }
      });
    }
  },
  activated() {
    this.search();
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>