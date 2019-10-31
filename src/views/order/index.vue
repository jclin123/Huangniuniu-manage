<template>
    <div>
        <!-- :inline="true" 表单一行显示 -->
        <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
            <el-form-item prop="movieName">
                <el-input v-model="searchMap.movieName" placeholder="输入电影名" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="cinemaName">
                <el-input v-model="searchMap.cinemaName" placeholder="请输入影院名" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="orderNum">
                <el-input v-model="searchMap.orderNum" placeholder="请输入购票数量" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="clickquery" >查询</el-button>
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
             <el-table-column prop="id" label="订单号" width="180"></el-table-column>
            <el-table-column prop="orderNum" label="购票数" width="60"></el-table-column>
            <el-table-column prop="orderTime" label="下单时间" :formatter="timeFormat" width="150"></el-table-column>
            <el-table-column prop="nickname" label="昵称" ></el-table-column>
             <el-table-column prop="roomName" label="影厅名"></el-table-column>
             <!--<el-table-column prop="showDate" label="上映时间" :formatter="dateFormat"></el-table-column>-->
             <el-table-column prop="cinemaName" label="影院名称"></el-table-column>
             <el-table-column prop="movieName" label="电影名称"></el-table-column>
             <el-table-column prop="totalPrice" label="总价" ></el-table-column>
             <el-table-column label="操作">
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
                :current-page="pageNumber"
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
            pageNumber: 1, // 当前页码
            pageSize: 10, // 每页显示10条数据,
            searchMap: { // 条件查询绑定的条件值
                cinemaName: '',
                movieName: '',
                orderNum: ''
            }, 

            dialogFormVisible: false, //控制对话框

        }
    },

    created() {
        // 初始化获取列表数据
        this.fetchData()
    },

    methods: {
        //时间格式化
        timeFormat(row){
            let date = new Date(row.orderTime)
            let year = date.getFullYear();
            let month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
            let day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
            let hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
            let minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
            //let second =date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            // 拼接
            return year+"-"+month+"-"+day+" "+hours+":"+minutes;

        },
        dateFormat(row){
            let date = new Date(row.showDate)
            let year = date.getFullYear();
            let month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
            let day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
            let hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
            let minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
            //let second =date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            // 拼接
            return year+"-"+month+"-"+day;

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
            this.pageNumber = val
            this.fetchData()
        },
        //点击查询
        clickquery() {
            this.pageNumber = 1;//初始化从第一页开始
            this.fetchData();
        },
        fetchData() {
            //判断cookie是否存在
            const token = this.$cookie.get("Huangniuniu_TOKEN");
            if(token) {
            const that = this;
            this.$http.get("/order/getOrderMessageByCondition", {
                params: {
                    cinemaName: this.searchMap.cinemaName,
                    orderNum: this.searchMap.orderNum,
                    movieName: this.searchMap.movieName,
                    pageSize: this.pageSize,
                    pageNumber: this.pageNumber
                }
            }).then(({data}) => {
                that.list = data.items;
                that.total = data.total;
                console.log(that.list)
            }).catch(() => {
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


        // 删除订单
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
                this.$http.delete('/order/'+id).then(()=>{
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

}
</script>