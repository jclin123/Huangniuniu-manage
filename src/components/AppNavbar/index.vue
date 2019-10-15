<template>
  <div class="navbar">
    <el-row class="tac">
  <el-col>
    <!-- <h5>自定义颜色</h5> -->
    <el-menu
      :router="true"
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item  index="/home">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <el-submenu index="/usermanager/">
        <template slot="title">
          <i class="el-icon-user"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/usermanager/"><span slot="title">用户管理</span></el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="/actor/">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span>演员管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/actor/"><span slot="title">演员管理</span></el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="/city/">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>城市管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/city/"><span slot="title">城市管理</span></el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="/cinema/">
        <template slot="title">
          <i class="el-icon-video-camera-solid"></i>
          <span>电影院管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/cinema/"><span slot="title">电影院管理</span></el-menu-item>
          <el-menu-item index="/skedule/"><span slot="title">电影排场管理</span></el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      
      <el-submenu index="/movie/">
        <template slot="title">
          <i class="el-icon-film"></i>
          <span>影片管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/movie/"><span slot="title">电影管理</span></el-menu-item>
          <!-- <el-menu-item index="/movie/"><span slot="title">演员管理</span></el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="/order/">
        <template slot="title">
          <i class="el-icon-pie-chart"></i>
          <span>订单管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/order/"><span slot="title">订单管理</span></el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="/comment/">
        <template slot="title">
          <i class="el-icon-edit"></i>
          <span>评论管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/comment/"><span slot="title">评论管理</span></el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="/member/">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>会员管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/member/"><span slot="title">会员管理</span></el-menu-item>
        </el-menu-item-group>
      </el-submenu>

    </el-menu>
  </el-col>
</el-row>
  </div>
</template>


<style scoped>
.el-menu {
    border-right: none;
}
</style>