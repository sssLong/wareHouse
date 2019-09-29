<!--质检明细-->
<template>
  <div class="check-list">
    <V-Table :dataSource="dataSource">
      <template slot-scope="scopes" slot="sealBoxSerialNumber">
        {{scopes.scope.row.sealBoxSerialNumber || ''}}
      </template>
    </V-Table>
  </div>
</template>

<script>
  import { QcReceiptsDetailCheck } from './cols'
  import { mapGetters } from 'vuex'
  import mixinTableModule from '@/mixin/table-module'
  export default {
    mixins: [mixinTableModule],
    data () {
      return {
        mixinTableModuleOptions: {
          activatedIsNeed: false,
          getDataListURL: 'inbound/qc/getList',
          getDataListIsPage: true
        },
        dataForm: {
          createTimeStart: '',
          createTimeEnd: '',
          flag: 1,
          orderStatus: '',
          sourceType: '',
          customerName: '',
          qualityControlOrderNumber: ''
        },
        dataSource: {
          data: [],
          cols: QcReceiptsDetailCheck,
          isIndex: true
        },
      }
    },
    computed: {
      ...mapGetters({getRow: 'qcReceiptsList/getRow'})
    },
    activated() {
      this.dataForm.qualityControlOrderNumber = this.getRow.qualityControlOrderNumber
      this.getDataList()
    },
    methods: {
    }
  }
</script>
i
