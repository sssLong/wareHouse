<template>
<div class="yy-cont classContainer">
  <V-Title title="分类管理">
	<el-input clearable
      @clear="PageNum=1;search()"
	  placeholder="请输入查询内容"
	  v-model.trim="inputValue"
	  @keyup.native.enter="PageNum=1;search()"
	  class="input-select">
	  <el-select v-model="selectValue" slot="prepend" placeholder="分类名称" @change="PageNum=1;search()">
		<el-option v-for="item in options"
			:key="item.value"
			:label="item.label"
			:value="item.value">
		</el-option>
	  </el-select>
	  <el-button slot="append" icon="el-icon-search" @click="PageNum=1;search()"></el-button>
	</el-input>
  </V-Title>

  <div class="pl-20 pr-20 pb-10 form-select">
		<el-select
		clearable
		v-model="selectValue1"
		placeholder="数据来源"
		@change="PageNum=1;search()">
		<el-option v-for="item in sourceOptions"
			:key="item.dataCode"
			:label="item.dataName"
			:value="item.dataCode">
		</el-option>
	</el-select>
	</div>

	<div class="pl-20 pr-20 table-container table-outer">
		<div class="fw6" style="line-height:34px;">分类管理信息列表</div>
		<el-table @sort-change="handleSort" class="tree-table" :data="tableData" :height="height" style="width: 100%;"
		row-key="categoryCode" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
			<el-table-column
				prop="categoryLevel"
				label="分类等级" />
			<el-table-column
				prop="categoryName"
				label="分类名称" />
			<el-table-column
				prop="dataSources"
				label="数据来源" />
			<el-table-column
			  sortable
				prop="updateTime"
				label="添加/更新时间" />
		</el-table>
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
import utils from '../../../utils/element'
export default {
	name: 'BasicConfiguration_ClassManage',
	data () {
		return {
			inputValue: '', // 输入框的值
			selectValue: '1', // 下拉框选中的值
			selectValue1: '', // 下拉框选中的值
			PageNum: 1, //页码
			PageSize: 10, //行数
			total: null, //总页数
			options: [
				{
					label: '分类名称',
					value: '1'
				}
			],
			height: 0,
			sourceOptions: [],
			tableData: [],
			sortField: null, // 排序字段
      sortType: null // 排序类型
		}
	},
	mounted() {
			this.$nextTick( async() => {
				this.SettingTableHeightFn()
        this.height = this.height-34	
			});
	},
	methods: {
		SettingTableHeightFn(){   //设置表格高度
      let mainDom = document.getElementsByClassName('main')[0]
      let tableDom = document.getElementsByClassName('table-container')[0]
      let elTableDom= document.getElementsByClassName('el-table')[0].parentElement
      let elTableDomMarginTop = utils._getMarginTop(tableDom,'marginTop')
      let arr =  utils._siblings(tableDom)
      let elArr =  utils._siblings(elTableDom)
      let outSum =  utils._getSum(arr)
      let innerSum =  utils._getSum(elArr)
      this.height = mainDom.offsetHeight-outSum-elTableDomMarginTop
      document.getElementsByClassName('el-table__empty-block')[0].style.height = this.height + 'px' // 设置"暂无数据"的高度
			console.log(this.height)
			console.log(mainDom.offsetHeight)
			console.log(outSum)
			// console.log(innerSum)
			console.log(elTableDomMarginTop)
		},
		// 列表时间排序事件  升序-asc,降序-desc 
		handleSort(colData) {
				// 驼峰转下横线
				this.sortField = colData.prop.replace(/([A-Z])/g,"_$1").toLowerCase()
				this.sortType = colData.order==='ascending' ? 'asc' : 'desc'
				this.search()
		},
		// 获取数据来源下拉数据
		getSource() {
			this.$api.BasicConfiguration.getDictCode({dictCode:"sc_type"}).then(res => {
				if(res.errorCode === '100200'){
					console.log(res.data)
					this.sourceOptions = res.data
				}else{
					this.$message.error(res.msg);
				}
			}).catch(error => {

			})
		},
		// 查询列表
		search() {
			let param = {
				pageNum: this.PageNum,
				pageSize: this.PageSize,
				dataSource: this.selectValue1 !== '' ? this.selectValue1 : null,
				categoryName: this.inputValue ? this.inputValue : null,
				sortField: this.sortField,
        sortType: this.sortType
			}
			this.$api.BasicConfiguration.getCategory(param).then(res => {
				if(res.errorCode === '100200'){    
					console.log(res.data)
					// let {data} = res.data.list
					this.tableData = res.data.list
					this.total = res.data.total
				}else{
					this.$message.error(res.msg);
				}
			}).catch(error => {

			})
		}
	},
	activated() {
		this.getSource()
		this.search()
	}
}
</script>

