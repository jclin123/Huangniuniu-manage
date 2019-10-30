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
      <el-table-column prop="movieName" label="电影名称" width="250"></el-table-column>
      <el-table-column prop="movieType" label="类型" width="150"></el-table-column>
      <el-table-column prop="location" label="影片产地" width="150"></el-table-column>
      <el-table-column prop="score" label="评分" width="70"></el-table-column>
      <el-table-column prop="releaseTime" label="上映时间" :formatter="dateFormat" width="130"></el-table-column>

      <el-table-column label="操作" width="450">
        <template slot-scope="scope">
          <el-button size="mini" @click="cnmviedeos(scope.row.id,scope.row.movieName)">影片演员</el-button>
          <el-button type="primary" size="mini" @click="handleAddmovieactor(scope.row.id,scope.row.movieName)">添加演员</el-button>
          <el-button size="mini" type="primary" @click="handleedit(scope.row)">编辑</el-button>
          <el-button type="primary" @click="handledetail(scope.row)" size="mini" >详情</el-button>
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
    <el-dialog :title="dailogTitleType" :visible.sync="dialogFormVisible" width="700px">
      <el-form
        :rules="rules"
        ref="movieForm"
        label-width="150px"
        label-position="right"
        style="width: 550px;"
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
          <el-input type="textarea" :rows="6" v-model="movie.discription"></el-input>
        </el-form-item>
        <el-form-item label="电影海报" prop="file">
          <el-upload
                  class="upload-demo"
                  action="http://api.huangniuniu.com/api/upload/image"
                  :limit="1"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove1"
                  :on-change="fileChange"
                  :on-success="successfun1"
                  :file-list="fileList1"
                  ref="nowUpload"
                  list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="电影时长(单位:分钟)" prop="runningTime">
          <el-input v-model="movie.runningTime"></el-input>
        </el-form-item>
        <el-form-item label="上映时间" prop="releaseTime">
          <el-date-picker
                  style="width: 200px"
                  value-format="yyyy-MM-dd"
                  v-model="movie.releaseTime"
                  type="date"
                  placeholder="请选择"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="剧照" prop="file">
          <!-- <el-input v-model="pojo.name"></el-input> -->
          <el-upload
                  class="upload-demo"
                  action="http://api.huangniuniu.com/api/upload/image"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove2"
                  :on-change="fileChange"
                  :on-success="successfun2"
                  :file-list="fileList2"
                  ref="nowUpload"
                  list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="预告片" prop="file" class="video-upload">
          <!-- action必选参数, 上传的地址 -->
          <el-upload class="avatar-uploader el-upload--text"
                     action="http://api.huangniuniu.com/api/upload/image"
                     :show-file-list="false"
                     :on-success="handleVideoSuccess"
                     :before-upload="beforeUploadVideo"
                     accept='.mp4,.ogg,.flv,.avi'
                     >
            <video
                    v-if="movie.prevideo !='' && videoFlag == false"
                    :src="movie.prevideo"
                    width="200"
                    height="180"
                    controls="controls"
            >您的浏览器不支持视频播放</video>    <!--视频上传成功之后显示-->
            <i
                    v-else-if="movie.prevideo =='' && videoFlag == false"
                    class="el-icon-plus avatar-uploader-icon"
            ></i>            <!--没选择视频之前显示-->
            <el-progress
                    v-if="videoFlag == true"
                    type="circle"
                    :percentage="videoUploadPercent"
                    style="margin-top:30px"
            ></el-progress>    <!--如果视频正在上传的时候显示-->
            <el-button class="video-btn"
                       slot="trigger"
                       size="small"
                       v-if="!isShowUploadVideo"
                       type="primary">选取文件</el-button>
          </el-upload>
          <P class="text">请保证视频格式正确，且不超过10M</P>
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
          @click="movie.id == null ? addmovie('movieForm') : editmovie('movieForm')"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!--电影详情-->
    <el-dialog title="电影详情" :visible.sync="dialogdetail" width="700px">
      <el-form
              ref="movieForm"
              label-width="150px"
              label-position="right"
              style="width: 550px;"
              action=""
              :model="movie"
      >
    <el-form-item label="电影名称" prop="movieName">
      <el-input v-model="movie.movieName" :readonly="true"></el-input>
    </el-form-item>
    <el-form-item label="电影类型" prop="movieType">
      <el-input v-model="movie.movieType" :readonly="true"></el-input>
    </el-form-item>
    <el-form-item label="影片产地" prop="location">
      <el-input v-model="movie.location" :readonly="true"></el-input>
    </el-form-item>
    <el-form-item label="电影简介" prop="discription">
      <el-input type="textarea" :rows="6" v-model="movie.discription" :readonly="true"></el-input>
    </el-form-item>
    <el-form-item label="电影海报" prop="file">
      <el-upload
              class="upload-demo"
              :limit="1"
              :file-list="fileList1"
              action=""
              ref="nowUpload"
              list-type="picture"
              :disabled="true"
      >
      </el-upload>
    </el-form-item>
    <el-form-item label="电影时长(单位:分钟)" prop="runningTime">
      <el-input v-model="movie.runningTime" :readonly="true"></el-input>
    </el-form-item>
    <el-form-item label="上映时间" prop="releaseTime">
      <el-input v-model="movie.releaseTime" :readonly="true"></el-input>
    </el-form-item>
    <el-form-item label="剧照" prop="file">
      <!-- <el-input v-model="pojo.name"></el-input> -->
      <el-upload
              class="upload-demo"
              :file-list="fileList2"
              ref="nowUpload"
              list-type="picture"
              action=""
              :disabled="true"
      >
      </el-upload>
    </el-form-item>
    <el-form-item label="预告片" prop="file" class="video-upload">
      <!-- action必选参数, 上传的地址 -->
      <video :src="movie.prevideo" controls="controls" style="width: 200px">
      </video>
    </el-form-item>

        <el-form-item label="下架时间" prop="releaseTime">
          <el-input v-model="movie.soldOutTime" :readonly="true"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogdetail = false">关闭</el-button>
      <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
    </div>
    </el-dialog>

    <!-- 为某电影院添加演员弹窗 -->
    <el-dialog title="添加演员" :visible.sync="movieActordlogFormVsb" width="500px">
      <el-form
        ref="movieActorForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :model="movie_actor"
      >
        <el-form-item label="影片名" prop="movieName">
          <el-input v-model="movie_actor.movieName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="演员名" prop="actorName">
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

