<template>
    <div class="header">
        <a href="#/">
            <img class="logo" src="@/assets/logo.png" width="25px">
            <span class="company">黄牛牛网后台管理系统</span>
        </a>
        <el-dropdown>
            <span class="el-dropdown-link" @click="handleCommand('b')">
                退出系统
                <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
            </span>
            <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item icon="el-icon-s-fold" command="b">退出系统</el-dropdown-item> -->
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
//import {logout} from '@/api/login'
import cookie from 'vue-cookie'
export default {
    
    methods: {
        handleCommand(command) {
            const that = this;
            const token = cookie.get("Huangniuniu_TOKEN");

            switch (command) {
                case 'a':
                    // 修改密码
                    this.$message(`点击修改密码`)
                    break;
                case 'b':
                    // 退出系统
                    this.$http.get("/auth/exit").then(()=>{
                        if(token){//token有值
                            //设置该cookie值过期
                            cookie.set("Huangniuniu_TOKEN",token,"0");
                        }
                        //this.$cookie.delete('Huangniuniu-TOKEN', {domain: '.huangniuniu.com'});
                        // 回到登录页面
                        that.$router.push('/login')
                    })

                    // const token = localStorage.getItem('mxg-msm-token')
                    /*logout( localStorage.getItem('mxg-msm-token') ).then(response => {
                        const resp = response.data
                        if(resp.flag) {
                            // 退出成功
                            // 清除本地数据
                            localStorage.removeItem('mxg-msm-token')
                            localStorage.removeItem('mxg-msm-user')
                            // 回到登录页面
                            this.$router.push('/login')
                        }else {
                            this.$message({
                                message: resp.message,
                                type: 'warning',
                                duration: 500 // 弹出停留时间
                            });
                        }
                    })*/
                    break;
                default:
                    break;
            }
        }
    }
}
</script>

<style scoped>
.logo{
    vertical-align: middle;
    padding: 0px 10px 0 40px;
}
.company {
    position: absolute;
    color: white;
}

/* 下拉菜单  */
.el-dropdown {
    float: right;
    margin-right: 40px;
}
.el-dropdown-link {
    color: white;
    cursor: pointer;
}
</style>