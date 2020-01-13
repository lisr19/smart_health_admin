<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">文章列表</p>
            <!--表格部分-->
            <Row>
                <Col span="8">
                    <Button type="primary" @click="openApkVersionAdd" style="width: 100px;">添加</Button>
                    <Button type="error" @click="batchDel" style="width: 100px">批量删除</Button>
                </Col>
                <Col span="4" offset="12">
                    <Select clearable @on-change="handleSearchByType" placeholder="选择版本类型">
                        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}
                        </Option>
                    </Select>
                </Col>
            </Row>
        </Card>
        <Card>
            <div>
                <Table :columns="columnsList" :data="apkVersionData" @on-selection-change="batchSelect"  border
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
        <apkVersionAdd ref="apkVersionAdd" @refreshApkVersionList="getApkVersionList" :typeList="typeList"/>
    </div>
</template>

<script>
    import apkVersionAdd from './apkVersion-add.vue';
    import {findApkVersionList, delApkVersion} from '@/libs/API/apkVersion.js';
    import util from '@/libs/util.js';

    export default {
        name: "apkVersion-list",
        components: {
            apkVersionAdd,
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
                        title: '版本号',
                        align: 'center',
                        key: 'version',
                    },
                    {
                        title: '类型',
                        align: 'center',
                        key: 'type',
                        render:(h,params)=>{
                            return ('label', `${params.row.type===1?'手机安卓app':`TVapp`}`);
                        }
                    },
                    {
                        title: '下载链接',
                        align: 'center',
                        key: 'url',
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'createTime',
                        sortable:true,
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
                                        type: 'error',
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({  // 打开确认对话框
                                                content: '<p>确定删除吗？</p>',
                                                // 确认删除
                                                onOk: () => {
                                                    let id = {id: params.row.id.toString()};
                                                    this.doApkVersionDel(id);
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
                apkVersionData: [],//系统用户列表数据（后台获取）
                search_data: {},//搜索文章
                searchOption: {},//系统用户传到后台的对象
                typeList:[{value:1,label:'手机安卓app'},{value:2,label:'TVapp'}],
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
            async getApkVersionList(params) {
                let data = {};
                data.page = this.page.currentPage;
                data.limit=10;
                if (params) {
                    data.type = params.type;
                    data.page=params.page;
                }
                //系统用户列表类型为0
                let res = await findApkVersionList(data);
                if (!res.code) {
                    this.apkVersionData = res.data.data;
                    this.page.total = res.data.total;
                }else {
                    this.$Message.error(res.msg);
                }
            },
            //用户删除
            async doApkVersionDel(params) {
                let data = {};
                data.ids = params.id;
                let res = await delApkVersion(data);
                if (!res.code) {
                    this.$Message.success('删除成功');
                    this.getApkVersionList();//刷新系统用户列表
                } else {
                    this.$Message.error(res.msg);
                }
            },

            //系统用户翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getApkVersionList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //打开系统用户添加页面
            openApkVersionAdd() {
                this.$refs.apkVersionAdd.isAdd = true;
            },
            // 系统用户批量删除
            batchDel() {
                if (this.delId.ids) {
                    this.$Modal.confirm({  // 打开确认对话框
                        content: '<p>确定删除吗？</p>',
                        // 确认删除
                        onOk: async () => {
                            let res = await delApkVersion(this.delId);
                            if (!res.code) {
                                this.$Message.success('删除成功');
                                this.delId.ids = '';
                            } else {
                                this.$Message.error(res.msg);
                            }
                            this.getApkVersionList();
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
            handleSearchByType(params) {
                if(params) {
                    this.searchOption.type = params;
                    this.getApkVersionList(this.searchOption);
                }else{
                    this.searchOption.type='';
                    this.getApkVersionList();
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
        created(){
            //页面被打开时获取数据
            this.getApkVersionList();
        },
    }
</script>

<style scoped>

</style>
