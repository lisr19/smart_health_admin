<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">管理员列表</p>
            <!--表格部分-->
            <Row>
                <Col span="8">
                    <Button type="primary" @click="openAdminAdd" style="width: 100px;">添加</Button>
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
                <Table :columns="columnsList" :data="adminData" @on-selection-change="batchSelect" border
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
        <adminAdd ref="adminAdd" @refreshAdminList="getAdminList"/>
        <adminEdit ref="adminEdit" @refreshAdminList="getAdminList"/>
    </div>
</template>

<script>
    import adminAdd from './admin-add.vue';
    import adminEdit from './admin-edit.vue';
    import {findAdminList, delAdmin} from '@/libs/API/admin.js';
    import util from '@/libs/util.js';

    export default {
        name: "admin-list",
        components: {
            adminAdd,
            adminEdit
        },
        data() {
            return {
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
                        title: '电话',
                        align: 'center',
                        key: 'phone',
                    },
                    {
                        title: '添加时间',
                        align: 'center',
                        key: 'createTime',
                        sortable: true,
                    },
                    {
                        title: '更新时间',
                        align: 'center',
                        key: 'updateTime',
                        sortable: true,
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
                                            let data = Object.assign({},params.row);
                                            this.openAdminEdit(data);
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
                                                    this.doAdminDel(id);
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
                adminData: [],//系统用户列表数据（后台获取）
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
            //系统用户信息列表获取
            async getAdminList(params) {
                let data = {};
                data.page = this.page.currentPage;
                data.limit=10;
                if (params) {
                    data.search = params.name;
                    data.page = params.page;
                }
                //系统用户列表类型为0
                let res = await findAdminList(data);
                if (!res.code) {
                    this.adminData = res.data;
                    this.page.total = res.data.length;
                } else {
                    this.$Message.error(res.msg);
                }
            },
            //用户删除
            async doAdminDel(params) {
                let data = {};
                data.ids = params.id;
                let res = await delAdmin(data);
                if (!res.code) {
                    this.$Message.success('删除成功');
                    this.getAdminList();//刷新系统用户列表
                } else {
                    this.$Message.error(res.msg);
                }
            },

            //系统用户翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getAdminList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //打开系统用户添加页面
            openAdminAdd() {
                this.$refs.adminAdd.isAdd = true;
            },

            //打开系统用户编辑页面
            openAdminEdit(params) {
                this.$refs.adminEdit.isEdit = true;
                this.$refs.adminEdit.adminEditForm = params;
            },

            //系统用户表搜索（根据姓名或者手机）
            handleSearch() {
                if (this.search_data) {//判断搜索条件是否为空
                    this.searchOption.name= this.search_data.name;
                    this.searchOption.page = 1;// 初始化搜索页数
                    this.getAdminList(this.searchOption);
                } else {//重置该搜索内容
                    this.searchOption.search = '';
                    this.getAdminList();
                }
            },
            // 系统用户批量删除
            batchDel() {
                if (this.delId.ids) {
                    this.$Modal.confirm({  // 打开确认对话框
                        content: '<p>确定删除吗？</p>',
                        // 确认删除
                        onOk: async () => {
                            let res = await delAdmin(this.delId);
                            if (!res.code) {
                                this.$Message.success('删除成功');
                                this.delId.ids = '';
                            } else {
                                this.$Message.error(res.msg);
                            }
                            this.getAdminList();
                        },
                        // 取消删除
                        onCancel: () => {
                            this.$Message.info('取消删除！');
                        }
                    })
                } else {
                    this.$Message.info('请选择需要删除的管理员！');
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

        },

        activated(){
            //页面被打开时获取数据
            this.getAdminList();
        },
    }
</script>

<style scoped>

</style>
