<!--异常明细-->
<template>
  <div class="check-list">
    <V-Table :dataSource="dataSource">
      <!--异常原因-->
      <template slot-scope="scopes" slot="exceptionCauseId">
        {{getNameByMaId(maList[0], scopes.scope.row.exceptionCauseId)}}
      </template>
    </V-Table>
  </div>
</template>

<script>
  import { QcReceiptsDetailAbnormal } from './cols'
  import { mapGetters } from 'vuex'
  import mixinTableModule from '@/mixin/table-module'
  export default {
    mixins: [mixinTableModule],
    data () {
      return {
        mixinTableModuleOptions: {
          activatedIsNeed: false,
          getDataListURL: 'inbound/qc/getException',
          getDataListIsPage: true,
          getDataListType: 'get'
        },
        dataForm: {
          waybillNumber: ''
        },
        dataSource: {
          data: [],
          cols: QcReceiptsDetailAbnormal,
          isIndex: true
        },
        maList: ['qc_exception']
      }
    },
    computed: {
      ...mapGetters({getRow: 'qcReceiptsList/getRow'})
    },
    activated() {
      this.dataForm.waybillNumber = this.getRow.waybillNumber
      this.getMoreMaList(this.maList)
      this.getDataList()
    },

}
</script>
