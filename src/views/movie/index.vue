<template>
  <div>
    <!-- :inline="true" 表单一行显示 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
      <el-form-item prop="movieName">
        <el-input v-model="searchMap.movieName" placeholder="输入电影名称搜索" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="movieType">
        <el-input v-model="searchMap.movieType" placeholder="输入电影类型搜索" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="location">
        <el-input v-model="searchMap.location" placeholder="输入电影产地" style="width: 200px"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="clickquery">查询</el-button>
        <el-button type="primary" @click="handleAdd()">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表
        :data 绑定渲染的数据
        border 表格边框
    -->
    <el-table :data="list" height="500" border style="width: 100%;text-align:center">
      <!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="movieName" label="电影名称"></el-table-column>
      <el-table-column prop="movieType" label="类型" width="130"></el-table-column>
      <el-table-column prop="location" label="影片产地"></el-table-column>
      <el-table-column prop="score" label="评分" width="70"></el-table-column>
      <el-table-column prop="releaseTime" label="上映时间" :formatter="dateFormat"></el-table-column>

      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <el-button size="mini" @click="cnmviedeos(scope.row.id,scope.row.movieName)">影片演员</el-button>
          <el-button type="primary" size="mini" @click="handleAddmovieactor(scope.row.id,scope.row.movieName)">添加演员</el-button>
          <el-button type="primary" @click="handleEdit(scope.row.id,'dialogFormVisible','pojoForm')" size="mini" >详情</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="rows"
      :page-sizes="[10, 20, 50]"
      :page-size="page"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 弹出新增窗口 
        title 窗口的标题
        :visible.sync 当它true的时候，窗口会被弹出
    -->
    <el-dialog title="电影" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :model="movie"
      >
        <el-form-item label="电影名称" prop="movieName">
          <el-input v-model="movie.movieName"></el-input>
        </el-form-item>
        <el-form-item label="电影类型" prop="movieType">
          <el-input v-model="movie.movieType"></el-input>
        </el-form-item>
        <el-form-item label="影片产地" prop="location">
          <el-input v-model="movie.location"></el-input>
        </el-form-item>
        <el-form-item label="电影简介" prop="discription">
          <el-input type="textarea" v-model="movie.discription"></el-input>
        </el-form-item>
        <el-form-item label="电影海报" prop="file">
          <el-upload
            class="upload-demo"
            action="http://api.huangniuniu.com/api/upload/image"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="电影时长" prop="runningTime">
          <el-input v-model="movie.runningTime"></el-input>
        </el-form-item>
        <el-form-item label="上映时间" prop="releaseTime">
          <el-input v-model="movie.releaseTime"></el-input>
        </el-form-item>
        <el-form-item label="剧照" prop="file">
          <!-- <el-input v-model="pojo.name"></el-input> -->
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="预告片" prop="prevideo">
          <el-input v-model="movie.prevideo"></el-input>
        </el-form-item>

        <el-form-item label="评分" prop="score">
          <el-input v-model="movie.score"></el-input>
        </el-form-item>
        <el-form-item label="下架时间" prop="soldOutTime">
          <!-- value-format 是指定绑定值的格式 -->
          <el-date-picker
            style="width: 200px"
            value-format="yyyy-MM-dd"
            v-model="movie.soldOutTime"
            type="date"
            placeholder="请选择"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button
          type="primary"
          @click="movie.id === null ? addData('pojoForm'): updateData('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 为某电影院添加电影弹窗 -->
    <el-dialog title="添加演员" :visible.sync="movieActordlogFormVsb" width="500px">
      <el-form
        :rules="rules"
        ref="movieActorForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :model="movie_actor"
      >
        <el-form-item label="影片名" prop="cardNum">
          <el-input v-model="movie_actor.movieName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="演员名" prop="name">
          <el-select
                  v-model="movie_actor.actorid"
                  @change="select_handler_actor"
                  ref="selectActor"
                  value-key="id"
                  filterable
                  no-data-text="该演员不存在,请重输！"
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="remoteMethod"
                  :loading="loading">
            <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.actorName"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="movieActordlogFormVsb = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button
          type="primary"
          @click="addmovieActor('movieActorForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import memberApi from "@/api/member";

