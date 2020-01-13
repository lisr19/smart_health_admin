<template>
    <Modal v-model="isDetail" title="添加组成员" width="1200" @on-cancel="doCancel">
        <!--按钮部分-->
        <Card>
            <!--表格部分-->
            <Row style="margin-bottom: 15px">
                <Col span="2">
                   <p style="font-weight: bolder;margin-top: 6px">选择系统用户</p>
                </Col>
                <Col span="4" offset="18">
                    <Input v-model="searchSysUser" icon="search" clearable @on-change="handleSearch"
                           placeholder="请输入姓名或手机搜索..."/>
                </Col>
            </Row>

            <div>
                <Table :columns="detailList" :data="sysUserData" border
                       disabled-hover></Table>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                          @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <div slot="footer"></div>
    </Modal>
</template>

<script>
    import {addGroupMember} from '@/libs/API/group.js';
    import {findUserList} from "../../libs/API/user";
    export default {
        name: 'member-add',
        data () {
            return {
                isDetail: false,
                detailList: [
                    {
                        title: '姓名',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '手机号',
                        align: 'center',
                        key: 'phone'
                    },
                    {
                        title: '身高',
                        align: 'center',
                        key: 'height'
                    },
                    {
                        title: '体重',
                        align: 'center',
                        key: 'weight'
                    },
                    {
                        title: '邮箱',
                        align: 'center',
                        key: 'email'
                    },
                    {
                        title: '添加时间',
                        align: 'center',
                        key: 'createTime',
                        sortable: true
                    },
                    {
                        title: '更新时间',
                        align: 'center',
                        key: 'updateTime',
                        sortable: true
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
                                            this.doAddMember(params.row);
                                        }
                                    }
                                }, '添加')
                            ]);
                        }
                    }
                ],
                sysUserData: [],
                groupId: '',
                searchSysUser: '',// 搜索系统用户名称
                searchOption: {},//系统用户传到后台的对象
                page: {//系统用户翻页对象
                    total: 0,
                    currentPage: 1,
                    current: 1
                },
            };
        },
        methods: {
            //系统用户信息列表获取
            async getUserListBySys (params) {
                let data = {};
                if (params) {
                    data.search = params.search;
                    data.page = params.page;
                }
                //系统用户列表类型为0
                let res = await findUserList(data);
                if (!res.code) {
                    this.sysUserData = res.data.data;
                    this.page.total = res.data.total;
                }
            },
            async doAddMember(params) {
                let data = {};
                data.userId = params.id;
                data.groupId = this.groupId;
                let res = await addGroupMember(data);
                if(!res.code){
                    this.$Message.success('添加成功');
                }else{
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.isDetail=false;
            },
            // 系统用户表搜索（根据姓名或者手机）
            handleSearch () {
                if (this.searchSysUser) { // 判断搜索条件是否为空
                    this.searchOption.search = this.searchSysUser;
                    this.searchOption.page = 1;// 初始化搜索页数
                    this.getUserListBySys(this.searchOption);
                } else { // 重置该搜索内容
                    this.searchOption.search = '';
                    this.getUserListBySys();
                }
            },
            //系统用户翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getUserListBySys(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
        }
    };
</script>

<style scoped>

</style>
