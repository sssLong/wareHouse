export const TableRecursion = class {
    constructor () {
        window.tableHasLoading = false // 是否在公共table组件设置loading属性，需绑定在windows，路由变化时重置
        window.emptyDomArr = null // 表格占位dom元素
        this.currentTable = null // 获取到的table组件
    }

    recursionVueInstance (_vue) { // 递归操作表格
        if (!_vue || !_vue.$children || !_vue.$children.length) return
        for (let item of _vue.$children) {
            if (window.tableHasLoading) return
            this.recursionVueInstance(item)
        }
        if (_vue.$el.classList.contains('el-table') && !_vue.$parent._inactive) { // _inactive表示是否是激活状态，因为可能多个table组件存在
            this.currentTable = _vue.$parent
            // if (this.currentTable) {
            //     window.emptyDomArr = this.currentTable.$el.getElementsByClassName('el-table__empty-text')
            // } else {
            //     window.emptyDomArr = _vue.$el.getElementsByClassName('el-table__empty-text')
            // }
            window.emptyDomArr = document.getElementsByClassName('el-table__empty-text')
            if (this.currentTable && this.currentTable.dataSource) { // 如果是公用table组件
                window.tableHasLoading = this.currentTable.dataSource.hasOwnProperty('loading')
                if (!window.tableHasLoading) { // 表格没设置loading属性才显示数据加载中
                    if (window.emptyDomArr && window.emptyDomArr.length) {
                        // for (let item of window.emptyDomArr) item.innerHTML = '数据加载中...'
                    }
                }
                return
            } else { // 如果是element的table
                if (window.emptyDomArr && window.emptyDomArr.length) {
                    // for (let item of window.emptyDomArr) item.innerHTML = '数据加载中...'
                }
                return window.tableHasLoading = false
            }
        }
    }
}
