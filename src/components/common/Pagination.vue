<!-- 分页组件  切换会在地址栏添加路由的query  组件开发：高友谊 -->
<template>
  <el-pagination
    layout="total, sizes, prev, pager, next, jumper"
    @current-change="pageChange"
    @size-change="sizeChange"
    :page-sizes="pageSizes"
    :current-page.sync="page"
    :page-size="limit"
    :total="total">
  </el-pagination>
</template>

<script>
import { env, query } from '@/config'
// console.log(env, query)

export default {
	data () {
		return {
			page: 1,
			limit: query.limit,
			pageSizes: [
				query.limit,
				query.limit * 2,
				query.limit * 5,
				query.limit * 10,
				query.limit * 20
			]
		}
	},
	props: {
		total: { // 总条数
			type: Number,
			required: true
		},
		change: { // 监听页码组件变化后的方法
			type: Function,
			default () {
				console.log('分页默认change方法，请传入')
			}
		}
	},
	methods: {
		pageChange (val) {
			this.change(val)
		},
		sizeChange (val) {
			this.change(val)
		}
	}
}
</script>

<style lang="scss" scoped>
.el-pagination {
  padding: 20px 10px;
}
</style>
