<template>
    <div class="iadmin_codetable g_wrap">
        <el-button @click="showModal = true" type="primary">Invitaion Code Generator</el-button>
        <t-c-r
          :tableData="codeList"
          :tableCols="tableCols"
          :pagination="pagination"
          @page-change="pageChanged"
        >
        </t-c-r>
        <el-dialog
          :visible.sync="showModal"
          title="Invitaion Code Generator Bulk"
          width="360">
          <modal-form @closeModal="showModal = false"></modal-form>
        </el-dialog>
    </div>
</template>

<script>
import TCR from '@/components/TableColumnRender.vue'
import ModalForm from '@/components/ModalForm.vue'
import request from '../apis/request'

export default {
  computed: {
    tableCols() {
      const removeFn = this.remove
      return [
        {
          raw: {
            label: 'Invite Code',
            prop: 'InviteCode',
          },
        },
        {
          raw: {
            label: 'Created',
            prop: 'Created',
          },
          formatter: (v) => this.dateFilter(v),
        },
        {
          raw: {
            label: 'Limit',
            prop: 'AvailableLimit',
          },
          formatter: (v) => `${v}Month`,
        },
        {
          raw: {
            label: 'Total Usage',
            prop: 'PackageLimit',
          },
          formatter: (v) => `${v} GB`,
        },
        {
          raw: {
            label: 'Operatinh',
          },
          render: {
            props: {
              row: {
                type: Object,
                default: () => ({}),
              },
            },
            render() {
              return (
                <el-button
                  onClick={() => removeFn(this.row)}
                  type="danger"
                  icon="el-icon-delete"
                  circle
                />
              )
            },
          },
        },
      ]
    },
  },
  data() {
    return {
      codeList: [],
      pagination: {
        total: 0,
        size: 12,
        index: 1,
      },
      order: '',
      size: 'is-small',
      isSimple: false,
      showModal: false,
    }
  },
  filters: {
    dateFilter: (value) => {
      return value.split('T')[0]
    },
  },
  methods: {
    fetchCode(index = 1) {
      request
        .get(`/api/auth/code_list?pageIndex=${index}&pageSize=${this.pagination.size}`)
        .then((response) => {
          if (response.success) {
            this.codeList = response.data.data
            this.pagination.total = response.data.total
          }
        })
    },
    remove(item, index) {
      // TODO: FIX remove effect page
      this.$confirm('Are you sure to delete the invitation code?', 'Prompt', {
        title: 'Delete invitation code',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          const removeId = item.Id
          request
            .put(`/api/auth/${removeId}/remove`)
            .then((response) => {
              if (response.success) {
                const index = this.codeList.findIndex((e) => e.Id === removeId)
                if (index > -1) {
                  this.codeList.splice(index, 1)
                  this.$message.success('Invitation code has been deleted')
                  this.removePaginationCheck()
                  this.fetchCode(this.pagination.index)
                }
              } else {
                this.$message.error('Deleting invitation code failed!')
              }
            })
            .catch(() => {
              this.$message.error('Deleting invitation code failed!')
            })
        })
        .catch(() => {})
    },
    pageChanged(value) {
      this.pagination.index = value
      this.fetchCode(value)
    },
    dateFilter: (value) => {
      return value.split('T')[0]
    },
    removePaginationCheck() {
      const { total, size, index } = this.pagination
      if (index === 1 || !index) return
      const limit = size * (index - 1) + 1
      if (total === limit) {
        this.pagination.index -= 1
      }
    },
  },
  created() {
    this.fetchCode()
  },
  components: {
    TCR,
    ModalForm,
  },
}
</script>

<style scoped>
.batch {
  margin: 80px auto 0px auto;
}

.table {
  margin: 20px auto 20px auto;
}

.table th,
.table td {
  text-align: center;
}

.pagination {
  margin: 20px auto 80px auto;
}
</style>
