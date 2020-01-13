<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">广告列表</p>
            <!--表格部分-->
            <Row>
                <Col span="8">
                    <Button type="primary" @click="openAdAdd" style="width: 100px;">添加</Button>
                    <Button type="error" @click="batchDel" style="width: 100px">批量删除</Button>
                </Col>
                <Col span="4" offset = "12">
                    <Input v-model="search_data.name" icon="search" clearable @on-change="handleSearch"
                           placeholder="请输入名称搜索..."/>
                </Col>
            </Row>
        </Card>
        <Card>
            <div>
                <Table :columns="columnsList" :data="adData" @on-selection-change="batchSelect" border
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
        <adAdd ref="adAdd" @refreshAdList="getAdList"/>
        <adEdit ref="adEdit" @refreshAdList="getAdList"/>
    </div>
</template>

<script>
    import adAdd from './ad-add.vue';
    import adEdit from './ad-edit.vue';
    import {findAdList, delAd, editAd} from '@/libs/API/ad.js';
    import util from '@/libs/util.js';

    export default {
        name: "ad-list",
        components: {
            adAdd,
            adEdit
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
                        title: '发布状态',
                        align: 'center',
                        key: 'status',
                        render: (h,params) => {
                            return h('i-switch', {
                                props:{
                                    value: params.row.status === 1,
                                },
                                on:{
                                    'on-change':(v)=>{//触发on-change事件
                                        // console.log(params.row);
                                        if(v){
                                            params.row.status = 1;
                                        }
                                        else{
                                            params.row.status = 0;
                                        }
                                        this.doAdEdit(params.row, params.index);
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '图片',
                        align: 'center',
                        key: 'imageUrl',
                        render: (h, params) => {
                            return h('div', [
                                h('img', {
                                    attrs:{
                                        src:params.row.imgUrl,
                                        width:100,
                                        height:100,
                                    },
                                    style: {
                                        cursor:'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            window.open(params.row.imgUrl);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '地址',
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
                        title: '开始时间',
                        align: 'center',
                        key: 'startTime',
                        sortable: true,
                    },
                    {
                        title: '结束时间',
                        align: 'center',
                        key: 'endTime',
                        sortable: true,
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
                        width: 160,
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
                                            this.openAdEdit(data);
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
                                                    this.doAdDel(id);
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
                adData: [],//系统用户列表数据（后台获取）
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
            async getAdList(params) {
                let data = {};
                data.page = this.page.currentPage;
                data.limit=10;
                if (params) {
                    data.name = params.search.name;
                    data.page=params.page;
                }
                //系统用户列表类型为0
                let res = await findAdList(data);
                if (!res.code) {
                    this.adData = res.data.data;
                    this.page.total = res.data.total;
                } else {
                    this.$Message.error(res.msg);
                }
            },
            //用户删除
            async doAdDel(params) {
                let data = {};
                data.ids = params.id;
                let res = await delAd(data);
                if (!res.code) {
                    this.$Message.success('删除成功');
                    this.getAdList();//刷新系统用户列表
                } else {
                    this.$Message.error(res.msg);
                }
            },

            //系统用户翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getAdList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //打开系统用户添加页面
            openAdAdd() {
                this.$refs.adAdd.isAdd = true;
            },

            //打开系统用户编辑页面
            openAdEdit(params) {
                this.$refs.adEdit.isEdit = true;
                this.$refs.adEdit.adEditForm = params;
            },

            //系统用户表搜索（根据姓名或者手机）
            handleSearch() {
                if (this.search_data) {//判断搜索条件是否为空
                    this.searchOption.search= this.search_data;
                    this.searchOption.page = 1;// 初始化搜索页数
                    this.getAdList(this.searchOption);
                } else {//重置该搜索内容
                    this.searchOption.search = '';
                    this.getAdList();
                }
            },
            // 系统用户批量删除
            batchDel() {
                if (this.delId.ids) {
                    this.$Modal.confirm({  // 打开确认对话框
                        content: '<p>确定删除吗？</p>',
                        // 确认删除
                        onOk: async () => {
                            let res = await delAd(this.delId);
                            if (!res.code) {
                                this.$Message.success('删除成功');
                                this.delId.ids = '';
                            } else {
                                this.$Message.error(res.msg);
                            }
                            this.getAdList();
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
            // 修改广告状态
            async doAdEdit(params,index){
                let data={};
                data.id=params.id;
                data.status=params.status;
                let res=await editAd(data);
                if(!res.code){
                    this.$Message.success('修改成功');
                    this.adData[index].status=params.status;
                }else{
                    this.$Message.error(res.msg);
                    this.getAdList();
                }
            },

        },

        activated(){
            //页面被打开时获取数据
            this.getAdList();
        },
    }
</script>

<style scoped>

</style>
