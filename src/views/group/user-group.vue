<style>

</style>
<template>
    <div>
        <Card>
            <p slot="title">用户所在组</p>
            <div>
                <Table :columns="columnsList" :data="userGroupData" border
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
        <Modal v-model="isDetail" title="组内成员列表" width="1200" @on-cancel="doCancel">
            <Card>
                <div>
                    <Table :columns="detailList" :data="groupDetail" border
                           disabled-hover></Table>
                </div>
            </Card>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import {getGroupList} from '@/libs/API/user.js';
    import util from '@/libs/util.js';
    import Cookies from 'js-cookie';

    export default {
        name: "user-group",
        components: {
        },
        data() {
            return {
                isDetail: false,//详情modal控制
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
                    },
                    {
                        title: 'pid',
                        align: 'center',
                        key: 'pid',
                    },
                    {
                        title: '机顶盒识别码',
                        align: 'center',
                        key: 'stbcode',
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
                                }, '详情'),
                            ]);
                        }
                    }
                ],
                detailList: [
                    {
                        title: '姓名',
                        align: 'center',
                        key: 'name',
                    },
                    {
                        title: '手机号',
                        align: 'center',
                        key: 'phone',
                    },
                    {
                        title: '身份证号',
                        align: 'center',
                        key: 'idNumber',
                    },
                    {
                        title: '性别',
                        align: 'center',
                        key: 'sex',
                        render:(h,params)=>{
                            return ('label', `${params.row.sex===1?'无':`${params.row.sex===2?'男':'女'}` }`);
                        }
                    },
                    {
                        title: '身高',
                        align: 'center',
                        key: 'height',
                    },
                    {
                        title: '体重',
                        align: 'center',
                        key: 'weight',
                    },
                    {
                        title: '邮箱',
                        align: 'center',
                        key: 'email',
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
                ],
                userData: '',
                userGroupData: [],//设备列表数据（后台获取）
                groupDetail: [],
                searchOption: {},
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
                data.userId = Cookies.get('id');
                //data.page = params.page

                //设备列表类型为0
                let res = await getGroupList(data);
                if (!res.code) {
                    this.userData=res.data;
                    this.userGroupData=[];
                    for(let i=0; i<res.data.length; ++i){
                        this.userGroupData.push(res.data[i].groupInfo);
                    }
                    console.log('data',this.userData);
                    this.page.total = res.data.length;
                }
            },
            // 打开详情
            openDetail(params) {
                this.groupDetail=this.userData[params._index].userList;
                this.isDetail = true;
            },
            //设备翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getGroupList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            doCancel() {
                this.isDetail = false;
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
