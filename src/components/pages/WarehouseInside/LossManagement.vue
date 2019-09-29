<!-- 损溢管理  页面开发：廖佳星 样式文件 WarehouseInside-index.scss -->
<template>
  <div class="WarehouseInside">
    <div class="LossManagement">
      <!-- 组件主盒子分割线 -->
      <!-- 头部标题+搜索 -->
      <div class="flexBOX flexBOXS">
        <V-Title title="损溢管理" style="width:100%;">
          <div class="search-content">
            <el-input
              v-if="value1!==4&&value1!==5"
              @keyup.native.enter="PageNum=1;search()"
              clearable
              placeholder="请输入查询内容"
              v-model.trim="inputContent"
              @clear="PageNum=1;search()"
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
            <!-- 创建人，处理人模糊带出 -匹配 -->
            <el-autocomplete
              v-else
              class="inline-input"
              v-model="inputContent"
              :fetch-suggestions="querySearch"
              placeholder="请输入查询内容"
              :trigger-on-focus="false"
              clearable
              @keyup.native.enter="PageNum=1;search()"
              @clear="PageNum=1;search()"
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
            </el-autocomplete>
          </div>
        </V-Title>
      </div>
      <!-- 查询条件 -->
      <div class="flexBOX p-20">
        <!-- 创建时间 -->
        <el-select v-model="value2" @change="PageNum=1;search()" placeholder="时间类型">
          <el-option
            v-for="item in option2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- 日期时间选择器 -->
        <el-date-picker
          v-model="TimeValue"
          @change="PageNum=1;search()"
          class="ml-10"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-select
          v-model="value3"
          @change="PageNum=1;search()"
          @clear="PageNum=1;search()"
          clearable
          placeholder="选择处理结果"
          class="ml-10"
        >
          <el-option
            v-for="item in MaBiaoObj.the_resultsList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select
          v-model="value4"
          @change="PageNum=1;search()"
          @clear="PageNum=1;search()"
          clearable
          placeholder="选择损溢类型"
          class="ml-10"
        >
          <el-option
            v-for="item in MaBiaoObj.caustic_excessive_typeList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <el-select
          v-model="value5"
          @change="PageNum=1;search()"
          @clear="PageNum=1;search()"
          clearable
          placeholder="选择来源类型"
          class="ml-10"
        >
          <el-option
            v-for="item in MaBiaoObj.loss_sc_typeList"
            :key="item.dataCode"
            :label="item.dataName"
            :value="item.dataCode"
          ></el-option>
        </el-select>
        <div class="resetStyle" @click="replacement">重置</div>
      </div>

      <!-- 表格 -->
      <!-- 引入表格公共组件 START -->
      <div class="table-container pl-20 pr-20">
        <!-- 批量操作 -->
        <div class="flexBOX flexBOXS Operation">
          <div>损溢单列表</div>
          <ul>
            <!-- 黄昱强-暂时注释批量审核 -->
            <!-- <li @click="BachAudit" v-show="btnPermission('审核')">
              <i class="iconfont iconshenhe"></i>审核
            </li> -->
            <li @click="LossExport" v-show="btnPermission('导出')">
              <i class="iconfont icondaochu"></i>导出
            </li>
          </ul>
        </div>
        <V-Table
          :dataSource="dataSource"
          @selection-change="handleSelectionChange"
          @audit="RowAudit"
        >
          <!-- slot 自定义列的情况 -->
          <!-- 损溢类型 -->
          <template slot-scope="scopes" slot="lossSpillType">
            <span
              :class="scopes.scope.row.lossSpillType==='BY'?'orginColor':'blurColor'"
            >{{getNameByMaId('caustic_excessive_type',scopes.scope.row.lossSpillType)}}</span>
          </template>
          <!-- 损溢数 -->
          <template slot-scope="scopes" slot="lossSpillCount">
            <span
              :class="scopes.scope.row.lossSpillType==='BY'?'orginColor':'blurColor'"
            >{{scopes.scope.row.lossSpillType==='BY'||scopes.scope.row.lossSpillCount<=0?scopes.scope.row.lossSpillCount:'-'+scopes.scope.row.lossSpillCount}}</span>
          </template>
          <!-- 来源类型 -->
          <template slot-scope="scopes" slot="sourceType">
            <span>{{getNameByMaId('loss_sc_type',scopes.scope.row.sourceType)}}</span>
          </template>
          <!-- 处理结果 -->
          <template slot-scope="scopes" slot="disposeResult">
            <span>{{getNameByMaId("the_results",scopes.scope.row.disposeResult)}}</span>
          </template>
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

      <!-- 审核弹窗 -->
      <el-dialog
        title="审核损溢单"
        :visible.sync="auditVisible"
        width="540px"
        :close-on-click-modal="false"
      >
        <el-form :model="auditData" ref="form" label-width="100px">
          <el-form-item label="审核类型">
            <el-radio-group v-model="auditData.type">
              <el-radio label="TG">审核通过</el-radio>
              <el-radio label="BH">审核驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核备注" v-if="auditData.type==='TG'" class="pr-40">
            <el-input clearable v-model="auditData.remark"></el-input>
          </el-form-item>
          <el-form-item label="驳回理由" required v-else>
            <el-input clearable v-model="auditData.remark"></el-input>
          </el-form-item>
        </el-form>
        <el-table :data="tableList" max-height="400">
          <el-table-column prop="lossSpillCode" label="损溢单号"></el-table-column>
          <el-table-column prop="sku" label="SKU"></el-table-column>
          <el-table-column label="损溢数" width="80">
            <template slot-scope="scope">
              <span
                :class="scope.row.lossSpillCount>=0?'orginColor':'blurColor'"
              >{{scope.row.lossSpillCount}}</span>
            </template>
          </el-table-column>
          <el-table-column label="损溢类型" width="100">
            <template slot-scope="scope">
              <span
                :class="scope.row.lossSpillType==='BY'?'orginColor':'blurColor'"
              >{{getNameByMaId('caustic_excessive_type',scope.row.lossSpillType)}}</span>
            </template>
          </el-table-column>
        </el-table>

        <span slot="footer">
          <el-button @click="auditVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="sbmAudit"
            :disabled="auditData.buttomStala"
          >{{auditData.buttomStala?'审核中':'确 定'}}</el-button>
        </span>
      </el-dialog>

      <!-- 组件主盒子分割线 -->
    </div>
  </div>
