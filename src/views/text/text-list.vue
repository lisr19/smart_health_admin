<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">富文本列表</p>
            <!--表格部分-->
            <Row>
                <Col span="8">
                    <Button type="primary" @click="openTextAdd" style="width: 100px;">添加</Button>
                    <Button type="error" @click="batchDel" style="width: 100px">批量删除</Button>
                </Col>
                <Col span="4" offset="12">
                    <Input v-model="search_data.title" icon="search" clearable @on-change="handleSearch"
                           placeholder="请输入标题搜索..."/>
                </Col>
            </Row>
        </Card>
        <Card>
            <div>
                <Table :columns="columnsList" :data="textData" border @on-selection-change="batchSelect"
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
        <textAdd ref="textAdd" @refreshTextList="getTextList"/>
        <textEdit ref="textEdit" @refreshTextList="getTextList"/>
    </div>
</template>

<script>
    import textAdd from '../my-components/text-editor/text-add';
    import textEdit from '../my-components/text-editor/text-edit';
    import {findTextList, editText, delText} from '@/libs/API/article.js';
    import util from '@/libs/util.js';

    export default {
        name: "text-list",
        components: {
            textAdd,
            textEdit,
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
                        title: '标题',
                        align: 'center',
                        key: 'title',
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
                                    'on-change':(v) => {//触发on-change事件
                                        if(v){
                                            params.row.status = 1;
                                        }
                                        else{
                                            params.row.status = 2;
                                        }
                                        this.doTextEdit(params.row, params.index);
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '添加时间',
                        align: 'center',
                        key: 'createTime',
                        sortable: true,
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 300,
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
                                            this.openTextEdit(data);
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
                                                    this.doTextDel(id);
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
                textData: [],//系统用户列表数据（后台获取）
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
            async getTextList(params) {
                let data = {};
                data.page = this.page.currentPage;
                data.limit=10;
                if (params) {
                    data.title = params.title;
                    data.page=params.page;
                }
                //系统用户列表类型为0
                let res = await findTextList(data);
                if (!res.code) {
                    this.textData = res.data.data;
                    this.page.total = res.data.total;
                }
            },
            //用户删除
            async doTextDel(params) {
                let data = {};
                data.ids = params.id;
                let res = await delText(data);
                if (!res.code) {
                    this.$Message.success('删除成功');
                    this.getTextList();//刷新系统用户列表
                } else {
                    this.$Message.error(res.msg);
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
            batchDel() {
                if (this.delId.ids) {
                    this.$Modal.confirm({  // 打开确认对话框
                        content: '<p>确定删除吗？</p>',
                        // 确认删除
                        onOk: async () => {
                            let res = await delText(this.delId);
                            if (!res.code) {
                                this.$Message.success('删除成功');
                                this.delId.ids = '';
                            } else {
                                this.$Message.error(res.msg);
                            }
                            this.getTextList();
                        },
                        // 取消删除
                        onCancel: () => {
                            this.$Message.info('取消删除！');
                        }
                    })
                } else {
                    this.$Message.info('请选择需要删除的项！');
                }
            },
            //系统用户翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getTextList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //打开系统用户添加页面
            openTextAdd(params) {
                this.$refs.textAdd.isShow = true;
                this.$refs.textAdd.textAddForm = params;
            },
            //打开系统用户编辑页面
            openTextEdit(params) {
                this.$refs.textEdit.isShow = true;
                this.$refs.textEdit.textEditForm = params;
                this.$refs.textEdit.changeText();
            },
            async doTextEdit(params, index){
                let data={};
                data.id=params.id;
                data.status=params.status;
                let res=await editText(data);
                if(!res.code){
                    this.$Message.success('修改成功');
                    this.textData[index].status=params.status;
                }else{
                    this.$Message.error(res.msg);
                    this.getTextList();
                }
            },

            //系统用户表搜索（根据姓名或者手机）
            handleSearch() {
                if (this.search_data) {//判断搜索条件是否为空
                    this.searchOption.title=this.search_data.title;
                    this.searchOption.page = 1;// 初始化搜索页数
                    this.getTextList(this.searchOption);
                } else {//重置该搜索内容
                    this.searchOption.search = '';
                    this.getTextList();
                }
            }

        },

        activated(){
            //页面被打开时获取数据
            this.getTextList();
        },
    }
</script>

<style scoped>

</style>
