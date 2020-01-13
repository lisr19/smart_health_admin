<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">疾病列表</p>
            <!--表格部分-->
            <Row>
                <Col span="8">
                    <Button type="primary" @click="openDiseaseAdd" style="width: 100px;">添加</Button>
                </Col>
                <Col span="4" offset="7">
                    <Select clearable @on-change="handleSearchByType" placeholder="选择科室">
                        <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{item.label}}
                        </Option>
                    </Select>
                </Col>
                <Col span="4" offset="1">
                    <Input v-model="search_data.name" icon="search" clearable @on-change="handleSearch"
                           placeholder="请输入名称搜索..."/>
                </Col>
            </Row>
        </Card>
        <Card>
            <div>
                <Table :columns="columnsList" :data="diseaseData" border
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
        <diseaseAdd ref="diseaseAdd" @refreshDiseaseList="getDiseaseList" :insuranceList="insuranceList"
                    :infectiousnessList="infectiousnessList" :departmentList="departmentList"/>
        <diseaseEdit ref="diseaseEdit" @refreshDiseaseList="getDiseaseList" :insuranceList="insuranceList"
                    :infectiousnessList="infectiousnessList" :departmentList="departmentList"/>
    </div>
</template>

<script>
    import diseaseAdd from './disease-add.vue';
    import diseaseEdit from './disease-edit.vue';
    import {findDiseaseList, delDisease} from '@/libs/API/disease.js';
    import util from '@/libs/util.js';

    export default {
        name: "disease-list",
        components: {
            diseaseAdd,
            diseaseEdit
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
                        title: '科室',
                        align: 'center',
                        key: 'department',
                        render:(h,params)=>{
                            return ('label', `${this.departmentList[params.row.department-1].label}`);
                        }
                    },
                    {
                        title: '医疗保险',
                        align: 'center',
                        key: 'medicalInsurance',
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
                                            this.openDiseaseEdit(data);
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
                                                    this.doDiseaseDel(id);
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
                diseaseData: [],//系统用户列表数据（后台获取）
                search_data: {},//搜索文章
                searchOption: {},//系统用户传到后台的对象
                insuranceList: [{value:'医保疾病',label:'医保疾病'},{value:'非医保疾病',label:'非医保疾病'}],
                infectiousnessList: [{value:'有传染性',label:'有传染性'},{value:'无传染性',label:'无传染性'}],
                departmentList: [{value:1,label:'内科'},{value:2,label:'外科'},{value:3,label:'儿科'},{value:4,label:'妇产科'},
                    {value:5,label:'男科'},{value:6,label:'皮肤性病科'},{value:7,label:'五官科'},{value:8,label:'老年科'},
                    {value:9,label:'精神心理科'},{value:1,label:'其他'}],
                page: {//系统用户翻页对象
                    total: 10,
                    currentPage: 1,
                    current: 1
                },
            }
        },
        methods: {
            //系统用户信息列表获取
            async getDiseaseList(params) {
                let data = {};
                data.page = this.page.currentPage;
                data.limit=10;
                if (params) {
                    data.name = params.name;
                    data.department = params.type;
                    data.page=params.page;
                }
                //系统用户列表类型为0
                let res = await findDiseaseList(data);
                if (!res.code) {
                    this.diseaseData = res.data.data;
                    this.page.total = res.data.total;
                }
            },
            //用户删除
            async doDiseaseDel(params) {
                let data = {};
                data.id = params.id;
                let res = await delDisease(data);
                if (!res.code) {
                    this.$Message.success('删除成功');
                    this.getDiseaseList();//刷新系统用户列表
                    this.search_data.name='';
                } else {
                    this.$Message.error(res.msg);
                }
            },

            //系统用户翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getDiseaseList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //打开系统用户添加页面
            openDiseaseAdd() {
                this.$refs.diseaseAdd.isAdd = true;
            },

            //打开系统用户编辑页面
            openDiseaseEdit(params) {
                this.$refs.diseaseEdit.isEdit = true;
                this.$refs.diseaseEdit.diseaseEditForm = params;
            },

            //系统用户表搜索（根据姓名或者手机）
            handleSearch() {
                if (this.search_data) {//判断搜索条件是否为空
                    console.log(this.search_data);
                    this.searchOption.name=this.search_data.name;
                    this.searchOption.department=this.search_data.department;
                    this.searchOption.page = 1;// 初始化搜索页数
                    this.getDiseaseList(this.searchOption);
                } else {//重置该搜索内容
                    this.searchOption.search = '';
                    this.getDiseaseList();
                }
            },
            handleSearchByType(params) {
                if (params) {//判断搜索条件是否为空
                    this.searchOption.type = params;
                    this.searchOption.page = 1;// 初始化搜索页数
                } else {//重置该搜索内容
                    this.searchOption.type = '';
                }
                this.getDiseaseList(this.searchOption);
            },

        },

        activated(){
            //页面被打开时获取数据
            this.getDiseaseList();
        },
    }
</script>

<style scoped>

</style>
