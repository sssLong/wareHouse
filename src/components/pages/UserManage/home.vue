<!--
 * @Autor: 廖佳星
 * @LastEditors: 廖佳星
 * @LastEditTime: 2019-09-11 14:30:10
 -->
<!-- 
开发人：廖佳星
样式文件：WarehouseInside/index.scss
最后修改时间：19-7-30 12:00 
 -->

<template>
  <div class="mainIndexBox">
    <div class="leftBox">
      <div class="bgFbr mb-20 tableBox">
        <V-Title title="我的数据" class="oneTitle"></V-Title>
        <el-table
          :data="tableData"
          height="85%"
          show-summary
          class="p-20 pt-0"
          style="width: 100%;"
        >
          <el-table-column prop="updateDate" label="日期" width="180"></el-table-column>
          <el-table-column prop="unpacksNum" label="入库拆包数" min-width="100"></el-table-column>
          <el-table-column prop="putawayNum" label="上架件数" min-width="90"></el-table-column>
          <el-table-column prop="packingPackageNum" label="出库打包数" min-width="100"></el-table-column>
          <el-table-column prop="outboundNum" label="出库件数" min-width="90"></el-table-column>
          <el-table-column prop="inventoryNum" label="盘点件数" min-width="90"></el-table-column>
          <el-table-column prop="insideNum" label="移位数" min-width="80"></el-table-column>
        </el-table>
      </div>
      <div class="bgFbr autoScrollbar" style="height:260px;">
        <V-Title title="快捷功能">
          <span class="set" @click="QuickFnVisible=true">快捷功能设置</span>
        </V-Title>
        <div class="disFlx pl-25 pr-25 pb-10">
          <div
            class="imgBox"
            v-for="(item,index) in forsetList"
            :key="index"
            @click="$router.push(item.url)"
          >
            <img :src="'/static/img/wms-首页切图/'+item.name+'.png'" width="136" onerror="this.src='/static/img/wms-首页切图/备用图片.jpg'"/>
            <div v-text="item.name"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="rightBox">
      <div class="bgFbr personal mb-20">
        <div class="message">
          <p class="pt-40 pb-20">{{messageData.name}}，您好！</p>
          <p class="fz14">
            {{messageData.date}}
            <br />欢迎使用仓库管理系统!
          </p>
        </div>
        <img src="../../../assets/img/messageBG.png" width="260" />
      </div>
      <div class="bgFbr announcement">
        <V-Title title="公告通知">
          <span class="set" @click="more">更多</span>
        </V-Title>
        <ul class="p-20 pt-5 Acontent">
          <li v-for="(item,index) in messageListSize" @click="checkMessage(item)" :key="index" :class="item.read==='0'?'unread':''">
            <div v-text="item.title"></div>
            <div v-text="item.createTime"></div>
          </li>
        </ul>
      </div>
    </div>

    <el-dialog title="快捷功能设置" class="setDialog" :visible.sync="QuickFnVisible" width="480px">
      <p class="titleP">
        <span>*</span>
        当前已选择 {{checkList.length}} 个快捷功能在首页展示 （ 最多可选择 22 个 ）
      </p>
      <div
        v-for="(item,index) in functionSet"
        :key="index"
        v-if="item.name !== '首页'"
      >
        <p class="bgE">{{item.name}}</p>
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="(chih,dex) in item.children" :key="dex" :label="chih.id">{{chih.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer">
        <el-button @click="QuickFnVisible = false">取 消</el-button>
        <el-button type="primary" @click="setFnsbm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      class="messageDetails"
      title="公告详情"
      :visible.sync="messageVib"
      width="680px"
      @close="search">
      <div>
        <el-form  ref="form" label-width="120px">
          <el-form-item label="公告标题：">
            <div v-html="form.title"></div>
          </el-form-item>
          <el-form-item label="公告内容：">
            <div class="title" v-html="form.content">
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary"  @click="messageVib = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="公告列表"
      :visible.sync="messageListVib"
      width="680px"
      @close="PageNum = 1;PageSize = 19; search()">
      <el-table
        :data="messageList"
        height="550"
        class="pt-0"
        style="width: 100%;"
      >
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="createTime" label="时间" min-width="140"></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <span class="blueColor printer" @click="checkMessage(scope.row)">查看</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="p-20 pb-0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="PageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <span slot="footer">
        <el-button type="primary" @click="messageListVib = false">确 定</el-button>
      </span>
    </el-dialog>
    
    
  </div>
</template>

<script>
import { homeFnSet } from "./cols";
export default {
  data() {
    return {
      // 信息展示
      messageData: {
        name: "",
        date: "",
        id: ""
      },
      // 设置快捷功能
      QuickFnVisible: false,
      functionSet: [],
      checkList: [],
      forsetList: [],
      // 表格数据展示
      tableData: [],
      form:{
        title: "",
        content: ""
      },
      // 公告展示
      messageList:[],
      messageListSize:[],
      messageVib: false,//公告详情弹窗
      messageListVib: false,//公告列表弹窗
      PageNum: 1, //页码
      PageSize: 19, //行数
      total: null, //总页数
    };
  },
  mounted(){
    const that = this;
    that.messageData.name = localStorage.getItem("accountName");
    that.messageData.id = localStorage.getItem("accountId");
    that.dateZH() //获取时间
    that.getTreeOfMenusByUserId() //获取账号权限菜单
    that.getAccountData() //获取账号的操作数据
    that.search() // 获取公告列表
  },
  methods: {
    //   获取时间
    dateZH() {
      const that = this;
      let time = new Date();
      function week() {
        switch (time.getDay()) {
          case 0:
            return "天";
            break;
          case 1:
            return "一";
            break;
          case 2:
            return "二";
            break;
          case 3:
            return "三";
            break;
          case 4:
            return "四";
            break;
          case 5:
            return "五";
            break;
          case 6:
            return "六";
            break;
          default:
            break;
        }
      }
      that.messageData.date =
        time.getFullYear() +
        "年" +
        (time.getMonth() + 1) +
        "月" +
        time.getDate() +
        "日，星期" +
        week();
    },
    //快捷功能设置
    setFnsbm() {
      const that = this
       if (that.checkList.length > 22) {
        that.$message.error("选择数量超过限定数量！");
        return
      }
      that.$api.UserManage.bindingShortcutMenus(that.checkList.join(',')).then((res) => {
      if(res.errorCode==='100200'){
        that.$message.success('设置成功！')
        that.QuickFnVisible = false
        that.getTreeOfMenusByUserId()
      }
      }).catch((err) => {console.log(err)});
    },
    // 获取账号对应的菜单-已过滤
    async getTreeOfMenusByUserId() {
      const that = this;
      await that.$api.UserManage.getTreeOfMenusByUserId(that.messageData.id)
        .then(res => {
          that.functionSet = res.data;
        }).catch(err => {console.log(err)});
      that.getShortcutMenus()
    },
    // 获取账号设置的快捷菜单
    getShortcutMenus(){
      const that = this
      that.checkList = []
      that.forsetList = []
      that.$api.UserManage.getShortcutMenus().then((res) => {
        for (let i = 0; i < that.functionSet.length; i++) {
          const element = that.functionSet[i]
          element.children.forEach(v=>{
            for (let j = 0; j < res.data.length; j++) {
               if(v.url === res.data[j].url){
                 that.forsetList.push(res.data[j])
                 that.checkList.push(res.data[j].id) //勾选回显
               }
            }
          })
        }
      }).catch((err) => {console.log(err)});
    },
    // 获取账号的数据
    getAccountData(){
      this.$api.UserManage.getAccountData().then((res) => {
          this.tableData = res.data.list
      }).catch((err) => {console.log(err)});
    },
    // 获取公告
    search(){
      let params = {
        page: this.PageNum, //页码 ,
        row: this.PageSize //每页显示行数 
      }
      this.$api.UserManage.getMessageList(params).then((res) => {
        this.messageList = res.data.pageInfo.list
        if(this.PageNum === 1 && this.PageSize === 19){this.messageListSize = res.data.pageInfo.list}
        this.total = res.data.pageInfo.total
      }).catch((err) => {console.log(err)});
    },
    // 点击单行公告，查看详情
    checkMessage(row){
      const that = this
      that.messageVib = true
      that.getMessageDetail(row.id) //查询公告详情
    },
    //   查询公告详情
    getMessageDetail(params){
        const that = this
        that.updateIsRead(params)
        that.$api.UserManage.getMessageDetail(params).then((res) => {
          that.form.title = res.data.title
          that.form.content = res.data.content
        }).catch((err) => {console.log(err)});
    },
    // 更多
    more(){
      const that = this
      that.messageListVib = true
      that.PageNum = 1
      that.PageSize = 10
      that.search()
    },
    //   修改公告是否已读状态
    updateIsRead(params){
        const that = this
        that.$api.UserManage.UserManage(params).then((res) => {
        }).catch((err) => {console.log(err)});
    },
  },
  // 关闭弹窗
  destroyed(){
    this.QuickFnVisible = false
    this.messageVib = false //公告详情弹窗
    this.messageListVib = false //公告列表弹窗
  }
};
</script>
