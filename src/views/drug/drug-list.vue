<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">药品列表</p>
            <!--表格部分-->
            <Row>
                <Col span="8">
                    <Button type="primary" @click="openDrugAdd" style="width: 100px;">添加</Button>
                </Col>
                <Col span="4" offset="4">
                    <Select clearable @on-change="handleSearchByCategory" placeholder="选择药品类别">
                        <Option v-for="item in categoryList" :value="item.value" :key="item.value">{{item.label}}
                        </Option>
                    </Select>
                </Col>
                <Col span="4" offset="0">
                    <Input v-model="search_data.type" icon="search" clearable @on-change="handleSearch"
                           placeholder="请输入类型搜索..."/>
                </Col>
                <Col span="4" offset="0">
                    <Input v-model="search_data.name" icon="search" clearable @on-change="handleSearch"
                           placeholder="请输入名称搜索..."/>
                </Col>
            </Row>
        </Card>
        <Card>
            <div>
                <Table :columns="columnsList" :data="drugData" border
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
        <drugAdd ref="drugAdd" @refreshDrugList="getDrugList" :categoryList="categoryList"/>
        <drugEdit ref="drugEdit" @refreshDrugList="getDrugList" :categoryList="categoryList"/>
    </div>
</template>

<script>
    import drugAdd from './drug-add.vue';
    import drugEdit from './drug-edit.vue';
    import {findDrugList, delDrug} from '@/libs/API/drug.js';
    import util from '@/libs/util.js';

    export default {
        name: "drug-list",
        components: {
            drugAdd,
            drugEdit
        },
        data() {
            return {
                //文章表头数组
                columnsList: [
                    {
                        title: '名称',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '类别',
                        align: 'center',
                        key: 'category',
                        render:(h,params)=>{
                            return ('label', `${params.row.category===1?'中西成药':`${params.row.category===2?'中药材':''}` }`);
                        }
                    },
                    {
                        title: '类型',
                        align: 'center',
                        key: 'type',
                    },
                    {
                        title: '别名',
                        align: 'center',
                        key: 'alias',
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
                                            this.openDrugEdit(data);
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
                                                    this.doDrugDel(id);
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
                drugData: [],//系统用户列表数据（后台获取）
                search_data: {},//搜索文章
                searchOption: {},//系统用户传到后台的对象
                categoryList:[{value:1,label:'中西成药'},{value:2,label:'中药材'}],
                page: {//系统用户翻页对象
                    total: 10,
                    currentPage: 1,
                    current: 1
                },
            }
        },
        methods: {
            //系统用户信息列表获取
            async getDrugList(params) {
                let data = {};
                data.page = this.page.currentPage;
                data.limit=10;
                if (params) {
                    data.name = params.name;
                    data.type = params.type;
                    data.category=params.category;
                    data.page=params.page;
                }
                //系统用户列表类型为0
                let res = await findDrugList(data);
                if (!res.code) {
                    this.drugData = res.data.data;
                    this.page.total = res.data.total;
                }
            },
            //用户删除
            async doDrugDel(params) {
                let data = {};
                data.id = params.id;
                let res = await delDrug(data);
                if (!res.code) {
                    this.$Message.success('删除成功');
                    this.getDrugList();//刷新系统用户列表
                } else {
                    this.$Message.error(res.msg);
                }
            },

            //系统用户翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getDrugList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //打开系统用户添加页面
            openDrugAdd() {
                this.$refs.drugAdd.isAdd = true;
            },

            //打开系统用户编辑页面
            openDrugEdit(params) {
                this.$refs.drugEdit.isEdit = true;
                this.$refs.drugEdit.drugEditForm = params;
            },

            //系统用户表搜索（根据姓名或者手机）
            handleSearch() {
                if (this.search_data) {//判断搜索条件是否为空
                    this.searchOption.type=this.search_data.type;
                    this.searchOption.name=this.search_data.name;
                    this.searchOption.page = 1;// 初始化搜索页数
                    this.getDrugList(this.searchOption);
                } else {//重置该搜索内容
                    this.searchOption.search = '';
                    this.getDrugList();
                }
            },
            handleSearchByCategory(params) {
                if(params) {
                    this.searchOption.category = params;
                    this.getDrugList(this.searchOption);
                }else{
                    this.searchOption.category='';
                    this.getDrugList();
                }
            }

        },

        activated(){
            //页面被打开时获取数据
            this.getDrugList();
        },
    }
</script>

<style scoped>

</style>
