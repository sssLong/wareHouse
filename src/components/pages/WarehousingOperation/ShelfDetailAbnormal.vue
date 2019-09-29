<!--异常明细-->
<template>
  <V-Table :dataSource="dataSource">
    <!--异常原因-->
    <template slot-scope="scopes" slot="exceptionCause">
      {{getNameByMaId(maList[0], scopes.scope.row.exceptionCause)}}
    </template>
  </V-Table>
</template>

<script>
  import { ShelfDetailAbnormal } from './cols'
  import { mapGetters } from 'vuex'
  import mixinTableModule from '@/mixin/table-module'
  export default {
    mixins: [mixinTableModule],
    data () {
      return {
        mixinTableModuleOptions: {
          getDataListURL: 'inbound/putaway/getException',
          getDataListIsPage: false,
          getDataListType: 'get',
          getDataListIsReturn: true
        },
        dataForm: {
          putawayId: ''
        },
        pageSize: 100000000,
        dataSource: {
          data: [],
          cols: ShelfDetailAbnormal,
          isIndex: true
        },
        maList: ['exception_reason']
      }
    },
    activated() {
      this.dataForm.putawayId = this.getRow.putawayId
      this.getMoreMaList(this.maList)
      this.getDataList()
    },
    computed: {
      ...mapGetters({getRow: 'shelfList/getRow'})
    },
    methods: {
      // 查询后的回调函数
      getDataListCallback(res) {
        this.dataSource.data = res.data
      }
    }

}
</script>
