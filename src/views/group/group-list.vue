<style>

</style>
<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">组列表</p>
            <!--表格部分-->
            <Row>
                <Col span=2 offset="0">
                    <Button type="primary" @click="openGroupAdd" style="width: 100px;">添加组</Button>
                </Col>
                <Col span="4" offset="10">
                    <Select clearable @on-change="handleSearchByType" placeholder="选择组类型">
                        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}
                        </Option>
                    </Select>
                </Col>
                <Col span="4" offset="0">
                    <Input v-model="search_data.name" icon="search" clearable @on-change="handleSearch"
                           placeholder="请输入组名"/>
                </Col>
                <Col span="4" offset="0">
                    <Input v-model="search_data.pid" icon="search" clearable @on-change="handleSearch"
                           placeholder="请输入pid"/>
                </Col>

            </Row>
        </Card>
        <Card>
            <div>
                <Table :columns="columnsList" :data="groupData" border
                       disabled-hover></Table>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                          @on-change="changePage"></Page>
                </div>
            </div>
        </Card>

        <!--详情modal-->
        <Modal v-model="isAdd" title="添加组" @on-cancel="doCancel">
            <Form :model="groupAddForm" :label-width="100" :rules="editRules">
                <FormItem label="组名：" prop="name">
                    <Input clearable v-model="groupAddForm.name" placeholder="请输入组名"/>
                </FormItem>
                <FormItem label="类型：" prop="typeId">
                    <Select clearable placeholder="选择组类型" v-model="groupAddForm.typeId">
                        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="pid：" prop="pid">
                    <Input clearable v-model="groupAddForm.pid" placeholder="请输入pid"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="doCancel">取消</Button>
                <Button type="primary" @click="doGroupAdd">确认</Button>
            </div>
        </Modal>
        <!--组添加页面组件插入-->
        <memberAdd ref="memberAdd" @refreshGroupList="getGroupList"></memberAdd>
        <groupEdit ref="groupEdit" @refreshGroupList="getGroupList" :typeList="typeList"></groupEdit>
    </div>
</template>

<script>
    import memberAdd from './member-add.vue'
    import groupEdit from './group-edit.vue'
    import {getGroupList, addGroup} from '@/libs/API/group.js';
    import Cookies from 'js-cookie'
    import util from '@/libs/util.js';

    export default {
        name: "group-list",
        components: {
            memberAdd,
            groupEdit
        },
        data() {
            return {
                isAdd: false,//详情modal控制
                isDetail: false,
                //设备列表头数组
                columnsList: [
                    {
                        title: '名称',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '类型',
                        align: 'center',
                        key: 'typeId',
                        render:(h,params)=>{
                            return ('label', `${params.row.typeId===1?'家庭':`公司`}`);
                        }
                    },
                    {
                        title: 'pid',
                        align: 'center',
                        key: 'pid',
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
                        key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.openDetail(params.row);
                                        }
                                    }
                                }, '添加组成员'),
                                h('Button', {
                                    props: {
                                        type: 'primary'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let data = Object.assign({},params.row);
                                            this.openEdit(data);
                                        }
                                    }
                                }, '修改')
                            ]);
                        }
                    }
                ],
                detailList: [

                    {
                        title: '名称',
                        align: 'center',
                        key: 'name',
                    }
                ],
                groupAddForm: {},
                editRules: {},
                groupData: [],//设备列表数据（后台获取）
                groupDetail: [],
                search_data: {},//搜索设备名称
                searchOption: {},//设备传到后台的对象
                typeList:[{value:1,label:'家庭'},{value:2,label:'公司'}],
                page: {//设备翻页对象
                    total: 10,
                    currentPage: 1,
                    current: 1
                },
            }
        },
        methods: {
            //设备信息列表获取
            async getGroupList(params) {
                let data = {};
                if (params) {
                    data.name = params.name;
                    data.typeId=params.typeId;
                    data.page = params.page;
                }
                //设备列表类型为0
                let res = await getGroupList(data);
                if (!res.code) {
                    this.groupData=res.data;
                    this.page.total = res.data.length;
                }
            },
            // 打开详情
            openDetail(params) {
                this.$refs.memberAdd.isDetail=true;
                this.$refs.memberAdd.groupId=params.id;
            },
            openEdit(params){
                this.$refs.groupEdit.isEdit=true;
                this.$refs.groupEdit.groupEditForm=params;
            },
            openGroupAdd(){
                this.isAdd=true;
            },
            async doGroupAdd() {
                let data = {};
                data.name = this.groupAddForm.name;
                data.pid = this.groupAddForm.pid;
                data.typeId = this.groupAddForm.typeId;
                data.userId=Cookies.get('id');
                let res = await addGroup(data);
                if(!res.code){
                    this.$Message.success('添加成功');
                    this.doCancel();
                    this.getGroupList();
                }else{
                    this.$Message.error(res.msg);
                }
            },
            //设备翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getGroupList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //设备列表搜索（根据姓名或者手机）
            handleSearch() {
                if (this.search_data) {//判断搜索条件是否为空
                    this.searchOption.name= this.search_data.name;
                    this.searchOption.typeId=this.search_data.typeId;
                    this.searchOption.page = 1;// 初始化搜索页数
                    this.getGroupList(this.searchOption);
                } else {//重置该搜索内容
                    this.searchOption.search = '';
                    this.groupData=[];
                    this.getGroupList();
                }
            },
            handleSearchByType(params){
                if(params) {
                    this.searchOption.typeId = params;
                    this.getGroupList(this.searchOption);
                }else{
                    this.searchOption.typeId='';
                    this.getGroupList();
                }
            },
            doCancel() {
                this.isAdd = false;
            },
        },
        activated(){
            //页面被打开时获取数据
            this.getGroupList();
        },
    }
</script>

<style scoped>

</style>
