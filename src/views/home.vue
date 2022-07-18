<template>
  <div>
    <!-- 搜索条件 -->
    <div class="search-container">
      <el-input
        v-model="queryData.searchValue"
        @change="getTableData"
        @keydown.enter="getTableData"
        clearable
        size="small"
        class="mr10"
        style="width: 200px"
        placeholder="输入关键词｜内容"
      ></el-input>
      <el-tooltip class="item" effect="dark" content="添加内容" placement="top-start">
        <div class="action-button add" @click="addKeyWord(null)"></div>
      </el-tooltip>
    </div>
    <div class="tabs-scroll">
      <div class="tab-container">
        <div
          :class="`tab-item ${item.id === queryData.type && 'active'}`"
          @click="changeType(item.id)"
          @dblclick="addType(item)"
          v-for="item in typeList"
          :key="item.id"
        >
          {{ item.content }}
        </div>
        <el-tooltip class="item" effect="dark" content="添加类型" placement="top-start">
          <div class="tab-item" @click="addType(null)">+</div>
        </el-tooltip>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" stripe @row-click="rowClick" @row-contextmenu="rowDoubleClick">
      <el-table-column prop="keyWord" label="keyWord" width="100"></el-table-column>
      <el-table-column prop="content" label="content">
        <template slot-scope="scope">
          <div class="table-content">{{ scope.row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" v-if="!isSmallSize">
        <template slot-scope="scope">
          <el-button type="text" @click="addKeyWord(scope.row)">编辑</el-button>
          <el-button type="text" @click="deletePhrase(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  data() {
    return {
      queryData: {
        searchValue: null,
        type: null
      },
      typeOption: [],
      tableData: [],
      typeList: [],
      isSmallSize: false
    }
  },
  async mounted() {
    this.addIpcListener()
    await this.getTypeList()
    this.queryData.type = this.typeList[0].id
    await this.getTableData()
  },
  methods: {
    addIpcListener() {
      //监听窗口变化
      ipcRenderer.on('sizeChange', (e, size) => {
        if ((size[0] <= 800 && size[1] <= 600) || size[0] <= 600) this.isSmallSize = true
        else this.isSmallSize = false
      })
      ipcRenderer.on('update-table', () => {
        this.getTableData()
        this.getTypeList()
      })
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
    changeType(id) {
      this.queryData.type = id
      this.getTableData()
    },
    /**
     * @description: 获取表格列表
     * @return {*}
     */
    async getTableData() {
      const res = await this.$axios({
        url: 'front/phrase/getPhrase',
        params: this.queryData
      })
      this.tableData = res.data
    },
    /**
     * @description: 打开添加关键词模态窗口
     * @param {*} row
     * @return {*}
     */
    addKeyWord(row = null) {
      let url = `/editPhrase?typeId=${this.queryData.type}`
      if (row?.id) url += `&id=${row.id}`
      ipcRenderer.send('openDialogWin', { routePath: url, height: 300 })
    },
    /**
     * @description: 删除关键词
     * @param {*} row
     * @return {*}
     */
    deletePhrase(row) {
      this.$confirm('此操作将永久删除该关键字, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$axios({
          url: 'front/phrase/deletePhrase',
          params: { id: row.id }
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getTableData()
      })
    },
    /**
     * @description: 单击
     * @param {*} row
     * @param {*} column
     * @return {*}
     */
    rowClick(row, column) {
      if (column.property === 'content' || column.property === 'keyWord') this.copyText(row.content)
    },
    /**
     * @description: 双击
     * @param {*} row
     * @param {*} column
     * @return {*}
     */
    rowDoubleClick(row, column) {
      if (column.property === 'content' || column.property === 'keyWord') this.addKeyWord(row)
    },
    /**
     * @description: 复制
     * @param {*} text
     * @return {*}
     */
    copyText(text) {
      var tag = document.createElement('textarea')
      tag.setAttribute('id', 'cp_hgz_input')
      tag.value = text
      document.getElementsByTagName('body')[0].appendChild(tag)
      document.getElementById('cp_hgz_input').select()
      document.execCommand('copy')
      document.getElementById('cp_hgz_input').remove()
      this.$message({
        type: 'success',
        message: '复制成功!'
      })
    },
    /**
     * @description: 弹出添加类型弹出框
     * @param {*} row
     * @return {*}
     */
    addType(row = null) {
      let url = `/editPhraseType`
      if (row?.id) url += `?id=${row.id}&content=${row?.content}`
      console.log(url)
      ipcRenderer.send('openDialogWin', { routePath: url, height: 200 })
    }
  }
}
</script>
<style lang="scss" scoped>
.mr10 {
  margin-right: 10px;
}
.search-container {
  display: flex;
}
.action-button {
  width: 50px;
  height: 32px;
  background-size: 25px 25px;
  background-repeat: no-repeat;
  background-position: center center;
  background-color: #409eff;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 4px;
  border: 1px solid #409eff;
  outline: none;
}
.add {
  background-image: url('../assets/tianjia.png');
}
.table-content {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tabs-scroll {
  width: 100%;
  overflow: auto;
  border-bottom: 1px solid #e4e7ed;
  margin-top: 10px;
}
.tab-container {
  border: 1px solid #e4e7ed;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  display: inline-block;
  white-space: nowrap;
  .tab-item {
    padding: 0 15px;
    height: 30px;
    box-sizing: border-box;
    line-height: 30px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    position: relative;
    border-bottom: 1px solid transparent;
    border-left: 1px solid #e4e7ed;
    cursor: pointer;
    user-select: none;
  }
  .tab-item.active {
    border-bottom: 1px solid #fff;
    color: #409eff;
  }
  .tab-item:first-of-type {
    border-left: none;
  }
}
::v-deep .el-table .el-table__cell {
  padding: 2px 0;
}
::v-deep .el-table .cell {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
