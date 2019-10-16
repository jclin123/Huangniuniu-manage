<template>
  <div>
    <!-- :inline="true" 表单一行显示 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
      <el-form-item prop="actorName">
        <el-input v-model="searchMap.actorName" placeholder="输入姓名搜索" style="width: 200px"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="clickquery">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表
        :data 绑定渲染的数据
        border 表格边框
    -->
    <el-table :data="list" height="500" border style="width: 100%;text-align:center">
      <!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
      <el-table-column type="index" label="序号" width="150"></el-table-column>
      <el-table-column prop="actorName" label="演员名称"></el-table-column>
      <el-table-column  label="头像" >
        <template slot-scope="scope">
          <div class="demo-image__preview">
            <el-image style="width: 100px; height: 100px" :src="scope.row.actorPicture"></el-image>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 50]"
      :page-size="rows"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 弹出新增窗口 
        title 窗口的标题
        :visible.sync 当它true的时候，窗口会被弹出
    -->
    <el-dialog :title="dailogTitleType" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="actorForm"
        :rules="rules"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :model="actor"
      >
        <el-form-item label="演员姓名" prop="actorName">
          <el-input v-model="actor.actorName"></el-input>
        </el-form-item>
        <el-form-item label="上传头像" prop="file">
          <!-- <el-input type="textarea" v-model="pojo.address" ></el-input> -->
          <el-upload
            class="upload-demo"
            action="http://api.huangniuniu.com/api/upload/image"
            :limit="1"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="fileChange"
            :on-success="successfun"
            :file-list="fileList"
            ref="nowUpload"

            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button
          type="primary"
          @click="actor.id == null ? addData('actorForm'): updateData('actorForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      fileList:[],

      list: [],
      total: 0, // 总记录数
      page: 1, // 当前页码
      rows: 10, // 每页显示10条数据,
      searchMap: {
        // 条件查询绑定的条件值
        actorName: ''
      },
      dialogFormVisible: false, //控制对话框
      dailogTitleType: '',//弹框标题
      actor: {
        id: null,
        actorName: '',
        actorPicture: ''
      }, // 提交的数据

      rules: { // 校验演员规则
        actorName: [
          {required: true, message: '演员名称不能为空', trigger: 'blur'}
        ]

      },
    };
  },

  created() {
    // 初始化获取列表数据
    this.fetchData();
  },

  methods: {
    successfun(response, file, fileList){
        //this.actor.actorPicture = response;
      //console.log(file)
       this.fileList.push({'url':file.response});
    },

    //图片参数设置
    fileChange(file) {
      const typeArr = ["image/png", "image/jpeg", "image/jpg"];
      const isJPG = typeArr.indexOf(file.raw.type) !== -1;//-1时候代表false
      // image/png, image/jpeg, image/gif, image/jpg
      const isLt10M = file.size / 1024 / 1024 < 10;//图片必须少于10M

      if (!isJPG) {
        this.$message.error("只能是图片!");
        this.$refs.nowUpload.clearFiles();
        this.files = null;
        return;
      }
      if (!isLt10M) {
        this.$message.error("上传图片大小不能超过 10MB!");
        this.$refs.nowUpload.clearFiles();
        this.files = null;
        return;
      }
      this.files = file.raw;
      /*console.log("this.files"+JSON.stringify(this.files));
      console.log(file);*/
    },


    handlePreview(){

    },
    handleRemove(file, fileList){
      //this.actor.actorPicture = '';
      this.fileList = []
    },
    // 当每页显示条数改变后,被触发 , val是最新的每页显示条数
    handleSizeChange(val) {
      // console.log(val)
      this.rows = val;
      this.conditionquery();
    },
    // 当页码改变后,被触发 , val 是最新的页面
    handleCurrentChange(val) {
      // console.log(val)
      this.page = val;
      this.conditionquery();
    },
    fetchData() {
      // 调用分页查询数据
      const that = this;
      this.$http.get("/movie/getActorByCondition",{
        params: {
          rows: this.rows,
          page: this.page
        }
      }).then(({data})=>{
        that.list = data.items;
        that.total = data.total;
      }).catch(()=>{
        that.list = [];
        that.total = 0;
      })
    },

    //点击查询
    clickquery(){
      this.page = 1;//初始化从第一页开始
      this.conditionquery();
    },

    //条件查询用户信息
    conditionquery(){
      const that = this;
      this.$http.get("/movie/getActorByCondition",{
        params: {
          actorName: this.searchMap.actorName,
          rows: this.rows,
          page: this.page
        }
      }).then(({data})=>{
        that.list = data.items;
        that.total = data.total;
      }).catch(()=>{
        that.list = [];
        that.total = 0;
      })
    },

    //重置
    resetForm(formName) {
      console.log("重置", formName);
      // 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效
      this.$refs[formName].resetFields();
    },
    // 提交新增数据
    addData(formName) {
      const that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          //封装图片路径
          this.actor.actorPicture = this.fileList[0].url;
          //提交表单
          this.$http({
            method:  'post',
            url: '/movie/insertActor',
            data:this.$qs.stringify(this.actor)
          }).then(({data})=>{
            //新增成功，刷新列表数据
            that.fetchData()
            //that.add_dialogFormVisible = false // 关闭窗口
            that.dialogFormVisible = false
            that.$message({
              message: '添加成功',
              type: 'success'
            })
          }).catch(()=>{
            that.$message({
              message: '添加失败',
              type: 'warning'
            })
          })
        } else {
          return false;
        }
      });
    },
    // 弹出新增窗口
    handleAdd() {
      //初始化数据
      this.actor = {};
      this.fileList = [];
      this.dialogFormVisible = true;
      this.dailogTitleType = '添加电影院'
    },

    // 打开编辑窗口
    handleEdit(row) {
      //初始化数据
      this.fileList = [];
      this.actor = {};
      this.dialogFormVisible = true;
      this.dailogTitleType = '编辑电影院'
      //回显数据
      this.fileList.push({'url' : row.actorPicture})
      this.actor = row
    },

    updateData(formName) {
      const that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          //封装图片路径
          this.actor.actorPicture = this.fileList[0].url;
          this.$http({
            method:  'put',
            url: '/movie/updateActor',
            data:this.$qs.stringify(this.actor)
          }).then(({data})=>{
            //新增成功，刷新列表数据
            that.fetchData()
            that.dialogFormVisible = false // 关闭窗口
            that.$message({
              message: '修改成功',
              type: 'success'
            })
          }).catch(()=>{
            that.$message({
              message: '修改失败',
              type: 'warning'
            })
          })
        } else {
          return false;
        }
      });
    },
    // 删除演员
    handleDelete(id) {
      const that = this;
      this.$confirm('确认删除这条记录吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        this.$http.delete('/movie/deleteActor/'+id)
                .then(()=>{
                  that.fetchData()
                  this.$message({
                    message: '删除成功',
                    type:  'success'
                  })
                }).catch(()=>{
          this.$message({
            message: '删除失败',
            type:  'error'
          })
        })
      }).catch(() => {
        // 取消，不用理会
        console.log('取消')
      })
    }
  },


};
</script>