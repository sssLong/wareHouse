<!--上架明细-->
<template>
    <V-Table :dataSource="dataSource">
    </V-Table>
</template>

<script>
  import { ShelfDetailPutaway } from './cols'
  import { mapGetters } from 'vuex'
  import mixinTableModule from '@/mixin/table-module'
  export default {
    mixins: [mixinTableModule],
    data () {
      return {
        mixinTableModuleOptions: {
          activatedIsNeed: false,
          getDataListURL: 'inbound/putaway/list/details',
          getDataListIsPage: false,
          getDataListType: 'get',
          getDataListIsReturn: true
        },
        dataForm: {
          putawayId: ''
        },
        dataSource: {
          data: [],
          cols: ShelfDetailPutaway,
          isIndex: true
        },
        maList: ['putaway_status', 'receive_arrival_notice_source_type']
      }
    },
    computed: {
      ...mapGetters({getRow: 'shelfList/getRow'})
    },
    activated() {
      this.dataForm.putawayId = this.getRow.putawayId
      // 查询码表
      this.getMoreMaList(this.maList)
    },
    methods: {
      search() {
        this.getDataList()
      },
      // 查询后的回调函数
      getDataListCallback(res) {
        this.dataSource.data = res.data.putawayDetailsList
        let {actualPutawaySumNum, diffNum, planedPutawaySumNum} = res.data
        let sourceType = this.getNameByMaId(this.maList[1], this.getRow.sourceType)
        let orderStatus = this.getNameByMaId(this.maList[0], this.getRow.putawayStatus)
        this.$emit('on-set-info',{actualPutawaySumNum, diffNum, planedPutawaySumNum, sourceType, orderStatus})
      }
    }

}
</script>
