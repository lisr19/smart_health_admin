<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">视频类型列表</p>
            <!--表格部分-->
            <Row>
                <Col span="8">
                    <Button type="primary" @click="openVideoTypeAdd" style="width: 100px;">添加</Button>
                    <Button type="error" @click="batchDel" style="width: 100px">批量删除</Button>
                </Col>
                <Col span="4" offset="12">
                    <Input v-model="search_data.name" icon="search" clearable @on-change="handleSearch"
                           placeholder="请输入名称搜索..."/>
                </Col>
            </Row>
        </Card>
        <Card>
            <div>
                <Table :columns="columnsList" :data="videoTypeData" @on-selection-change="batchSelect" border
                       disabled-hover></Table>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                          @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <!--添加/编辑页面组件插入-->
        <videoTypeAdd ref="videoTypeAdd" @refreshVideoTypeList="getVideoTypeList"/>
        <videoTypeEdit ref="videoTypeEdit" @refreshVideoTypeList="getVideoTypeList"/>
    </div>
</template>

<script>
  import videoTypeAdd from './videoType-add.vue';
  import videoTypeEdit from './videoType-edit.vue';
  import {findVideoTypeList, delVideoType} from '@/libs/API/videoType.js';
  import util from '@/libs/util.js';

  export default {
    name: "videoType-list",
    components: {
      videoTypeAdd,
      videoTypeEdit
    },
    data() {
      return {
        videoTypeList: [],// 所有视频类型列表
        //文章表头数组
        columnsList: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '名称',
            align: 'center',
            key: 'name',
          },
          {
            title: '父系列',
            align: 'center',
            key: 'father'
          },
          {
            title: '操作',
            align: 'center',
            width: 200,
            key: 'handle',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      let data = Object.assign({}, params.row);
                      this.openVideoTypeEdit(data);
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({  // 打开确认对话框
                        content: '<p>确定删除吗？</p>',
                        // 确认删除
                        onOk: () => {
                          let id = {id: params.row.id.toString()};
                          this.doVideoTypeDel(id);
                        },
                        // 取消删除
                        onCancel: () => {
                          this.$Message.info('取消删除！');
                        }
                      })
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        videoTypeData: [],//视频类型列表数据（后台获取）
        search_data: {},//搜索文章
        searchOption: {},//视频类型传到后台的对象
        //视频类型批量选择的id对象
        delId: {
          ids: ''
        },
        page: {//视频类型翻页对象
          total: 10,
          currentPage: 1,
          current: 1
        },
      }
    },
    methods: {
      // 获取所有类型列表
      async getAllVideoTypeList() {
        let res = await findVideoTypeList({limit: 100});
        if (!res.code) {
          this.videoTypeList = res.data.data;
          this.videoTypeList.unshift({id:1,name:"无"});
          this.getVideoTypeList();
        } else {
          this.$Message.error(res.msg);
        }
      },
      //视频类型列表获取
      async getVideoTypeList(params) {
        let data = {};
        data.page = this.page.currentPage;
        data.limit = 10;
        if (params) {
          data.name = params.name;
          data.page = params.page;
        }
        //视频类型列表类型为0
        let res = await findVideoTypeList(data);
        if (!res.code) {
          this.videoTypeData = res.data.data;
          this.videoTypeData.forEach(v => {
              this.videoTypeList.forEach(v1 => {
                if (v.pid === v1.id) {
                  v.father = v1.name;
                }
              })
          });
          this.page.total = res.data.total;
        } else {
          this.$Message.error(res.msg);
        }
      },
      //视频类型删除
      async doVideoTypeDel(params) {
        let data = {};
        data.ids = params.id;
        let res = await delVideoType(data);
        if (!res.code) {
          this.$Message.success('删除成功');
          this.getVideoTypeList();//刷新视频类型列表
        } else {
          this.$Message.error(res.msg);
        }
      },

      //翻页
      changePage(page) {
        this.searchOption.page = page;
        this.getVideoTypeList(this.searchOption);
        localStorage.page = JSON.stringify(this.page);
      },
      //打开视频类型添加页面
      openVideoTypeAdd() {
        this.$refs.videoTypeAdd.isAdd = true;
        this.$refs.videoTypeAdd.typeList = this.videoTypeList;
      },

      //打开视频类型编辑页面
      openVideoTypeEdit(params) {
        this.$refs.videoTypeEdit.isEdit = true;
        this.$refs.videoTypeEdit.typeList = this.videoTypeList;
        this.$refs.videoTypeEdit.videoTypeEditForm = params;
      },

      //视频类型表搜索（根据姓名或者手机）
      handleSearch() {
        if (this.search_data) {//判断搜索条件是否为空
          console.log(this.search_data);
          this.searchOption.name = this.search_data.name;
          this.searchOption.page = 1;// 初始化搜索页数
          this.getVideoTypeList(this.searchOption);
        } else {//重置该搜索内容
          this.searchOption.search = '';
          this.getVideoTypeList();
        }
      },
      // 视频类型批量删除
      batchDel() {
        if (this.delId.ids) {
          this.$Modal.confirm({  // 打开确认对话框
            content: '<p>确定删除吗？</p>',
            // 确认删除
            onOk: async () => {
              let res = await delVideoType(this.delId);
              if (!res.code) {
                this.$Message.success('删除成功');
                this.delId.ids = '';
              } else {
                this.$Message.error(res.msg);
              }
              this.getVideoTypeList();
            },
            // 取消删除
            onCancel: () => {
              this.$Message.info('取消删除！');
            }
          })
        } else {
          this.$Message.info('请选择需要删除的视频！');
        }
      },

      // 视频类型批量选择
      batchSelect(selection) {
        this.delId.ids = '';
        selection.forEach(row => {
          if (this.delId.ids === '') {
            this.delId.ids = row.id;
          } else {
            this.delId.ids = this.delId.ids + ',' + row.id;
          }
        })
      },

    },

    activated() {
      //页面被打开时获取数据
      this.getAllVideoTypeList();
    },
  }
</script>

<style scoped>

</style>
