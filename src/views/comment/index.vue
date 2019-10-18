<template>
    <div>
        <!-- :inline="true" 表单一行显示 -->
        <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
            <el-form-item prop="nickname">
                <el-input v-model="searchMap.nickname" placeholder="输入昵称搜索" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="movieName">
                <el-input v-model="searchMap.movieName" placeholder="输入电影名搜索" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="commentWords">
                <el-input v-model="searchMap.commentWords" placeholder="输入评论内容搜索" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="checkquery" >查询</el-button>
                <!-- <el-button type="primary" @click="handleAdd" >新增</el-button> -->
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
            <el-table-column prop="movieName" label="电影名称" ></el-table-column>
            <el-table-column prop="nickname" label="用户昵称" ></el-table-column>
            <el-table-column prop="score" label="评分" width="90"></el-table-column>
            <el-table-column prop="commentTime" label="评论时间" :formatter="dateFormat"></el-table-column>
            <!-- <el-table-column prop="money" label="开卡金额" ></el-table-column>
            <el-table-column prop="payType" label="支付类型" >
                <template slot-scope="scope">
                    <span>{{scope.row.payType | payTypeFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="会员地址" ></el-table-column> -->
            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.row.id)">详情</el-button>
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
        <el-dialog title="评论详情" :visible.sync="dialogFormVisible" width="500px">
            <el-form
                    ref="pojoForm"
                    label-width="100px"
                    label-position="right"
                    style="width: 400px;"
                    :model="comment">
                <el-form-item label="电影名" prop="movieName" >
                    <el-input v-model="comment.movieName" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="nickname" >
                    <el-input v-model="comment.nickname" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="评分" prop="score" >
                    <el-input v-model="comment.score" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="评论时间" prop="commentTime" >
                    <el-input v-model="comment.commentTime" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="评论内容" prop="commentWords">
                    <el-input type="textarea" v-model="comment.commentWords" :readonly="true"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
                searchMap: { // 条件查询绑定的条件值
                    commentWords: '',
                    movieName: '',
                    nickname: ''
                },

                dialogFormVisible: false, //控制对话框

                comment: {
                    id: null,
                    score: 0,
                    commentWords: '',
                    commentTime: null,
                    userid: 0,
                    movieid: 0,
                    movieName: '',
                    nickname: '',
                }, // 提交的数据
            }
        },

        created() {
            // 初始化获取列表数据
            this.fetchData()
        },

        methods: {
            //时间格式化
            dateFormat(row){
                let t=new Date(row.commentTime);//row 表示一行数据, updateTime 表示要格式化的字段名称
                return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes();
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
                this.$http.get("/comment/Commentstopage",{
                    params:{
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
            checkquery(){
              this.pageNumber = 1;
              this.conditionquery();
            },
            conditionquery(){
                //判断cookie是否存在
                const token = this.$cookie.get("Huangniuniu_TOKEN");
                if(token) {
                const that = this;
                this.$http.get("/comment/Commentstopage",{
                    params:{
                        commentWords: this.searchMap.commentWords,
                        movieName: this.searchMap.movieName,
                        nickname: this.searchMap.nickname
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
                console.log('重置', formName)
                // 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效
                this.$refs[formName].resetFields()
            },

            //查看详细
            handleEdit(id){
                console.log(id)
                const that = this;
                //格式化评论时间
                this.$http.get("/comment/comment/"+id).then(({data})=>{
                    console.log(data.movieName)
                    that.comment = data
                    that.comment.commentTime = that.dateFormat(data)
                    console.log(that.movieName+"66666")
                })
                this.dialogFormVisible = true
            },
            // 删除评论
            handleDelete(id) {
                //判断cookie是否存在
                const token = this.$cookie.get("Huangniuniu_TOKEN");
                if(token) {
                const that = this;
                this.$confirm('确认删除这条记录吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {
                    // 确认
                    console.log('确认')
                    this.$http.delete('/comment/'+id).then(()=>{
                        that.fetchData()
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                    }).catch(()=>{
                        this.$message({
                            message: '删除失败',
                            type: 'warning'
                        })
                    })
                }).catch(() => {
                    // 取消，不用理会
                    console.log('取消')
                })
                }else{
                    //跳转登录页
                    this.$router.push('/login/')
                }
            },
        },

        filters: {
            //payTypeFilter (type) {
            /* payTypeOptions.find(obj => {
                return obj.type === type
            }) */
            // 在过滤 器当中不能引用当前实例 this   this.payTypeOptions 错误的
            //const payObj = payTypeOptions.find(obj => obj.type === type)
            // return payObj ? payObj.name : null
            //}
        }
    }
</script>