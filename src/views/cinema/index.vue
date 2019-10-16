<template>
    <div>
        <!-- :inline="true" 表单一行显示 -->
        <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
            <el-form-item prop="cinemaName">
                <el-input v-model="searchMap.cinemaName" placeholder="输入电影院名称搜索" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="cinemaAddress">
                <el-input v-model="searchMap.cinemaAddress" placeholder="输入电影院地址搜索" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="clickquery" >查询</el-button>
                 <el-button type="primary" @click="handleAdd('edit_dialogFormVisible')" >新增</el-button>
                <el-button  @click="resetForm('searchForm')" >重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据列表
        :data 绑定渲染的数据
        border 表格边框
         -->
         <el-table
            :data="list"
            height="500"
            border
            style="width: 100%;text-align:center">
            <!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="cinemaName" label="影院名" width="250"></el-table-column>
            <el-table-column prop="cinemaAddress" label="地址" ></el-table-column>
             <el-table-column label="操作" width="350">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="cnmviedeos(scope.row.id,scope.row.cinemaName)">影片库</el-button>
                    <el-button type="primary" size="mini" @click="handleAddMovie('addMovie_dialogFormVisible',scope.row.id,scope.row.cinemaName)">添加影片</el-button>
                    <el-button type="primary" @click="handleEdit(scope.row)" size="mini" >编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row.id)">删除</el-button>
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
            :total="total">
        </el-pagination>

        <!-- 弹出新增窗口 
        title 窗口的标题
        :visible.sync 当它true的时候，窗口会被弹出
        -->
        <el-dialog :title="dailogTitleType" :visible.sync="edit_dialogFormVisible" width="600px">
            <el-form
                    :rules="rules"
                    ref="editForm"
                    label-width="180px"
                    label-position="right"
                    style="width: 500px;"
                    :model="cinema">
                <el-form-item label="影院名" prop="cinemaName" >
                    <el-input v-model="cinema.cinemaName" ></el-input>
                </el-form-item>
                <el-form-item label="所在城市" prop="cityid" >
                    <el-select v-model="cinema.cityid" ref="selectCity"
                               @change="select_handler_city" @click.native="clearCityNameShow()" filterable placeholder="请选择">{{CityNameShow}}
                        <!-- 不要忘记 CityOptions 绑定到data中 -->
                        <el-option v-for="option in CityOptions"
                                   :key="option.id"
                                   :label="option.cityName"
                                   :value="option.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="详细地址(从区/县开始)" prop="cinemaAddress">
                    <el-input v-model="cinema.cinemaAddress"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="edit_dialogFormVisible = false">取 消</el-button>
                <!-- <el-button type="primary" @click="addData('cinemaForm')">确 定</el-button> -->
                <el-button type="primary" @click="cinema.id == null ? addData('editForm') : updateData('editForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 为某电影院添加电影弹窗 -->
        <el-dialog title="添加电影" :visible.sync="addMovie_dialogFormVisible" width="500px">
            <el-form
                    :rules="rulesMovie"
                    ref="movieForm"
                    label-width="100px"
                    label-position="right"
                    style="width: 400px;"
                    :model="cinema_movie">
                <el-form-item label="影院名" prop="cinemaName" >
                    <el-input v-model="cinema_movie.cinemaName" readonly></el-input>
                </el-form-item>
                <el-form-item label="电影名称" prop="movieid" >
                    <el-select
                            v-model="cinema_movie.movieid"
                            @change="select_handler_movie"
                            ref="selectMovie"
                            value-key="id"
                            filterable
                            no-data-text="该电影不存在,请重输！"
                            remote
                            reserve-keyword
                            placeholder="请输入关键词"
                            :remote-method="remoteMethod"
                            :loading="loading">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.movieName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addMovie_dialogFormVisible = false">取 消</el-button>
                <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
                <el-button type="primary" @click="addMovie('movieForm')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
    
</template>

<script>
import Vue from 'vue'

