<template>
    <div>
        <!-- :inline="true" 表单一行显示 -->
        <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
            <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
            <!-- <el-form-item prop="cardNum">
                <el-input v-model="searchMap.cardNum" placeholder="会员卡号" style="width: 200px"></el-input>
            </el-form-item> -->
            <el-form-item prop="cityName">
                <el-input v-model="searchMap.cityName" placeholder="输入城市名搜索" style="width: 200px"></el-input>
            </el-form-item>

            <el-form-item prop="preLetter">
                <el-input v-model="searchMap.preLetter" placeholder="输入首字母搜索" style="width: 200px"></el-input>
            </el-form-item>
            <!-- <el-form-item prop="birthday">
                //value-format 是指定绑定值的格式
                <el-date-picker style="width: 200px" value-format="yyyy-MM-dd" v-model="searchMap.birthday"  type="date" placeholder="注册日期"> </el-date-picker>
            </el-form-item> -->

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
            <el-table-column type="index" label="序号" width="150"></el-table-column>
            <el-table-column prop="cityName" label="城市名"></el-table-column>
            <el-table-column prop="preLetter" label="城市首字母"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.row.id)">编辑</el-button>
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
        <el-dialog :title="dailogTitleType" :visible.sync="dialogFormVisible" width="500px">
            <el-form
                    :rules="rules"
                    ref="pojoForm"
                    label-width="100px"
                    label-position="right"
                    style="width: 400px;"
                    :model="city">
                <el-form-item label="城市名" prop="cityName" >
                    <el-input v-model="city.cityName" ></el-input>
                </el-form-item>
                <el-form-item label="城市首字母" prop="preLetter" >
                    <el-input v-model="city.preLetter" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="city.id == null ? addData('pojoForm'): updateData('pojoForm')">确 定</el-button>
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
                    cityName: "",
                    preLetter: ""
                },


                dialogFormVisible: false, //控制对话框

                dailogTitleType: "",//动态显示弹框标题

                city: {
                    id: null,
                    cityName: "",
                    preLetter: ""
                }, // 提交的数据
                rules: { // 校验规则
                    cityName: [
                        {required: true, message: '城市名不能为空', trigger: 'blur'}
                    ],
                    preLetter: [
                        {required: true, message: '首字母不能为空', trigger: 'blur'}
                    ]
                }
            }
        },

        created() {
            // 初始化获取列表数据
            this.fetchData()
        },

        methods: {
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
            //查询所有城市并分页
            fetchData() {
                const that = this;
                this.$http.get("/city/listtopage",{
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
            //查询都是从第一页开始
            clickquery(){
                this.pageNumber = 1;
                this.conditionquery();
            },
            //按条件查询所有城市并分页
            conditionquery(){
                //判断cookie是否存在
                const token = this.$cookie.get("Huangniuniu_TOKEN");
                if(token) {
                const that = this;
                this.$http.get("/city/conditionlisttopage",{
                    params: {
                        cityName: this.searchMap.cityName,
                        preLetter: this.searchMap.preLetter,
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
                }else {
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
            // 提交新增数据
            addData(formName) {
                //判断cookie是否存在
                const token = this.$cookie.get("Huangniuniu_TOKEN");
                if(token) {
                const that = this;
                this.$refs[formName].validate(valid => {
                    if(valid){
                        //提交表单
                        console.log('addData')
                        this.$http({
                            method: 'post',
                            url: '/city',
                            data: this.$qs.stringify(this.city)
                        }).then(({data})=>{
                            that.conditionquery()
                            that.city = {}
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
                    }else {
                        return false
                    }
                })
                }else {
                    //跳转登录页
                    this.$router.push('/login/')
                }
            },
            // 弹出新增窗口
            handleAdd(dfs) {
                console.log(this.pojo)
                // this.pojo = {}
                const that = this;
                that.city = {}
                if(dfs ==='edit_dialogFormVisible'){
                    this.dailogTitleType = '添加城市'
                    this.dialogFormVisible = true
                }

            },

            // 打开编辑窗口
            handleEdit(id) {
                console.log('编辑', id)
                const that = this;
                that.city = {}
                this.dailogTitleType = '修改城市'
                this.$http.get("/city/"+id).then(({data})=>{
                    that.city = data
                })
                this.dialogFormVisible = true
            },

            updateData(formName) {
                //判断cookie是否存在
                const token = this.$cookie.get("Huangniuniu_TOKEN");
                if(token) {
                const that = this;
                this.$refs[formName].validate(valid => {
                    if(valid){
                        this.$http({
                            method: 'put',
                            url: '/city',
                            data: this.$qs.stringify(this.city)
                        }).then(({data})=>{
                            that.conditionquery()
                            that.dialogFormVisible = false
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
                }else {
                    //跳转登录页
                    this.$router.push('/login/')
                }
            },

            // 删除城市
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
                    this.$http.delete('/city/'+id).then(()=>{
                        that.conditionquery()
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