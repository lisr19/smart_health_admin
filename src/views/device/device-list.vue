<style>

</style>
<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">设备类型列表</p>
            <!--表格部分-->
            <Row>
                <Col span="8">
                    <Button type="primary" @click="openDeviceAdd" style="width: 100px;">添加</Button>
                    <Button type="error" @click="batchDel" style="width: 100px">批量删除</Button>
                </Col>
                <Col span="5" offset="11">
                    <Input v-model="searchDevice" icon="search" clearable @on-change="handleSearch"
                           placeholder="请输入设备名称/制造商/品牌搜索..."/>
                </Col>
            </Row>
        </Card>
        <Card>
            <div>
                <Table :columns="columnsList" :data="deviceData" @on-selection-change="batchSelect" border
                       disabled-hover></Table>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                          @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <!--用户添加/编辑页面组件插入-->
        <deviceAdd ref="deviceAdd" @refreshDeviceList="getDevieList"></deviceAdd>
        <deviceEdit ref="deviceEdit" @refreshDeviceList="getDevieList"></deviceEdit>
    </div>
</template>

<script>
    import deviceAdd from './device-add.vue';
    import deviceEdit from './device-edit.vue';
    import {findDeviceList, addDevice, updateDevice, delDevice} from '@/libs/API/device.js';
    import util from '@/libs/util.js';

    export default {
        name: "device-list",
        components: {
            deviceAdd,
            deviceEdit,
        },
        data() {
            return {
                //设备列表头数组
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
                        title: '制造商',
                        align: 'center',
                        key: 'maker',
                    },
                    {
                        title: '品牌',
                        align: 'center',
                        key: 'brand',
                    },
                    {
                        title: '介绍',
                        align: 'center',
                        key: 'introduction',
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
                                            this.openDeviceEdit(data);
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
                                                    let id = {type: 0, ids: params.row.id.toString()};
                                                    this.doDeviceDel(id);
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
                deviceData: [],//设备列表数据（后台获取）
                searchDevice: '',//搜索设备名称
                searchOption: {},//设备传到后台的对象
                //设备批量选择的id对象
                delId: {
                    ids: ''
                },
                page: {//设备翻页对象
                    total: 10,
                    currentPage: 1,
                    current: 1
                },
            }
        },
        methods: {
            //设备信息列表获取
            async getDevieList(params) {
                let data = {};
                if (params) {
                    data.search = params.search;
                    data.page = params.page
                }
                //设备列表类型为0
                let res = await findDeviceList(data);
                if (!res.code) {
                    this.deviceData = res.data.data;
                    this.page.total = res.data.total;
                }
            },
            //用户删除
            async doDeviceDel(params) {
                let data = {};
                data.ids = params.ids;
                let res = await delDevice(data);
                if (!res.code) {
                    this.$Message.success('删除成功');
                    this.getDevieList();//刷新设备列表
                } else {
                    this.$Message.error(res.msg);
                }
            },
            // 设备批量删除
            batchDel() {
                if (this.delId.ids) {
                    this.$Modal.confirm({  // 打开确认对话框
                        content: '<p>确定删除吗？</p>',
                        // 确认删除
                        onOk: async () => {
                            let res = await delDevice(this.delId);
                            if (!res.code) {
                                this.$Message.success('删除成功');
                                this.delId.ids = '';
                            } else {
                                this.$Message.error(res.msg);
                            }
                            this.getDevieList();
                        },
                        // 取消删除
                        onCancel: () => {
                            this.$Message.info('取消删除！');
                        }
                    })
                } else {
                    this.$Message.info('请选择需要删除的用户！');
                }
            },

            // 设备批量选择
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

            //设备翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getDevieList(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //打开设备添加页面
            openDeviceAdd() {
                this.$refs.deviceAdd.isAdd = true;
            },

            //打开设备编辑页面
            openDeviceEdit(params) {
                this.$refs.deviceEdit.isEdit = true;
                this.$refs.deviceEdit.deviceEditForm = params;
            },

            //设备列表搜索（根据姓名或者手机）
            handleSearch() {
                if (this.searchDevice) {//判断搜索条件是否为空
                    this.searchOption.search= this.searchDevice;
                    this.searchOption.page = 1;// 初始化搜索页数
                    this.getDevieList(this.searchOption);
                } else {//重置该搜索内容
                    this.searchOption.search_data = '';
                    this.getDevieList();
                }
            },
        },

        created(){
            //页面被打开时获取数据
            this.getDevieList();
        },
    }
</script>

<style scoped>

</style>
