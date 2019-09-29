import { getLodop } from "plugin/LodopFuncs.js";
import moment from 'moment';
import { log } from "util";
export default {
    data() {
        return {
            userOptions: [], // 角色列表数据
            warehouseList: [], //仓库列表
            customerList: [], // 客户下拉列表
            supplierList: [], //供应商列表
            supplierOwner: [], // 货主列表
            categoryList: [], //分类列表
            userList: [], //用户列表
            printList: [], // 打印机列表
            printDefault:"",//系统默认打印机
            isCatch: false, //码表接口是否报错
            MaBiaoObj: {}, //码表
            warehouseUserList: [], // 仓库操作人等下拉列表
            qualityInspectionLIist:[], // 质检台下拉列表
        }
    },
    methods: {
        // 获取仓库(所有列表)
        async getWareHouseList() {
            const res = await this.$api.Warehousing.getWareHouseList()
            let { data = [] } = res
            this.warehouseList = data;
            localStorage.setItem('warehouseList', JSON.stringify(data))
            return res
        },
        //获取仓库(根据当前用户)
        async getWareHouse() {
            const res = await this.$api.Warehousing.getWareHouseByUser()
            let { data = [] } = res
            this.warehouseList = data;
            localStorage.setItem('warehouseList', JSON.stringify(data))
            return res
        },
        // 获取客户下拉列表
        async getCustomerKv () {
          const { data = [] } = await this.$api.WarehouseData.getCustomerKv()
          this.customerList = data
        },
        //获取供应商列表
        async getSupplier() {
            const res = await this.$api.BasicConfiguration.getSupplierList({})
            this.supplierList = res.data && res.data.list || []
            return res
        },
        //获取供应商货主信息
        async getSupplierOwner() {
          const res = await this.$api.BasicConfiguration.getSupplierOwner()
          this.supplierOwner = res.data
          return res
        },
        //获取分类列表
        async getCategory() {
            const res = await this.$api.Warehousing.getCategoryList([{}])
            this.categoryList = res.data;
            return res.data; //返回数据用于回显
        },
        //获取用户列表
        async getUserList(params) {
            const res = await this.$api.Warehousing.getUserList(params)
            this.userList = res.data && res.data.pageInfo && res.data.pageInfo.list || []
            return res
        },
        // 获取策略规则列表
        async getStrategyRule() {
            const res = await this.$api.Warehousing.getStrategyRule()
            this.strategyList = res.data && res.data.dataList || []
            return res
        },
        //重置
        reset() {
            Object.assign(this.$data, this.$options.data());
            // 重置时取缓存的数据，不重新调接口
            if (localStorage.getItem('MaBiaoObj') || localStorage.getItem('warehouseList')) {
                this.MaBiaoObj = JSON.parse(localStorage.getItem('MaBiaoObj'))
                this.warehouseList = JSON.parse(localStorage.getItem('warehouseList'))
            }
            this.search(1);
        },
        // 获取格式化后的时间
        getFormatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
          return date ? moment(date).format(format) : ''
        },
        // 分页器
        handleSizeChange(val) { //行數
            this.PageSize = val
            this.search();
        },
        handleCurrentChange(val) { //頁碼
            this.PageNum = val
            this.search();
        },
        // 获取打印机列表
        getPrintList() {
            let LODOP = getLodop();
            if (!LODOP)return
            // 获取打印机个数
            let count = LODOP.GET_PRINTER_COUNT()
            let printValue = LODOP.GET_PRINTER_NAME(-1) //获取默认打印机
            this.printList = Array(count).fill(null).map((...args) => {
                if (printValue === LODOP.GET_PRINTER_NAME(args[1])){
                    this.printDefault = args[1]
                }
                return {
                    value: args[1], // args[1]为数组索引
                    label: LODOP.GET_PRINTER_NAME(args[1]) // 获取打印机名称
                }
            })

        },
        // 获取质检台信息 下拉框
        async getQualityInspectionStation(warehouseCode) {
            let params = {warehouseCode: warehouseCode}
            const { errorCode, data } = await this.$api.OutgoingOperation.getQualityInspectionStation(params);
            if(errorCode === '100200'){
                this.qualityInspectionLIist = data
            }
        },
        //批量查询码表接口
        async getMoreMaList(...res) {
            let params = { dictCodes: res.toString() };
            try {
                const { errorCode, data } = await this.$api.BasicConfiguration.getDictCodes(params);
                if (errorCode === '100200') {
                    data.forEach(item => {
                        this.$set(this.MaBiaoObj, `${item.dictCode}List`, item.dictData)
                    })
                    localStorage.setItem('MaBiaoObj', JSON.stringify(this.MaBiaoObj))
                } else {
                    this.isCatch = true
                    throw errorCode
                }
                this.search && this.search()
            } catch (error) {
                this.isCatch = true
                this.search && this.search()
            }
        },

        // 批量获取码表（仅获取码表，不调用search方法，下划线参数拿到驼峰列表数据，返回值便于链式操作）
        async batchMaTableList (...pms) {
            let params = { dictCodes: pms.join(',') }
            const { data = [] } = await this.$api.BasicConfiguration.getDictCodes(params)
            for (let item of data) {
                let code = item.dictCode.toHump()
                this.$set(this.MaBiaoObj, `${code}List`, item.dictData)
            }
            return this.MaBiaoObj
        },
        
        //根据码表value值查询对应的lable
        getNameByMaId(maKind, value) { //maKind:码表类型   value: 码表value值
            let lable = '';
            if (this.isCatch) return ''
            // 判断是否为数组, 避免多个码表查询时,只有某个码表没查出来后, 调用此方法报 Cannot read property 'forEach' of undefined" 错误
            if (!Array.isArray(this.MaBiaoObj[`${maKind}List`])) return ''
            this.MaBiaoObj[`${maKind}List`].forEach(item => {
                if (item.dataCode == value) {
                    lable = item.dataName;
                }
            })
            return lable;
        },
        scanEnter (e){
            if(e.which == 13) {
                e.target.select();  
                this.afterScan()  //你的组件里需要有这个方法，相当于扫码成功后的回调
            }
        },
        async getAccountName(warehouseCode) { // 获取操作人等人员下拉列表
            const { data = [] } = await this.$api.BasicConfiguration.getAccountName({ warehouseCode })
            this.warehouseUserList = data
            return data
        },
    },
    filters: {
        //质检方式
        qualityType(type) {
            return ['全检', '抽检', '免检'][type - 1] || ''
        },
        //来源类型
        sourceType(type) {
            return ['来料入库', '销退入库', '调拨入库'][type - 1] || ''
        },
        //单据状态
        orderStatu(type) {
            return ['待收货', '收货中', '部分收货'][type - 1] || '收货完成'
        },
        //客户状态
        ClientStatus(type) {
            return ['待收货', '收货中', '部分收货'][type - 1] || '收货完成'
        }
    }
}
