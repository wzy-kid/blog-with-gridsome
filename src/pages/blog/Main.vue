<template>
  <Layout>
    <div style="min-height: 600px" v-loading="loading">
      <!-- <el-card shadow="never" style="margin-bottom: 20px">
        <el-input
          placeholder="请输入关键字"
          v-model="searchKey"
          clearable
          style="width: 300px"
        ></el-input>
        <el-button
          icon="el-icon-search"
          style="margin-left: 10px"
          circle
          plain
        ></el-button>
        <el-button
          @click="$share()"
          style="margin-left: 10px"
          icon="el-icon-share"
          type="warning"
          plain
          circle
        ></el-button>
        <el-button
          type="primary"
          icon="el-icon-edit"
          round
          plain
          style="float: right"
          @click="goAdd"
          >写博文</el-button 
        >
      </el-card> -->

      <div v-if="blogs && blogs.length > 0">
        <el-card
          shadow="hover"
          v-for="(item, index) in blogs"
          :key="'p' + index"
          style="margin-bottom: 20px"
        >
          <div slot="header">
            <el-row>
              <el-col :span="16">
                <span>
                  <a
                    style="text-decoration: none; cursor: pointer"
                    @click="goDetails(item.node.id)"
                  >
                    <i class="el-icon-edit-outline"></i>&nbsp;&nbsp;
                    {{ item.node.title }}
                  </a>
                </span>
              </el-col>
              <el-col :span="8">
                <div style="text-align: right">
                  <el-button
                    @click="$share('/BlogDetails/' + item.node.id)"
                    style="padding: 3px 0"
                    type="text"
                    icon="el-icon-share"
                  ></el-button>
                  <!-- <el-button
                    @click="editBlog(index)"
                    style="padding: 3px 0"
                    type="text"
                    icon="el-icon-edit"
                    v-if="token"
                  ></el-button>
                  <el-button
                    @click="deleteBlog(index)"
                    style="padding: 3px 0"
                    type="text"
                    icon="el-icon-delete"
                    v-if="token"
                  ></el-button> -->
                </div>
              </el-col>
            </el-row>
          </div>
          <div style="font-size: 0.9rem; line-height: 1.5; color: #606c71">
            最近更新 {{ item.node.updated_at }}
          </div>
          <div
            style="
              font-size: 1.1rem;
              line-height: 1.5;
              color: #303133;
              padding: 10px 0px 0px 0px;
            "
          >
            {{ item.node.description }}
          </div>
        </el-card>
        <div style="text-align: center">
          <div class="page">
            <Pager :info="$page.blogs.pageInfo" />
          </div>
          <!-- <el-pagination
            @current-change="list"
            background
            layout="prev, pager, next"
            :current-page.sync="query.page"
            :page-size="query.pageSize"
            :total="query.pageNumber * query.pageSize"
          >
          </el-pagination> -->
        </div>
      </div>

      <el-card
        shadow="never"
        style="
          margin-bottom: 20px;
          padding: 20px 0px 20px 0px;
          text-align: center;
        "
        v-if="!blogs || blogs.length == 0"
      >
        <font style="font-size: 30px; color: #dddddd">
          <b>还没有博客 (╯°Д°)╯︵ ┻━┻</b>
        </font>
      </el-card>
    </div>
  </Layout>
</template>

<page-query>
query($page: Int){
  blogs: allStrapiBlog(perPage: 10, page: $page) @paginate{
    pageInfo {
      totalPages
      currentPage
    }
    edges{
      node{
        id,
        title,
        updated_at (format: "D MMM YYYY"),
        description
      }
    }
  }
}
</page-query>
<script>
import { Pager } from "gridsome";
// import GistApi from '@/api/gist'
export default {
  components: {
    Pager,
  },
  data() {
    return {
      loading: false,
      searchKey: "",
    };
  },
  computed: {
    blogs() {
      return this.$page.blogs.edges;
    },
  },
  mounted() {
  },
  methods: {
    // list() {
    //   this.blogs = [];
    // this.loading = true
    // GistApi.list(this.query).then((response) => {
    //     let result = response.data
    //     let pageNumber = this.$util.parseHeaders(response.headers)
    //     if (pageNumber) {
    //         this.query.pageNumber = pageNumber
    //     }
    //     for (let i = 0; i < result.length; i++) {
    //         for (let key in result[i].files) {
    //             let data = {}
    //             data['title'] = key
    //             data['url'] = result[i].files[key]
    //             data['description'] = result[i]['description']
    //             data['id'] = result[i]['id']
    //             data['createTime'] = this.$util.utcToLocal(result[i]['created_at'])
    //             data['updateTime'] = this.$util.utcToLocal(result[i]['updated_at'])
    //             data['hide'] = false
    //             this.blogs.push(data)
    //             break
    //         }
    //     }
    // }).then(() => this.loading = false)
    // },
    // search() {
    //   for (let i = 0; i < this.blogs.length; i++) {
    //     this.blogs[i].hide = this.blogs[i].title.indexOf(this.searchKey) < 0;
    //   }
    // },
    // editBlog(index) {
    //   if (!this.token) {
    //     this.$message({
    //       message: "请绑定有效的Token",
    //       type: "warning",
    //     });
    //     return;
    //   }
    //   this.$router.push("/user/blog/edit/" + this.blogs[index].id);
    // },
    // deleteBlog(index) {
    //   this.$confirm("是否永久删除该博客?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   }).then(() => {
    //     let blog = this.blogs[index];
    //     GistApi.delete(blog.id).then((result) => {
    //       this.$message({
    //         message: "删除成功",
    //         type: "success",
    //       });
    //       this.blogs.splice(index, 1);
    //     });
    //   });
    // },
    // goAdd() {
    //   if (!this.token) {
    //     this.$message({
    //       message: "请绑定有效的Token",
    //       type: "warning",
    //     });
    //     return;
    //   }
    //   this.$router.push("/user/blog/add");
    // },
    goDetails(id) {
      this.$router.push("/BlogDetails/" + id);
    },
  },
};
</script>
<style>
.page a {
  width: 20px;
  display: inline-block;
}
</style>