<template>
  <div>
    <!-- :inline="true" 表单一行显示 -->
    <el-form ref="searchForm" :inline="true" style="margin-top: 20px">
      <el-form-item>
        <el-button @click="turnBack()">返回上一页</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表
        :data 绑定渲染的数据
        border 表格边框
    -->
    <el-table :data="list" height="500" border style="width: 100%;text-align:center">
      <!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="movieName" label="电影名称" width="400"></el-table-column>
      <!-- <el-table-column prop="address" label="会员地址" ></el-table-column> -->
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button size="mini" @click="handleAdd(scope.row.movieid,scope.row.movieName)">添加排场</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNumber"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 弹出新增窗口 
        title 窗口的标题
        :visible.sync 当它true的时候，窗口会被弹出
    -->
    <el-dialog title="排场编辑" :visible.sync="dialogFormVisible" width="600px">
      <el-form
        ref="skeduleForm"
        label-width="150px"
        label-position="right"
        style="width: 400px;"
        :rules="rulesskedule"
        :model="skedule"
      >
        <el-form-item label="影院名称" prop="cinemaName">
          <el-input v-model="skedule.cinemaName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="电影名称" prop="movieName">
          <el-input v-model="skedule.movieName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="电影厅" prop="roomName">
          <el-input v-model="skedule.roomName"></el-input>
        </el-form-item>
        <el-form-item label="价格(单位:元)" prop="price">
          <el-input v-model="skedule.price"></el-input>
        </el-form-item>
        <el-form-item label="票数(单位:张)" prop="ticketsLeft">
          <el-input v-model="skedule.ticketsLeft"></el-input>
        </el-form-item>
        <el-form-item label="排场时间" prop="birthday">
          <el-date-picker
            style="width: 200px"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="skedule.showDate"
            type="datetime"
            placeholder="排场时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button
          type="primary"
          @click="addData('skeduleForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      pageNumber: 1, // 当前页码
      pageSize: 10, // 每页显示10条数据,

      dialogFormVisible: false, //控制对话框
      skedule: {
        id: null,
        roomName: "",
        price: 30.5,
        showDate: "",
        ticketsLeft: 30,
        movieid: null,
        cinemaid: null,
        movieName: '',
        cinemaName: ''
        //showtime: ''
      }, // 提交的数据
      //添加排场校验
      rulesskedule: {
        roomName: [
          {required: true, message: '电影厅名称不能为空', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 10 个字符'}
        ],
        price: [
          {required: true, message: '价格必须正确填写', trigger: 'blur'}
        ],
        ticketsLeft: [
          {required: true, message: '电影票数必须正确填写', trigger: 'blur'}
        ],
      }
    };
  },


  created() {
    //获取电影院过来的值
    //const that= this;
    //先解绑
    /*this.$bus.$off("CinemaMovieEvent");
    this.$bus.$on("CinemaMovieEvent",(msg)=>{
      that.cinema_movie.cinemaid = msg.id;
      that.cinema_movie.cinemaName = msg.cinemaName;
      //that.fetchData();
    })*/
    this.skedule.cinemaid = this.$store.state.id;
    this.skedule.cinemaName = this.$store.state.cinemaName;
  },

  mounted(){
    // 初始化获取列表数据
    this.fetchData();
  },

  methods: {
    //返回上一页
    turnBack() {
      this.$router.back();
     // console.log(this.cinema_movie.cinemaid)
    },
    // 当每页显示条数改变后,被触发 , val是最新的每页显示条数
    handleSizeChange(val) {
      // console.log(val)
      this.pageSize = val;
      this.fetchData();
    },
    // 当页码改变后,被触发 , val 是最新的页面
    handleCurrentChange(val) {
      // console.log(val)
      this.pageNumber = val;
      this.fetchData();
    },
    fetchData() {
      //判断cookie是否存在
      const token = this.$cookie.get("Huangniuniu_TOKEN");
      if(token) {
      const that = this;
      this.$http.get("/cinema/cinemaMoviePage/"+that.skedule.cinemaid,{
        params: {
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
        }
      }).then(({data})=>{
        that.list = data.items;
        that.total = data.total;
        console.log(that.list)
      }).catch(()=>{
        that.list = [];
        that.total = 0;
      })
      }else{
        //跳转登录页
        this.$router.push('/login/')
      }
    },

    // 提交新增数据
    addData(formName) {
      //判断cookie是否存在
      const token = this.$cookie.get("Huangniuniu_TOKEN");
      if(token) {
      const that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单
          //封装排场时间
          //this.skedule.showDate = new Date(this.skedule.showDate)

          this.$http({
            method:  'post',
            url: '/cinema/skedule',
            data:this.$qs.stringify(this.skedule)
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
      })
      }else{
        //跳转登录页
        this.$router.push('/login/')
      }
    },
    // 弹出新增窗口
    handleAdd(movieid,movieName) {
      //console.log(this.skedule)
      //初始化
      this.skedule.roomName=""
      this.skedule.price= 30.5
      this.skedule.showDate= ""
      this.skedule.ticketsLeft= 30
      this.dialogFormVisible = true;
      //初始化表单值
      this.skedule.movieid = movieid;
      this.skedule.movieName = movieName;
    },


    // 删除电影
    handleDelete(id) {
      //判断cookie是否存在
      const token = this.$cookie.get("Huangniuniu_TOKEN");
      if(token) {
      const that = this;
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(() => {
          // 确认
          this.$http.delete('/cinema/cinemaMovie/'+id)
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
        })
        .catch(() => {
          // 取消，不用理会
          console.log("取消");
        })
      }else{
        //跳转登录页
        this.$router.push('/login/')
      }
    }
  },


};
</script>