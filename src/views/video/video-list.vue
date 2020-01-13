<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">视频列表</p>
            <!--表格部分-->
            <Row>
                <Col span="8">
                    <Button type="primary" @click="openVideoAdd" style="width: 100px;">添加</Button>
                    <Button type="error" @click="batchDel" style="width: 100px">批量删除</Button>
                </Col>
                <Col span="4" offset="8">
                    <Select clearable @on-change="handleSearchByType" placeholder="选择类型">
                        <Option v-for="item in typeList" :value="item.id" :key="item.id">{{item.name}}
                        </Option>
                    </Select>
                </Col>
                <Col span="4" offset="0">
                    <Input v-model="search_data.title" icon="search" clearable @on-change="handleSearch"
                           placeholder="请输入名称搜索..."/>
                </Col>
            </Row>
        </Card>
        <Card>
            <div>
                <Table :columns="columnsList" :data="videoData" @on-selection-change="batchSelect" border
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
        <videoAdd ref="videoAdd" @refreshVideoList="getVideoList"/>
        <videoEdit ref="videoEdit" @refreshVideoList="getVideoList" :seriesList="seriesList" :typeList="typeList"/>
    </div>
</template>

<script>
  import videoAdd from './video-add.vue';
  import videoEdit from './video-edit.vue';
  import {findVideoList, delVideo, editVideo} from '@/libs/API/video.js';
  import {findVideoTypeList} from '@/libs/API/videoType.js';
  import {findVideoSeriesList} from '@/libs/API/videoSeries.js';
  import util from '@/libs/util.js';

  export default {
    name: "video-list",
    components: {
      videoAdd,
      videoEdit
    },
    data() {
      return {
        seriesList: [],//视频系列list
        typeList: [],//视频类型list
        //视频表头数组
        columnsList: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '名称',
            align: 'center',
            key: 'title',
          },
          {
            title: '发布状态',
            align: 'center',
            key: 'status',
            render: (h, params) => {
              return h('i-switch', {
                props: {
                  value: params.row.status === 1,
                },
                on: {
                  'on-change': (v) => {//触发on-change事件
                    if (v) {
                      params.row.status = 1;
                    }
                    else {
                      params.row.status = 2;
                    }
                    this.doVideoEdit(params.row, params.index);
                  }
                }
              })
            }
          },
          {
            title: '类型',
            align: 'center',
            key: 'typeName'
          },
          {
            title: '视频地址',
            align: 'center',
            key: 'url',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      window.open(params.row.url);
                    }
                  }
                }, params.row.url)
              ]);
            }
          },
          {
            title: '图片1',
            align: 'center',
            key: 'imgUrl1',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.imgUrl1,
                    width: 100,
                    height: 100,
                  },
                  style: {
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      window.open(params.row.imgUrl1);
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '图片2',
            align: 'center',
            key: 'imgUrl2',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.imgUrl2,
                    width: 100,
                    height: 100,
                  },
                  style: {
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      window.open(params.row.imgUrl2);
                    }
                  }
                })
              ]);
            }
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
                        this.typeList.forEach(v1 => {
                            if (data.typeName === v1.name) {
                                data.type = v1.id;
                            }
                        });
                      this.openVideoEdit(data);
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
                          let id = {ids: params.row.id.toString()};
                          this.doVideoDel(id);
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
        videoData: [],//系统用户列表数据（后台获取）
        search_data: {},//搜索文章
        searchOption: {},//系统用户传到后台的对象
        //系统用户批量选择的id对象
        delId: {
          ids: ''
        },
        page: {//系统用户翻页对象
          total: 10,
          currentPage: 1,
          current: 1
        },
      }
    },
    methods: {
      // 获取视频系列list
      async findVideoSeriesList() {
        let res = await findVideoSeriesList({limit: 100});
        if (!res.code) {
          this.seriesList = res.data.data;
        } else {
          this.$Message.error(res.msg);
        }
      },
      // 获取视频类型list
      async findVideoTypeList() {
        let res = await findVideoTypeList({limit: 100});
        if (!res.code) {
          this.typeList = res.data.data;
        } else {
          this.$Message.error(res.msg);
        }
      },
      //系统用户信息列表获取
      async getVideoList(params) {
        let data = {};
        data.page = this.page.currentPage;
        data.limit = 10;
        if (params) {
          data.title = params.title;
          data.type = params.type;
          data.page = params.page;
        }
        //系统用户列表类型为0
        let res = await findVideoList(data);
        if (!res.code) {
          this.videoData = res.data.data;
          this.videoData.forEach(v => {
            this.typeList.forEach(v1 => {
              if (v.type === v1.id) {
                v.typeName = v1.name;
              }
            })
          });
          this.page.total = res.data.total;
        } else {
          this.$Message.error(res.msg);
        }
      },
      //用户删除
      async doVideoDel(params) {
        let data = {};
        data.id = params.id;
        let res = await delVideo(data);
        if (!res.code) {
          this.$Message.success('删除成功');
          this.getVideoList();//刷新系统用户列表
        } else {
          this.$Message.error(res.msg);
        }
      },

      //系统用户翻页
      changePage(page) {
        this.searchOption.page = page;
        this.getVideoList(this.searchOption);
        localStorage.page = JSON.stringify(this.page);
      },
      //打开系统用户添加页面
      openVideoAdd() {
        this.$refs.videoAdd.isAdd = true;
        this.$refs.videoAdd.typeList = this.typeList;
        this.$refs.videoAdd.seriesList = this.seriesList;
      },
      //打开系统用户编辑页面
      openVideoEdit(params) {
        this.$refs.videoEdit.isEdit = true;
        this.$refs.videoEdit.videoEditForm = params;
        this.$refs.videoAdd.typeList = this.typeList;
        this.$refs.videoAdd.seriesList = this.seriesList;
      },

      //系统用户表搜索（根据姓名或者手机）
      handleSearch() {
        if (this.search_data) {//判断搜索条件是否为空
          console.log(this.search_data);
          this.searchOption.type = this.search_data.type;
          this.searchOption.title = this.search_data.title;
          this.searchOption.page = 1;// 初始化搜索页数
          this.getVideoList(this.searchOption);
        } else {//重置该搜索内容
          this.searchOption.search = '';
          this.getVideoList();
        }
      },
        handleSearchByType(params) {
            if (params) {//判断搜索条件是否为空
                this.searchOption.type = params;
                this.searchOption.page = 1;// 初始化搜索页数
            } else {//重置该搜索内容
                this.searchOption.type = '';
            }
            this.getVideoList(this.searchOption);
        },
      // 系统用户批量删除
      batchDel() {
        if (this.delId.ids) {
          this.$Modal.confirm({  // 打开确认对话框
            content: '<p>确定删除吗？</p>',
            // 确认删除
            onOk: async () => {
              let res = await delVideo(this.delId);
              if (!res.code) {
                this.$Message.success('删除成功');
                this.delId.ids = '';
              } else {
                this.$Message.error(res.msg);
              }
              this.getVideoList();
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

      // 系统用户批量选择
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
      // 修改状态
      async doVideoEdit(params, index) {
        let data = {};
        data.id = params.id;
        data.status = params.status;
        data.type = params.type;
        let res = await editVideo(data);
        if (!res.code) {
          this.$Message.success('修改成功');
          this.adData[index].status = params.status;
        } else {
          this.$Message.error(res.msg);
          this.getVideoList();
        }
      },

    },

    created() {
      //页面被打开时获取数据
      this.getVideoList();
      this.findVideoTypeList();
      this.findVideoSeriesList();

    },
  }
</script>

<style scoped>

</style>
