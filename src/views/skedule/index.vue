<template>
    <div>
        <!-- :inline="true" 表单一行显示 -->
        <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
            <el-form-item prop="cinemaName">
                <el-input v-model="searchMap.cinemaName" placeholder="输入电影院名称" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="movieName">
                <el-input v-model="searchMap.movieName" placeholder="输入电影名称" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="roomName">
                <el-input v-model="searchMap.roomName" placeholder="输入电影厅名称" style="width: 200px"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="clickquery" >查询</el-button>
                 <!-- <el-button type="primary" @click="handleAdd('dialogFormVisible','pojoForm')" >新增</el-button> -->
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
            <el-table-column prop="cinemaName" label="影院名" width="150"></el-table-column>
             <el-table-column prop="movieName" label="电影名" width="180"></el-table-column>
             <el-table-column prop="roomName" label="影厅名" width="90"></el-table-column>
            <el-table-column prop="price" label="价格" ></el-table-column>
            <el-table-column prop="ticketsLeft" label="余票数" ></el-table-column>
            <el-table-column prop="showDate" label="排场时间" width="180"></el-table-column>
            <!-- <el-table-column prop="payType" label="支付类型" >
                <template slot-scope="scope">
                    <span>{{scope.row.payType | payTypeFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="会员地址" ></el-table-column>  -->
             <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleEdit(scope.row,'dlogFormVsb')" size="mini" >编辑</el-button>
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


        <!-- 为某电影院添加电影弹窗 -->
        <el-dialog title="排场编辑" :visible.sync="dlogFormVsb" width="500px">
            <el-form
            ref="skeduleForm"
            label-width="100px"
            label-position="right"
            style="width: 400px;"
            :model="skedule">
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
                <el-button @click="dlogFormVsb = false">取 消</el-button>
                <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
                <el-button type="primary" @click="updateData('skeduleForm')">确 定</el-button>
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
                cinemaName: '',
                movieName: '',
                roomName: ''
            },
            dlogFormVsb:false,//控制添加排场弹窗
            skedule: {
                id: null,
                roomName: "",
                price: 0,
                showDate: "",
                ticketsLeft: 0,
                movieid: null,
                cinemaid: null,
                movieName: '',
                cinemaName: ''
                //showtime: ''
            },
            // 提交的数据

        }
    },

    created() {
        // 初始化获取列表数据
        this.fetchData()
    },


    methods: {
        //跳转到可查看某个电影院下的所有电影，即该影院的影库情况
        cnmviedeos() {
            this.$router.push('/cnmvideos/')
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
            this.$http.get("/cinema/skedule/conditionlsitpage", {
                params: {
                    cinemaName: this.searchMap.cinemaName,
                    roomName: this.searchMap.roomName,
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


        // 打开编辑窗口
        handleEdit(row, dfs) {
            // 初始化排场数据
            //this.skedule = {}
            if (dfs === 'dlogFormVsb') {
                //获得该排场的数据,并且赋值
                this.skedule = row
                this.dlogFormVsb = true
            }
        },

        updateData(formName) {
            //判断cookie是否存在
            const token = this.$cookie.get("Huangniuniu_TOKEN");
            if(token) {
            const that = this;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // 提交更新
                    this.$http({
                        method:  'put',
                        url: '/cinema/skedule',
                        data:this.$qs.stringify(this.skedule)
                    }).then(({data})=>{
                        //新增成功，刷新列表数据
                        that.fetchData()
                        that.dlogFormVsb = false // 关闭编辑弹框
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
                    return false
                }
            })
            }else{
                //跳转登录页
                this.$router.push('/login/')
            }
        },
        // 删除排场
        handleDelete(id) {
            //判断cookie是否存在
            const token = this.$cookie.get("Huangniuniu_TOKEN");
            if(token) {
            const that = this;
            this.$confirm('确认删除这条记录吗？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
            }).then(() => {
                this.$http.delete('/cinema/skedule/' + id)
                    .then(() => {
                        that.fetchData()
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                    }).catch(() => {
                    this.$message({
                        message: '删除失败',
                        type: 'error'
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
        }
    },
}
</script>