import Vue from 'vue'
export default {
  data() {
    return {
      dialogdetail: false,//电影详情弹框
      fileList1: [],//电影海报，取第一个
      fileList2: [],//电影剧照，多个图片
      list: [],
      total: 0, // 总记录数
      pageNumber: 1, // 当前页码
      pageSize: 10, // 每页显示10条数据,
      searchMap: {
        // 条件查询绑定的条件值
        movieName: "",
        movieType: "",
        location: ""
      },
      dailogTitleType: '',//动态显示电影弹框标题
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
      },
      videoFlag: false,
      videoUploadPercent: 0,
      isShowUploadVideo: false, //显示上传按钮

      rules: { // 校验电影规则
        movieName: [
          {required: true, message: '电影名称不能为空', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符'}
        ],
        movieType: [
          {required: true, message: '请填写电影类型', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符'}
        ],
        location: [
          {required: true, message: '请填写电影产地', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符'}
        ],
        discription: [
          {required: true, message: '电影简介不能为空', trigger: 'blur'},
          {min: 2, max: 200, message: '长度在 2 到 200 个字符'}
        ],
        runningTime: [
          {required: true, message: '请正确填写电影播放时长', trigger: 'blur'}
        ]

      },
    };
  },

  created() {
    // 初始化获取列表数据
    this.conditionquery();
  },

  methods: {
    //电影详情
    handledetail(row){
      this.movie = {};
      this.movie = row;
      this.fileList1 =[];
      this.fileList2 = [];
      this.fileList1.push({"url" : this.movie.moviePicture});
      if(this.movie.stagePhotos) {
        const files = this.movie.stagePhotos.split(",");
        for (let i = 0; i < files.length; i++) {
          this.fileList2.push({"url": files[i]});
        }
      }
      //this.fileList2.push() = this.movie.stagePhotos;
      this.dialogdetail = true;
    },

    //图片上传成功，海报
    successfun1(response, file, fileList){
      this.fileList1.push({'url':file.response});
    },
    //剧照
    successfun2(response, file, fileList){
      //console.log(JSON.stringify(response))
      //console.log("success"+JSON.stringify(file))
      this.fileList2.push({'uid':file.uid , 'url':file.response});
    },

    //图片参数设置
    fileChange(file) {
      const typeArr = ["image/png", "image/jpeg", "image/jpg"];
      const isJPG = typeArr.indexOf(file.raw.type) !== -1;//-1时候代表false
      // image/png, image/jpeg, image/gif, image/jpg
      const isLt10M = file.size / 1024 / 1024 < 30;//图片必须少于10M

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

    //视频设置
    beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024  < 30;
      if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
        this.$message.error('请上传正确的视频格式');
        return false;
      }
      if (!isLt10M) {
        this.$message.error('上传视频大小不能超过20MB哦!');
        return false;
      }
    },

    //视频上传进度显示：
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = parseInt(file.percentage);
      //this.videoUploadPercent = file.percentage.toFixed(0);
    },

    //视频上传成功
    handleVideoSuccess(res, file) {                               //获取上传图片地址
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      //console.log(res)
      if(res.toString().startsWith("http")){
        this.isShowUploadVideo = true
        //this.videoForm.videoUploadId = res.data.uploadId;
        this.movie.prevideo = res;
        //console.log(res)
      }else{
        this.$message.error('视频上传失败，请重新上传！');
      }
    },

    handlePreview(){

    },
    //删除海报
    handleRemove1(file, fileList){
      //this.actor.actorPicture = '';
      this.fileList1 = []
    },
    //删除剧照
    handleRemove2(file, fileList){
      //this.actor.actorPicture = '';
      //console.log("delete"+JSON.stringify(file))
      this.fileList2.splice(this.fileList2.findIndex(item => item.uid === file.id), 1)
    },


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
      this.pageSize = val;
      this.conditionquery();
    },
    // 当页码改变后,被触发 , val 是最新的页面
    handleCurrentChange(val) {
      // console.log(val)
      this.pageNumber = val;
      this.conditionquery();
    },
    fetchData() {
      // 调用分页查询数据
      const that = this;
      this.$http.get("/movie/list",{
        params: {
          rows: this.pageSize,
          page: this.pageNumber
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
      this.pageNumber = 1;//初始化从第一页开始
      this.conditionquery();
    },

    //条件查询用户信息
    conditionquery(){
      //判断cookie是否存在
      const token = this.$cookie.get("Huangniuniu_TOKEN");
      if(token) {
      const that = this;
      this.$http.get("/movie/getMovieByCondition",{
        params: {
          movieName: this.searchMap.movieName,
          movieType: this.searchMap.movieType,
          location: this.searchMap.location,
          rows: this.pageSize,
          page: this.pageNumber
        }
      }).then(({data})=>{
        that.list = data.items;
        that.total = data.total;
      }).catch(()=>{
        that.list = [];
        that.total = 0;
      })
      }else{
        //跳转登录页
        this.$router.push('/login/')
      }
    },

    //重置
    resetForm(formName) {
      console.log("重置", formName);
      // 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效
      this.$refs[formName].resetFields();
    },

    // 弹出新增电影窗口
    handleAdd() {
      this.movie = {};
      this.fileList1 = [];
      this.fileList2 = [];
      this.dialogFormVisible = true;

      this.videoFlag=false;
      this.videoUploadPercent=0;
      this.isShowUploadVideo=false;

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
      //判断cookie是否存在
      const token = this.$cookie.get("Huangniuniu_TOKEN");
      if(token) {
      const that = this;
      this.$refs[formName].validate(valid => {
        if(valid){
          this.$http({
            method:  'post',
            url: '/movie/addActorAndMovie',
            data:this.$qs.stringify(this.movie_actor)
          }).then(({data})=>{
            //that.movieActordlogFormVsb = false // 关闭窗口
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
      }else{
        //跳转登录页
        this.$router.push('/login/')
      }
    },

    //弹出编辑电影框
    handleedit(row){
      this.movie = {};
      this.movie.prevideo ='';
      this.fileList1 = [];
      this.fileList2 = [];
      this.movie = row;
      //给图片回显
      this.fileList1.push({"url" : this.movie.moviePicture});
      if(this.movie.stagePhotos) {
        const files = this.movie.stagePhotos.split(",");
        for (let i = 0; i < files.length; i++) {
          this.fileList2.push({"uid": files[i],"url": files[i]});
        }
      }

      this.dialogFormVisible = true;

      this.videoFlag = false;
      this.videoUploadPercent = 0;
      this.isShowUploadVideo=true;
    },

    //添加电影
    addmovie(formName){
      //判断cookie是否存在
      const token = this.$cookie.get("Huangniuniu_TOKEN");
      if(token) {
      const that = this;
      this.$refs[formName].validate(valid => {
        if(valid){
          this.movie.moviePicture = ''
          this.movie.stagePhotos = ''
          //封装图片地址
          this.movie.moviePicture = this.fileList1[0].url;//电影海报
          for(let i = 0,flag=0; i<this.fileList2.length; i++){
            ++flag;
            if(this.fileList2.length != flag){
              this.movie.stagePhotos = this.movie.stagePhotos + this.fileList2[i].url + ",";
            }else{
              this.movie.stagePhotos = this.movie.stagePhotos + this.fileList2[i].url;
            }
          }
          console.log(this.movie.stagePhotos)
          this.$http({
            method:  'post',
            url: '/movie/insert',
            data:this.$qs.stringify(this.movie)
          }).then(({data})=>{
            that.conditionquery()
            that.dialogFormVisible = false // 关闭窗口
            that.$message({
              message: '添加电影成功',
              type: 'success'
            })
          }).catch(()=>{
            that.$message({
              message: '添加电影失败',
              type: 'warning'
            })
          })

        }else {
          return false
        }
      })
      }else{
        //跳转登录页
        this.$router.push('/login/')
      }
    },

    //编辑电影
    editmovie(formName){
      //判断cookie是否存在
      const token = this.$cookie.get("Huangniuniu_TOKEN");
      if(token) {
        const that = this;
        this.$refs[formName].validate(valid => {
          if(valid){
            this.movie.moviePicture = ''
            this.movie.stagePhotos = ''
            //封装图片地址
            this.movie.moviePicture = this.fileList1[0].url;//电影海报
            for(let i = 0,flag=0; i<this.fileList2.length; i++){
              ++flag;
              if(this.fileList2.length != flag){
                this.movie.stagePhotos = this.movie.stagePhotos + this.fileList2[i].url + ",";
              }else{
                this.movie.stagePhotos = this.movie.stagePhotos + this.fileList2[i].url;
              }
            }
           // console.log(this.movie.stagePhotos)
            this.$http({
              method:  'put',
              url: '/movie/update',
              data:this.$qs.stringify(this.movie)
            }).then(({data})=>{
              that.conditionquery()
              that.dialogFormVisible = false // 关闭窗口
              that.$message({
                message: '修改电影成功',
                type: 'success'
              })
            }).catch(()=>{
              that.$message({
                message: '修改电影失败',
                type: 'warning'
              })
            })

          }else {
            return false
          }
        })
      }else{
        //跳转登录页
        this.$router.push('/login/')
      }
    },



    // 删除电影
    handleDelete(id) {
      //判断cookie是否存在
      const token = this.$cookie.get("Huangniuniu_TOKEN");
      if(token) {
      const that = this
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(() => {
          // 确认
          this.$http.delete('/movie/delete/'+id)
                  .then(()=>{
                    that.conditionquery()
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