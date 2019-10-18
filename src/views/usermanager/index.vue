<template>
    <div>
        <!-- :inline="true" 表单一行显示 -->
        <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
            <el-form-item prop="isDisable">
                <el-select v-model="searchMap.isDisable" placeholder="冻结已否" style="width: 110px">
                    <!-- 不要忘记 payTypeOptions 绑定到data中 -->
                    <el-option v-for="option in typeOptions"
                    :key="option.type"
                    :label="option.name"
                    :value="option.type"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="nickname">
                <el-input v-model="searchMap.nickname" placeholder="输入昵称搜索" style="width: 200px"></el-input>
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
            style="width: 100%">
            <!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="account" label="账号" ></el-table-column>
            <el-table-column prop="isDisable" label="状态" :formatter="formatSatus"></el-table-column>
            <el-table-column prop="nickname" label="昵称" ></el-table-column>
            <el-table-column prop="registrationDate" label="注册时间" :formatter="formatDate"></el-table-column>
             <el-table-column label="操作" width="250" prop="isDisable">
                 <!-- slot-scope="scope" -->
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="setUnable(scope.row.id,scope.row.isDisable)">{{scope.row.isDisable == 0 ? '解封':'冻结'}}</el-button>
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

<style scoped>
.el-table {
    text-align: center;
}
</style>


<script>

// 状态类型
const typeOptions = [
    {type: '', name: '全部'},
    {type: '0', name: '冻结'},
    {type: '1', name: '正常'},
]


export default {
    
    data() {
        return {
            list: [],
            total: 0, // 总记录数
            pageNumber: 1, // 当前页码
            pageSize: 10, // 每页显示10条数据,
            searchMap: { // 条件查询绑定的条件值
                isDisable: '',
                nickname: ''
            },
            typeOptions,
            pojo: {
                id: null,
                account: '',
                nickname:'',
                registrationDate: ''
            }, // 提交的数据
        }
    },

    mounted() {
        // 初始化获取列表数据
        this.fetchData()
    },

    methods: {
        //格式化时间
        formatDate(row, column, cellValue) {
            if(cellValue==null || cellValue=="") return "";
            let date = new Date(cellValue);
            let Y = date.getFullYear() + '-';
            let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
            let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
            return Y + M + D ;
        },
        //格式化用户状态
        formatSatus(row, column, cellValue){
            if(cellValue == 1){
                //return `<el-button size="mini" type="danger" @click="setUnable(1)">冻结该用户</el-button>`;
                return "正常";
            }else if(cellValue == 0){
                return "冻结";
            }
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
            this.$http.get("/user/queryAllByPage",{
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
            //判断cookie是否存在
            const token = this.$cookie.get("Huangniuniu_TOKEN");
            if(token) {
            const that = this;
            this.$http.get("/user/conditionQuery",{
                params: {
                    isDisable: this.searchMap.isDisable,
                    nickname: this.searchMap.nickname,
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

        // 冻结/解封账号
        setUnable(id,isDisable) {
            //判断cookie是否存在
            const token = this.$cookie.get("Huangniuniu_TOKEN");
            if(token) {
            const that = this;
            this.$confirm(isDisable == 1 ? '确认冻结这个账号吗？':'确认解封这个账号吗？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
            }).then(() => {
                // 确认
                this.$http.put('/user/isDisable/'+id)
                    .then(()=>{
                        that.conditionquery()
                        this.$message({
                            message: isDisable == 1 ? '冻结成功':'解封成功',
                            type:  'success'
                        })
                    }).catch(()=>{
                    this.$message({
                        message: id == 1 ? '冻结失败':'解封失败',
                        type:  'error'
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