export default {
    
    data() {
        return {
            list: [],
            total: 0, // 总记录数
            pageNumber: 1, // 当前页码
            pageSize: 10, // 每页显示10条数据,
            searchMap: { // 条件查询绑定的条件值
                cinemaName: '',
                cinemaAddress: ''
            },
            //searchvalue: '',

            options: [],//存储电影搜索得到的后台数据
            loading: false,//是否开启远程搜索

            //add_dialogFormVisible: false,
            edit_dialogFormVisible: false,//添加、修改电影院弹框
            addMovie_dialogFormVisible:false,//添加电影弹框

            dailogTitleType: '',//动态显示弹框标题

            CityName: '',//存储城市名称
            CityNameShow: '',//在修改时做数据回显用
            CityOptions: [],//城市列表

            dialogFormVisible: false, //控制对话框
            dlogFormVsb:false,//控制添加电影弹窗
            cinema: {
                id: null,
                cinemaName: '',
                cinemaAddress: '',
                cityid: ''
            }, // 提交的数据
            cinema_movie: {
                id: null,
                cinemaid: null,
                movieid: null,
                cinemaName: '',
                movieName: ''
            },
            rules: { // 校验电影院规则
                cinemaName: [
                    {required: true, message: '电影院名称不能为空', trigger: 'blur'}
                ],
                cityid: [
                    {required: true, message: '请选择所在城市', trigger: 'change'}
                ],
                cinemaAddress: [
                    {required: true, message: '详细地址不能为空', trigger: 'blur'}
                ]
            },
            rulesMovie: {//校验电影规则
                movieid: [
                    {required: true, message: '请选择电影', trigger: 'change'}
                ],
            }
        }
    },

    created() {
        // 初始化获取列表数据
        //this.fetchData()
        this.conditionquery();
    },

    methods: {

        //输入电影名称时搜索电影
        remoteMethod(query) {//remote会被自动调用

            this.options = []
            console.log(query)
            if (query !== "") {//query为当前输入
                //是否正在从远程获取数据searchvalue
                this.loading = true;
                //此处更换为远程搜索结果数据，将远程结果赋值到options
                const that = this;
                this.$http.get("/movie/getMovieByCondition",{
                    params: {
                        movieName: query
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


        //添加电影的弹框
        handleAddMovie(dfs,cinemaid,cinemaName) {
            //console.log(dfs)
            //const that = this;
            //清除数据
            this.cinema_movie = {}
            if(dfs==='addMovie_dialogFormVisible'){
                this.addMovie_dialogFormVisible = true
                this.cinema_movie.cinemaid = cinemaid
                this.cinema_movie.cinemaName = cinemaName
            }

        },

        //获取下拉的电影名称
        select_handler_movie() {
            Vue.nextTick(() => {
                this.cinema_movie.movieName = this.$refs.selectMovie.selected.label;
                this.cinema_movie.movieid = this.$refs.selectMovie.selected.value;
                //console.log('searchvalue'+this.searchvalue)
            });
        },
        //添加电影
        addMovie(formName){
            const that = this;
            //console.log('updateData')
            this.$refs[formName].validate(valid => {
                if(valid){
                    this.$http({
                        method:  'post',
                        url: '/cinema/cinemaMovie/',
                        data:this.$qs.stringify(this.cinema_movie)
                    }).then(({data})=>{
                        that.addMovie_dialogFormVisible = false // 关闭窗口
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

                }else {
                    return false
                }
            })
        },

        //获取下拉的城市名称
        select_handler_city() {
            Vue.nextTick(() => {
                //console.log(this.$refs.selectCity.selectedLabel);
                //console.log(this.$refs.selectCity.selected.label);
                this.CityName = this.$refs.selectCity.selected.label;
            });
        },
        //点击下拉城市时，清除回显城市数据
        clearCityNameShow(){
            console.log('CityNameShow'+this.CityNameShow)
            this.CityNameShow = ''
        },


        //跳转到可查看某个电影院下的所有电影，即该影院的影库情况
        cnmviedeos(id,cinemaName){
            this.$store.dispatch("getNewid",id)
            this.$store.dispatch("getNewcinemaName",cinemaName)
            //console.log(cinemaName)
            this.$router.push('/cnmvideos/')
            //给电影院里面的电影传递电影院id和电影院名称
            //this.$bus.$emit("CinemaMovieEvent",{id:id,cinemaName:cinemaName})
        },
        // 当每页显示条数改变后,被触发 , val是最新的每页显示条数
        handleSizeChange(val) {
            // console.log(val)
            this.pageSize = val
            this.conditionquery()
        },
        // 当页码改变后,被触发 , val 是最新的页面
        handleCurrentChange(val) {
            // console.log(val)
            this.pageNumber = val
            this.conditionquery()
        },
        fetchData() {
            const that = this;
            this.$http.get("/cinema/listPage",{
                params: {
                    pageSize: this.pageSize,
                    pageNumber: this.pageNumber
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
            const that = this;
            this.$http.get("/cinema/listConditionPage",{
                params: {
                    cinemaName: this.searchMap.cinemaName,
                    cinemaAddress: this.searchMap.cinemaAddress,
                    pageSize: this.pageSize,
                    pageNumber: this.pageNumber
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
            console.log('重置', formName)
            // 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效
            this.$refs[formName].resetFields()
        },
        // 提交新增数据
        addData(formName) {
            const that = this;
            this.$refs[formName].validate(valid => {
                if(valid){
                    //提交表单
                    //console.log(this.CityName)
                    //在详细地址前面加上城市名称
                    this.cinema.cinemaAddress = this.CityName + this.cinema.cinemaAddress;
                    this.$http({
                        method:  'post',
                        url: '/cinema',
                        data:this.$qs.stringify(this.cinema)
                    }).then(({data})=>{
                        //新增成功，刷新列表数据
                        that.fetchData()
                        that.cinema = {}
                        that.CityName=''
                        //that.add_dialogFormVisible = false // 关闭窗口
                        that.edit_dialogFormVisible = false
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
                }else {
                    return false
                }
            })
        },
        // 弹出新增窗口
        handleAdd(dfs) {
            //console.log(dfs)
            const that = this;
            //清除数据
            that.cinema = {}
            that.CityName=''
            that.CityNameShow=''
            if(dfs==='edit_dialogFormVisible'){
                this.dailogTitleType = '添加电影院'
                this.edit_dialogFormVisible = true,
                //并且加载城市数据
                this.$http.get("/city/list").then(({data})=>{
                    that.CityOptions = data
                }).catch(()=>{

                })
            }
            
        },
        
        // 打开编辑窗口
        handleEdit(row) {
            const that = this;
            //清除数据
            that.cinema = {}
            that.CityName=''
            that.CityNameShow=''

            this.dailogTitleType = '修改电影院'
              //并且加载城市数据
             this.$http.get("/city/list").then(({data})=>{
                 that.CityOptions = data
               })
            //查询该电影院信息,传递id，发送请求
            /*this.$http.get("/cinema/id/"+id).then(({data})=>{
                that.cinema = data
                //查询该电影院的城市名称
                this.$http.get("/city/"+that.cinema.cityid).then(({data})=>{
                    that.CityName = data.cityName
                    that.CityNameShow = data.cityName
                    //console.log(that.cinema)
                    //去除掉详细地址的城市名称
                    that.cinema.cinemaAddress = that.cinema.cinemaAddress.replace(that.CityName,'')
                    //console.log(that.cinema.cinemaAddress)
                })
            })*/
            //直接将row的数据赋值给cinema
            this.cinema = row;
            //查询该电影院的城市名称
            this.$http.get("/city/"+that.cinema.cityid).then(({data})=>{
                that.CityName = data.cityName
                that.CityNameShow = data.cityName
                //console.log(that.cinema)
                //去除掉详细地址的城市名称
                that.cinema.cinemaAddress = that.cinema.cinemaAddress.replace(that.CityName,'')
                //console.log(that.cinema.cinemaAddress)
            })

            this.edit_dialogFormVisible = true
        },

        updateData(formName) {
            const that = this;
            //console.log('updateData')
            this.$refs[formName].validate(valid => {
                if(valid){
                    //在详细地址前面加上城市名称
                    this.cinema.cinemaAddress = this.CityName + this.cinema.cinemaAddress;
                    this.$http({
                        method:  'put',
                        url: '/cinema',
                        data:this.$qs.stringify(this.cinema)
                    }).then(({data})=>{
                        //新增成功，刷新列表数据
                        that.fetchData()
                        that.edit_dialogFormVisible = false // 关闭窗口
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

                }else {
                    return false
                }
            })
        },
        // 删除电影院
        handleDelete(id) {
            const that = this;
            this.$confirm('确认删除这条记录吗？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
            }).then(() => {
                this.$http.delete('/cinema/'+id)
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
        },
    },


}
</script>