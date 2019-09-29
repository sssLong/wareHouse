/*
 * @Author: 李步钻 
 * @Date: 2019-06-02 17:59:20 
 * @Last Modified by: 李步钻
 * @Last Modified time: 2019-08-26 17:49:50
 */
<template>
    <div>
        <el-table
          v-loading="dataSource.loading"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
          @sort-change="handleSort"
          :class="{ 'no-data': !dataSource.data || !dataSource.data.length }"
          v-bind="dataSource.autoHeight ? dataSource : Object.assign({ height }, dataSource)"
          ref="table"
        >
        <!-- 是否有多选 -->
        <el-table-column
          v-if="dataSource.isSelection"
          :selectable="dataSource.selectable"
          type="selection"
          :width="dataSource.selectionWidth || 55">
        </el-table-column>
         <!-- 是否需要序号 -->
         <el-table-column
          v-if="dataSource.isIndex"
          type="index"
          label="序号"
          width="55">
        </el-table-column>

        <template v-for="item in dataSource.cols">
          <!-- 表格的列展示 特殊情况处理 比如要输入框 显示图片 -->
          <el-table-column
            v-if="item.isTemplate"
            :key="item.prop"
            v-bind="item">
            <template slot-scope="scope">
              <!-- 比如要输入框 显示图片等等 自己定义 -->
              <slot :name="item.prop" :scope="scope"></slot>
            </template>
          </el-table-column>
          <!-- 图片带tooltip -->
          <el-table-column
            v-if="item.isImagePopover"
            :key="item.prop"
            v-bind="item">
              <template slot-scope="scope">
                <el-popover
                    placement="right"
                    title=""
                    trigger="hover">
                    <div
                      class="image-popover"
                      :style="{'background-image': `url('${scope.row[scope.column.property]}')`}"></div>
                    <div
                      slot="reference"
                      class="reference-img"
                      :style="{'background-image': `url('${scope.row[scope.column.property]}')`}"></div>
                    <!-- <img slot="reference" :src="scope.row[scope.column.property]" width="40px" height="40px"> -->
                </el-popover>
              </template>
          </el-table-column>
          <!-- 大部分适用 -->
          <el-table-column 
            v-if="!item.isImagePopover && !item.isTemplate && !item.invisible"
            v-bind="item.isCodeTableFormatter ? Object.assign({ formatter: typeFormatter }, item) : item"
            :key="item.prop">
          </el-table-column>
        </template>
        <!-- 是否有操作列 -->
        <!-- 没有数据时候不固定列 -->
        <el-table-column
          :show-overflow-tooltip="dataSource.operation.overflowTooltip"
          v-if="dataSource.isOperation"
          v-bind="dataSource.data && dataSource.data.length ? { fixed: 'right' } : null"
          style="margin-right:20px"
          class-name="handle-td"
          label-class-name="tc"
          :width="dataSource.operation.width"
          :label="dataSource.operation.label"
          >
          <!-- UI统一一排放3个，4个以上出现更多 -->
          <template slot-scope="scope">
            <!-- 三个一排的情况，去掉隐藏的按钮后的长度 -->
            <template
              v-if="dataSource.operation.data.filter((item, index) => permissionBtn[index] && !dataSource.data[scope.$index][item['invisibleKey']]).length < 4">
               <el-button
                v-for="(item,index) in dataSource.operation.data"
                v-bind="item"
                v-show="permissionBtn[index] && !dataSource.data[scope.$index][item['invisibleKey']]"
                :disabled="dataSource.data[scope.$index][item['disableKey']]"
                :key="item.label"
                type="text"
                size="small"
                @click.native.prevent="handleRow(scope.$index, scope.row, item.label)">
                {{ item.label }}
              </el-button>
            </template>
           <!-- 4个以上的情况 -->
            <template v-else>
              <!-- 三个一排 -->
              <el-button 
                v-for="(item,index) in dataSource.operation.data.slice(0,3)"
                :key="item.label"
                v-show="permissionBtn[index] && !dataSource.data[scope.$index][item['invisibleKey']]"
                :disabled="dataSource.data[scope.$index][item['disableKey']]"
                type="text"
                size="small"
                @click.native.prevent="handleRow(scope.$index, scope.row, item.label)">
                  {{ item.label }}
              </el-button>
              <!-- 三个以上出现更多 -->
              <el-dropdown >
                   <i class='iconmore pointer iconfont'></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-show="permissionBtn[index] && !dataSource.data[scope.$index][item['invisibleKey']]"
                        :disabled="dataSource.data[scope.$index][item['disableKey']]"
                        v-for="(item,index) in dataSource.operation.data.slice(3,dataSource.operation.data.length)"
                        :key="item.label"
                        @click.native.prevent="handleRow(scope.$index, scope.row, item.label)"> {{ item.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
              </el-dropdown>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    export default {
        // 接收父组件传递过来的值
        props: {
            //  表格数据和表格部分属性的对象
            dataSource: {
                 type: Object, 
            }
        },
        created(){
          this.dataSource.operation && this.dataSource.operation.data.forEach((item,index)=>{
            this.permissionBtn.push(this.btnPermission(item.permission))
          })
        },
        data(){
          return {
            permissionBtn: [],  //当前页面表格按钮的列表
            height: 0,
            screenHeight: 0
          }
        },
        watch: {
          'dataSource.cols': { // 监听表格列变化
            deep: true,
            handler () {
              // 解决表格列变动的抖动问题
              this.$nextTick(this.$refs.table.doLayout)
            }
          },
            screenHeight (val) {
                let that = this
                // 为了避免频繁触发resize函数使用定时器
                if (!this.timer) {
                // 一旦监听到的screenHeight值改变，就将其重新赋给data里的screenHeight
                that.screenHeight = val
                that.timer = true
                setTimeout(function () {
                    // 打印screenHeight变化的值
                    that.timer = false
                    that.$store.commit('SET_SCREENHEIGHT',that.screenHeight)
                    that.getHeight()
                }, 300)
                }
            }
        },
       mounted() {
         let self = this;
         self.getHeight()
         this.$store.commit('SET_SCREENHEIGHT',document.body.clientHeight)
          // 窗口改变事件
          window.onresize = () => {
            return (() => {
                 window.screenHeight = document.body.clientHeight
                 self.screenHeight = window.screenHeight
                 self.$store.commit('SET_SCREENHEIGHT',self.screenHeight)
                 self.getHeight()
            })()
        }
      },
      methods: {
          typeFormatter (row, column, val) { // 码表dataCode解析为DataName
            let data = this.dataSource.cols.find(item => item.prop === column.property) // 找到当前行的col数据
            let code = data.codeTableCode || column.property // 码表英文标识
            let codeTableList = this.$parent.MaBiaoObj[`${code.toHump()}List`] || this.$parent.MaBiaoObj[`${code.toLine()}List`] || []
            return (codeTableList.find(item => item.dataCode == row[column.property]) || {}).dataName || ''
          },
          // 多选 子传父
          handleSelectionChange(val) {
            this.$emit('selection-change',val)
          },
          // 排序事件 后端排序
          handleSort() {
            this.$emit('sort-change', arguments[0]) // { column, prop, order }
          },
          // 操作行事件 子传父
          handleRow(index,row,label) {
            // debugger
            const data =this.dataSource.operation.data;
            data.forEach( el  => {
                if(label === el.label) {
                  this.$emit(el.emitType, index, row)
                }
            });
          },
          // 找出相邻元素
           _siblings(element) {
            let arr = [];
            // 找出父节点 然后找到父节点的所有子节点 遍历
            let p = element.parentNode.children;
            for(let i =0; i< p.length; i++) {
              if(p[i] !== element) arr.push(p[i]);
            }
            return arr;
          },
          // 取元素的属性 宽/高/margin/padding
         _getStyle(obj, attr) {
          if (obj.currentStyle) {
            return obj.currentStyle[attr];
          } else {
            return document.defaultView.getComputedStyle(obj, null)[attr];
          }
        },
        // 获取元素的margin-top
        _getMarginTop(ele, attr) {
           let domMargin = this._getStyle(ele, attr)
           return Number(domMargin.substr(0,(domMargin.length-2)))
        },
        // 求和 元素之间的高度
        _getSum(arr) {
          let sum = 0
          arr.forEach(item => {
              item.marginTop = this._getMarginTop(item,'marginTop')
              item.marginBottom = this._getMarginTop(item,'marginBottom')
              sum += item.offsetHeight+item.marginTop+item.marginBottom
          })
          return sum;
        },
        // 获取表格高度
        getHeight() {
            this.$nextTick(() => {
              let mainDom = document.getElementsByClassName('main')[0]
              // let tableDom = document.getElementsByClassName('table-container')[0]
              let elTableDom= this.$el
              let tableDom = elTableDom.parentNode // 解决一个页面多个table的高度问题
              if (tableDom.classList.contains('el-tab-pane')) { // 如果有tab切换的表格(复核管理详情)
                elTableDom = elTableDom.parentNode.parentNode
                tableDom = tableDom.parentNode.parentNode.parentNode
              }
              let elTableDomMarginTop = this._getMarginTop(tableDom,'marginTop') + this._getMarginTop(tableDom,'marginBottom') + this._getMarginTop(tableDom,'paddingTop') + this._getMarginTop(tableDom,'paddingBottom')
              let arr = this._siblings(tableDom)
              let elArr = this._siblings(elTableDom)
              let outSum = this._getSum(arr)
              let innerSum = this._getSum(elArr)
              this.height = mainDom.offsetHeight - outSum - innerSum - elTableDomMarginTop
              // console.log(mainDom.offsetHeight,outSum,innerSum,elTableDomMarginTop,this.height)
            });
        }
      },
     
    }
</script>

<style lang="scss">
.image-popover {
  width: 240px;
  height: 240px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
.handle-td .cell {
  display: flex;
  align-items: center;
  justify-content: center;
}
.reference-img {
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
