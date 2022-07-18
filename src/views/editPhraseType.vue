<template>
  <div style="height: 100%">
    <Dialog :title="`${dialogForm.id ? '编辑tab' : '新建tab'}`" @confirm="submit">
      <el-form ref="form" :model="dialogForm" label-width="80px" :rules="rules">
        <el-form-item label="类型" prop="content">
          <el-input type="text" v-model="dialogForm.content"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
import Dialog from '../components/dialog'
export default {
  data() {
    return {
      typeList: [],
      rules: {
        content: [{ required: true, message: '请输入类型', trigger: 'blur' }]
      },
      dialogForm: {
        id: null,
        content: null
      }
    }
  },
  components: {
    Dialog
  },
  mounted() {
    if (this.$route.query.id) {
      this.dialogForm.id = this.$route.query.id
      this.dialogForm.content = this.$route.query.content
    }
  },
  methods: {
    /**
     * @description: 提交
     * @return {*}
     */
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        const postData = { ...this.dialogForm }
        await this.$axios({
          url: 'front/phrase/updatePhraseType',
          method: 'post',
          data: postData
        })
        this.$message({
          type: 'success',
          message: `${postData.id ? '编辑' : '创建'}成功!`
        })
        ipcRenderer.send('update-table')
        ipcRenderer.send('dialog-close')
      })
    }
  }
}
</script>
