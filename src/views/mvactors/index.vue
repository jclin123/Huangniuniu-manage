<template>
    <div>
        <!-- :inline="true" 表单一行显示 -->
        <el-form ref="searchForm" :inline="true" style="margin-top: 20px">
            <el-form-item>
                <el-button  @click="turnBack()" >返回上一页</el-button>
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
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="actorName" label="演员名称"></el-table-column>
             <el-table-column prop="actorPicture" label="头像">
                 <template slot-scope="scope">
                     <div class="demo-image__preview">
                         <el-image style="width: 100px; height: 100px" :src="scope.row.actorPicture"></el-image>
                     </div>
                 </template>
             </el-table-column>
            <!-- <el-table-column prop="address" label="会员地址" ></el-table-column> -->
             <el-table-column label="操作" width="150">
                <template slot-scope="scope">
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
            :current-page="currentPage"
            :page-sizes="[10, 20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

    </div>
    
</template>

<script>

export default {
    
    data() {
        return {
            list: [],
            total: 0, // 总记录数
            currentPage: 1, // 当前页码 
            pageSize: 10, // 每页显示10条数据,

            movie_actor: {
                id: null,
                actorid: null,
                movieid: null,
                actorName: '',
                movieName: ''
            }
        }
    },

    created() {
        // 初始化获取列表数据
        this.movie_actor.movieid = this.$store.state.id;
        //this.movie_actor.movieName = this.$store.state.movieName;
        this.fetchData()
    },

    methods: {
        //返回上一页
        turnBack(){
            this.$router.back();
        },
        // 当每页显示条数改变后,被触发 , val是最新的每页显示条数
        handleSizeChange(val) {
            // console.log(val)
            this.pageSize = val
            this.fetchData()
        },
        // 当页码改变后,被触发 , val 是最新的页面
        handleCurrentChange(val) {
            // console.log(val)
            this.currentPage = val
            this.fetchData()
        },

        fetchData() {
            //判断cookie是否存在
            const token = this.$cookie.get("Huangniuniu_TOKEN");
            if(token) {
            const that = this;
            this.$http.get("/movie/getActorByMovieid/"+that.movie_actor.movieid,{
                params: {
                    rows: this.pageSize,
                    page: this.currentPage
                }
            }).then(({data})=>{
                that.list = data.items;
                that.total = data.total;
                console.log(that.list)
            }).catch(()=>{
                that.list = [];
                that.total = 0;
            })
            }else {
                //跳转登录页
                this.$router.push('/login/')
            }
        },

        // 删除该电影的演员
        handleDelete(actorid) {
            //判断cookie是否存在
            const token = this.$cookie.get("Huangniuniu_TOKEN");
            if(token) {
            const that = this
            this.$confirm('确认删除这条记录吗？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
            }).then(() => {
                //封装actorid
                that.movie_actor.actorid = actorid;

                //获得该中间表记录
                this.$http.get("/movie/getactorMovie",{
                    params: {
                        actorid: that.movie_actor.actorid,
                        movieid: that.movie_actor.movieid
                    }
                }).then(({data})=>{
                    console.log(data)
                    this.$http.delete('/movie/deleteOne/'+data.id)
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

            }).catch(() => {
                // 取消，不用理会
                console.log('取消')
            })
            }else {
                //跳转登录页
                this.$router.push('/login/')
            }
        },
    },


}
</script>