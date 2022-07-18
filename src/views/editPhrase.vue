<template>
  <div style="height: 100%">
    <Dialog :title="`${dialogForm.id ? '编辑常用短语' : '新建常用短语'}`" @confirm="submit">
      <el-form ref="form" :model="dialogForm" label-width="80px" :rules="rules">
        <el-form-item label="关键词" prop="keyWord">
          <el-input type="text" v-model="dialogForm.keyWord"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="dialogForm.content"></el-input>
        </el-form-item>
        <el-form-item label="所属类型" prop="typeId">
          <el-select v-model="dialogForm.typeId" filterable>
            <el-option v-for="item in typeList" :key="item.id" :label="item.content" :value="item.id"> </el-option>
          </el-select>
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
        keyWord: [{ required: true, message: '请输入关键词', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        typeId: [{ required: true, message: '请选择所属tab', trigger: 'change' }]
      },
      dialogForm: {
        id: null,
        keyWord: null,
        content: null,
        typeId: null
      }
    }
  },
  components: {
    Dialog
  },
  mounted() {
    this.getTypeList()
    if (this.$route.query.typeId) this.dialogForm.typeId = parseInt(this.$route.query.typeId)
    if (this.$route.query.id) this.getDetail(this.$route.query.id)
  },
  methods: {
    /**
     * @description: 查询详情
     * @param {*} id
     * @return {*}
     */
    async getDetail(id) {
      const res = await this.$axios({
        url: 'front/phrase/getPhraseDetail',
        params: { id }
      })
      this.dialogForm = res
    },
    /**
     * @description: 获取类型
     * @return {*}
     */
    async getTypeList() {
      const res = await this.$axios({
        url: 'front/phrase/getPhraseType',
        params: this.queryData
      })
      this.typeList = res
    },
    /**
     * @description: 提交
     * @return {*}
     */
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        const postData = {
          id: this.dialogForm.id,
          keyWord: this.dialogForm.keyWord,
          content: this.dialogForm.content,
          typeId: this.dialogForm.typeId
        }
        await this.$axios({
          url: 'front/phrase/updatePhrase',
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