</template>

<script>
import { LossManagementCols } from "./cols";

export default {
  name:'WarehouseInside_LossManagement',
  data() {
    return {
      inputContent: null, //搜索值
      value1: 1,
      option1: [
        { value: 1, label: "损溢单号" },
        { value: 2, label: "来源单号" },
        { value: 3, label: "SKU" },
        { value: 4, label: "创建人" },
        { value: 5, label: "处理人" }
      ],
      value2: 1, //时间类型
      option2: [
        {
          value: 1,
          label: "创建时间"
        },
        {
          value: 2,
          label: "处理时间"
        }
      ],
      TimeValue: [], //时间

      value3: null, //选择处理结果
      value4: null, //选择损溢类型
      value5: null, //选择来源类型

      PageNum: 1, //页码
      PageSize: 10, //行数
      total: null, //总页数
      tableSelectList:[],//表格勾选中的行

      // 表格组件数据
      dataSource: {
        data: [], // 表格数据
        cols: LossManagementCols, // 表格的列数据
        isSelection: true, // 表格有多选时设置
        isOperation: true, // 表格有操作列时设置
        operation: {
          // 表格有操作列时设置
          label: "操作", // 列名
          width: "80", // 根据实际情况给宽度
          data: [
            {
              label: "审核", // 操作名称
              emitType: "audit", // 触发父组件
              permission: "审核" // 后期这个操作的权限，用来控制权限
            }
          ]
        }
      },
      auditVisible: false, //审核弹窗
      tableList: [], //审核表格数据

      auditData: {
        type: "TG", //审核类型
        remark: null, //审核备注和驳回理由
        buttomStala: false //确定按钮状态
      }
    };
  },
  methods: {
    async querySearch(queryString, cb) {
      let va = this.value1 - 3;
      // queryString 输入value值
      let restaurants = await this.loadAll(va, queryString); //模糊查询数据
      // 调用 callback 返回建议列表的数据
      cb(restaurants);
    },
    loadAll(type, val) {
      return new Promise(resolve => {
        let params = {
          personType: type, //类型 1:创建人,2:处理人
          personName: val //创建人、处理人 名字
        };
        this.$api.WarehouseInside.likePersonName(params)
          .then(res => {
            let arrays = [];
            res.data.forEach(v => {
              arrays.push({ value: v });
            });
            resolve(arrays);
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    // 查询数据，导出需用
    dataSources() {
      const that = this;
      let datas = {
        pageNum: that.PageNum, //页码
        pageSize: that.PageSize, //行数
        createTime1:
          that.value2 === 1 && that.TimeValue ? that.TimeValue[0] : null, //创建时间 -1
        createTime2:
          that.value2 === 1 && that.TimeValue ? that.TimeValue[1] : null, //创建时间 -2
        disposeTime1:
          that.value2 === 2 && that.TimeValue ? that.TimeValue[0] : null, //处理时间 -1
        disposeTime2:
          that.value2 === 2 && that.TimeValue ? that.TimeValue[1] : null, //处理时间 -2
        disposeResult: that.value3, //处理结果 ['DCL', 'CLWC', 'YBH']
        lossSpillType: that.value4, //损溢类型 ['BY', 'BS']
        sourceType: that.value5, //来源类型 ['PDYC', 'ZJYC', 'SJYC', 'JHYC', 'FHYC']
        lossSpillCode: that.value1 === 1 ? that.inputContent || null : null, // 损溢单号
        sourceOrder: that.value1 === 2 ? that.inputContent || null : null, // 来源单号
        sku: that.value1 === 3 ? that.inputContent || null : null, // SKU
        creator: that.value1 === 4 ? that.inputContent || null : null, // 创建人
        disposePerson: that.value1 === 5 ? that.inputContent || null : null //处理人
      };
      return datas;
    },
    // 查询方法
    search() {
      const that = this;
      that.$set(that.dataSource,'loading',true)
      let params = that.dataSources();
      that.$api.WarehouseInside.AQLossList(params).then(res => {
        const { data } = res;
        that.dataSource.data = data.list;
        that.total = data.total;
        that.$set(that.dataSource,'loading',false)
      }).catch(err => {
        console.log(err);
      });
    },
    // 导出方法
    LossExport() {
      const that = this;
      let params = that.dataSources();
      delete params.pageNum
      delete params.pageSize
      let url = "/warehouse/lossSpill/exportExcel";
      // @param {*} type 请求的类型
      // @param {*} url 请求的接口地址
      // @param {*} params 请求的参数
      // @param {*} fileName 下载的文件名
      // @param {*} typeName 文件类型如 .xls .pdf....
      that.$utils.commonUtils.export(
        "post",
        url,
        params,
        "损溢单列表表格",
        ".xls"
      );
    },
    // 表格勾選
    handleSelectionChange(val) {
      this.tableSelectList = val;
    },
    // 重置
    replacement() {
      const that = this
      that.inputContent = null
      that.value2 = 1
      that.TimeValue = []
      that.value3 = null
      that.value4 = null
      that.value5 = null
      that.PageNum = 1
      this.search()
    },
    // 批量审核
    BachAudit() {
      const that = this;
      if (that.tableSelectList.length === 0) {
        that.$message.warning("未选中操作行！");
        return false;
      } else {
        for (let i = 0; i < that.tableSelectList.length; i++) {
          const v = that.tableSelectList[i];
          if (v.disposeResult !== "DCL") {
            that.$message.error("勾选数据含有已审核数据！");
            return false;
          }
        }
      }
      that.auditVisible = true;
      that.tableList = that.tableSelectList;
    },
    // 单行审核
    RowAudit(index, row) {
      const that = this;
      if (row.disposeResult !== "DCL") {
        that.$message.error("此数据已审核！");
        return false;
      }
      that.auditVisible = true;
      that.tableList = [];
      that.tableList.push(row);
    },
    // 审核确定按钮
    sbmAudit() {
      const that = this;
      if (that.auditData.type === "BH" && !that.auditData.remark) {
        that.$message.error("请填写驳回理由！");
        return false;
      }
      let params = [];
      that.auditData.buttomStala = true; //确定按钮禁用
      that.tableList.forEach(v => {
        params.push({
          auditRemark: that.auditData.remark, //审核备注
          auditType: that.auditData.type, //审核类型 (BH:驳回，TG:通过)
          id: v.id, //损溢ID
          lossSpillCode: v.lossSpillCode, //损溢单号
          lossSpillType: v.lossSpillType, //损溢类型 BY:报溢 ,BS:报损
          resize: v.lossSpillCount, //调整数量
          sku: v.sku, //sku
          warehouseCode: v.warehouseCode,//仓库ID
          goodsLocation: v.goodsLocation,//货位号
          customer: v.customer,  //客户
          sourceOrder: v.sourceOrder,  //来源单号
          sourceType: v.sourceType //来源类型
        });
      });
      that.$api.WarehouseInside.Lossaudit(params)
        .then(res => {
          if (res.errorCode === "100200") {
            that.$message.success("审核成功！");
            that.auditVisible = false;
            that.search();
          }
          that.auditData.buttomStala = false; //确定按钮恢复
          Object.assign(that.auditData, this.$options.data().auditData)
        })
        .catch(err => {
          that.auditData.buttomStala = false; //确定按钮恢复
        });
    }
    // 分页器-采用混入方法
  },

  created() {},
  activated() {
    // 处理结果，损溢类型，来源类型
    this.getMoreMaList("the_results", "caustic_excessive_type", "loss_sc_type"); //查询方法在码表方法里面调用
    console.log(999);

  },

  computed: {},
  // 关闭弹窗
  deactivated(){
    this.auditVisible = false
  }
};
</script>