import Vue from 'vue'
export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      page: 1, // 当前页码
      rows: 10, // 每页显示10条数据,
      searchMap: {
        // 条件查询绑定的条件值
        movieName: "",
        movieType: "",
        location: ""
      },
      options: [],//存储电影搜索得到的后台数据
      loading: false,//是否开启远程搜索

      dialogFormVisible: false, //控制对话框
      movieActordlogFormVsb: false, //控制添加电影弹窗
      movie: {
        id: null,
        movieName: "",//电影名称
        movieType: "",//电影类型
        location: "",//电影产地
        discription: "",//电影简介
        moviePicture: '',//电影海报
        runningTime: '',//播放时长
        releaseTime: "",//上映时间
        stagePhotos: "",//剧照
        prevideo: '',//电影预览视频
        score: '',//评分
        soldOutTime: '' //下架时间

      }, // 提交的数据
      movie_actor: {
        id: null,
        actorid: null,
        movieid: null,
        actorName: '',
        movieName: ''
      }
    };
  },

  created() {
    // 初始化获取列表数据
    this.fetchData();
  },

  methods: {

    //时间格式化
    dateFormat(row){
      let t=new Date(row.releaseTime);//row 表示一行数据, updateTime 表示要格式化的字段名称
      return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate();
    },

    //输入电影名称时搜索电影
    remoteMethod(query) {//remote会被自动调用

      this.options = []
      console.log(query)
      if (query !== "") {//query为当前输入
        //是否正在从远程获取数据searchvalue
        this.loading = true;
        //此处更换为远程搜索结果数据，将远程结果赋值到options
        const that = this;
        this.$http.get("/movie/getActorByCondition",{
          params: {
            actorName: query
          }
        }).then(({data})=>{
          that.options = data.items;
          that.loading = false;
          //console.log(that.options)
        }).catch(()=>{
          console.log("查询报错了")
          that.loading = false;
        })
      }
    },

    //获取下拉的演员名称
    select_handler_actor() {
      Vue.nextTick(() => {
        this.movie_actor.actorName = this.$refs.selectActor.selected.label;
        this.movie_actor.actorid = this.$refs.selectActor.selected.value;
        //console.log('searchvalue'+this.searchvalue)
      });
    },

    //跳转到可查看某个电影院下的所有电影，即该影院的影库情况
    cnmviedeos(id,movieName) {
      //vuex存储电影信息
      this.$store.dispatch("getNewid",id)
      this.$store.dispatch("getNewMovieName",movieName)
      //页面跳转
      this.$router.push("/mvactors/");
    },
    // 当每页显示条数改变后,被触发 , val是最新的每页显示条数
    handleSizeChange(val) {
      // console.log(val)
      this.page = val;
      this.fetchData();
    },
    // 当页码改变后,被触发 , val 是最新的页面
    handleCurrentChange(val) {
      // console.log(val)
      this.rows = val;
      this.fetchData();
    },
    fetchData() {
      // 调用分页查询数据
      const that = this;
      this.$http.get("/movie/list",{
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
      this.$http.get("/movie/getMovieByCondition",{
        params: {
          movieName: this.searchMap.movieName,
          movieType: this.searchMap.movieType,
          location: this.searchMap.location,
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单
          console.log("addData");
          memberApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              //新增成功，刷新列表数据
              this.fetchData();
              this.dialogFormVisible = false; // 关闭窗口
            } else {
              // 失败，来点提示信息
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 弹出新增电影窗口
    handleAdd() {
      this.movie = {}
      this.dialogFormVisible = true;

    },
    //弹出添加演员
    handleAddmovieactor(movieid,movieName){
      //初始化
      this.movie_actor = {}
      this.movieActordlogFormVsb = true;
      //赋值
      this.movie_actor.movieid = movieid;
      this.movie_actor.movieName = movieName;
    },
    //添加演员
    addmovieActor(formName){
      const that = this;
      this.$refs[formName].validate(valid => {
        if(valid){
          this.$http({
            method:  'post',
            url: '/movie/addActorAndMovie',
            data:this.$qs.stringify(this.movie_actor)
          }).then(({data})=>{
            that.movieActordlogFormVsb = false // 关闭窗口
            that.$message({
              message: '添加演员成功',
              type: 'success'
            })
          }).catch(()=>{
            that.$message({
              message: '添加演员失败',
              type: 'warning'
            })
          })

        }else {
          return false
        }
      })
    },


    // 打开编辑窗口
    handleEdit(id, dfs, formName) {
      console.log("编辑", id);
      this.handleAdd(dfs, formName);
      memberApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
          console.log(this.pojo);
        }
      });
    },

    updateData(formName) {
      console.log("updateData");
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交更新
          memberApi.update(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              // 刷新列表
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 删除会员
    handleDelete(id) {
      const that = this
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(() => {
          // 确认
          this.$http.delete('/movie/delete/'+id)
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
        });
    }
  },


};
</script>