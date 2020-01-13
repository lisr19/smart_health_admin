<style>

</style>
<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">用户列表</p>
            <!--表格部分-->
            <Row>
                <Col span="8">
                    <Button type="primary" @click="openUserAddBySys" style="width: 100px;">添加</Button>
                    <Button type="error" @click="batchDel" style="width: 100px">批量删除</Button>
                </Col>
                <Col span="3" offset="8">
                    <Select clearable @on-change="handleSearchByUserType" placeholder="选择用户类型">
                        <Option v-for="item in sysRoleList" :value="item.id" :key="item.id">{{item.sex_desc}}
                        </Option>
                    </Select>
                </Col>
                <Col span="4" offset="1">
                    <Input v-model="searchSysUser" icon="search" clearable @on-change="handleSearch"
                           placeholder="请输入姓名或手机搜索..."/>
                </Col>
            </Row>
        </Card>
        <Card>
            <div>
                <Table :columns="columnsList" :data="sysUserData" @on-selection-change="batchSelect" border
                       disabled-hover></Table>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                          @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <!--用户标签-->
        <modal v-model="isLabel" title="编辑用户标签" @on-cancel="doCancelByUserLabelEdit" width="600">
            <Card>
                <p slot="title">添加用户标签</p>
                <Row>
                    <Col span="12">
                        <!--<Select ref="userLabelForm" clearable v-model="userLabelForm.labelId" placeholder="选择用户标签">-->
                        <!--<Option v-for="item in labelData" :value="item.id" :key="item.id">{{item.content}}</Option>-->
                        <!--</Select>-->
                        <Cascader ref="userLabelForm" :data="labelData" v-model="userLabelForm.labelCas"></Cascader>
                    </Col>
                    <Col span="4" offset="1">
                        <Button type="primary" @click="doUserLabelAdd">添加</Button>
                    </Col>
                </Row>

            </Card>
            <Card>
                <p slot="title">已有用户标签</p>
                <Tag type="border" closable color="blue" v-for="(item,index) in userLabelForm.labelArray" :key="item.id"
                     :name="item.content" @on-close="doUserLabelDel(item.id,index)">{{item.content}}
                </Tag>
            </Card>
            <div slot="footer">
                <Button type="text" @click="doCancelByUserLabelEdit">取消</Button>
            </div>
        </modal>
        <!--用户画像-->
        <Modal v-model="isPortrait" title="用户画像" @on-cancel="doCancelByUserPortrait" width="600">
            <Card>
                <p slot="title">用户姓名：{{userName}}</p>
                <div id="userPortrait" style="width: 568px;height: 500px;text-align:center;margin-left: -16px"></div>
            </Card>
            <div slot="footer">
                <Button type="text" @click="doCancelByUserPortrait">取消</Button>
            </div>
        </Modal>
        <!--用户添加/编辑页面组件插入-->
        <sysAdd ref="sysAdd" @refreshUserListBySys="getUserListBySys" :roleList="sysRoleList"></sysAdd>
        <sysEdit ref="sysEdit" @refreshUserListBySys="getUserListBySys" :roleList="sysRoleList"></sysEdit>
    </div>
</template>

<script>
    import sysAdd from './user-list/sys-add.vue';
    import sysEdit from './user-list/sys-edit.vue';
    import {findUserList, getRoleListByType, doUserDel, doUserLabelAdd, doUserLabelDel} from '@/libs/API/user.js';
    import {findLabelList} from "@/libs/API/label";
    import util from '@/libs/util.js';

    export default {
        name: "user-list",
        components: {
            sysAdd,
            sysEdit,
        },
        data() {
            return {
                isLabel: false,//用户标签控制modal
                isPortrait: false,//用户画像控制modal
                //系统用户表头数组
                columnsList: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
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
                        title: '性别',
                        align: 'center',
                        key: 'sex',
                        render: (h, params) => {
                            return ('label', `${params.row.sex === 1 ? '无' : `${params.row.sex === 2 ? '男' : '女'}` }`);
                        }
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
                                            let sex = params.row.sex === 1 ? '无' : params.row.sex === 2 ? '男' : '女'
                                            let newYear = new Date().getFullYear()
                                            let age = parseInt(newYear) - params.row.year
                                            let data = {
                                                name: params.row.name,
                                                labelArray: params.row.labels,
                                                sex: sex,
                                                age: age
                                            }
                                            console.log(data)
                                            this.openUserPortrait(data)
                                            // let data = Object.assign({},params.row);
                                            // this.openUserEditBySys(data);
                                        }
                                    }
                                }, '画像'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            let data = {
                                                userId: params.row.id,
                                                labelArray: params.row.labels
                                            }
                                            this.openUserLabel(data)
                                        }
                                    }
                                }, '标签'),
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
                                            this.openUserEditBySys(data);
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
                                                    this.doUserDel(id);
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
                sysUserData: [],//系统用户列表数据（后台获取）
                sysRoleList: [{id: 1, sex_desc: '无'}, {id: 2, sex_desc: '男'}, {id: 3, sex_desc: '女'}],
                searchSysUser: '',//搜索系统用户名称
                searchOption: {},//系统用户传到后台的对象
                userLabelForm: {},//用户标签对象
                labelData: [],//标签数据（后台获取）
                resLabelData: [],//标签数据（未组装前）
                userName:'',//用户画像用户姓名
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
            async getUserListBySys(params) {
                let data = {};
                if (params) {
                    data.search = params.search;
                    data.page = params.page;
                }
                let res = await findUserList(data);
                if (!res.code) {
                    this.sysUserData = res.data.data;
                    // console.log(this.sysUserData)
                    this.page.total = res.data.total;
                }else{
                    this.$Message.error(res.msg)
                }
            },
            //获取标签列表
            async getLabelList() {
                let res = await findLabelList({limit: 1000})
                // console.log(res)
                if (!res.code) {
                    this.resLabelData = res.data
                    this.labelData = util.array2tree(v => {
                        v.label = v.content
                        v.value = v.id
                    }, res.data)
                } else {
                    this.$Message.error(res.msg)
                }
            },
            //用户删除
            async doUserDel(params) {
                let data = {};
                data.ids = params.ids;
                let res = await doUserDel(data);
                if (!res.code) {
                    this.$Message.success('删除成功');
                    this.getUserListBySys();//刷新系统用户列表
                } else {
                    this.$Message.error(res.msg);
                }
            },
            // 系统用户批量删除
            batchDel() {
                if (this.delId.ids) {
                    this.$Modal.confirm({  // 打开确认对话框
                        content: '<p>确定删除吗？</p>',
                        // 确认删除
                        onOk: async () => {
                            let res = await doUserDel(this.delId);
                            if (!res.code) {
                                this.$Message.success('删除成功');
                                this.delId.ids = '';
                            } else {
                                this.$Message.error(res.msg);
                            }
                            this.getUserListBySys();
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

            //用户标签添加
            async doUserLabelAdd() {
                let array = this.userLabelForm.labelCas
                let ref = this.$refs.userLabelForm.selected[array.length - 1].content
                // console.log(ref)
                let form = {
                    labelId: array[array.length - 1],
                    userId: this.userLabelForm.userId
                }
                // console.log(form)
                let res = await doUserLabelAdd(form)
                if (!res.code) {
                    this.$Message.success('添加成功')
                    this.userLabelForm.labelArray.push({id: array[array.length - 1], content: ref})
                    this.userLabelForm.labelCas = []
                } else {
                    this.$Message.error(res.msg)
                }
            },
            //用户标签删除
            async doUserLabelDel(labelId, index) {
                // console.log('标签',labelId,'位置',index)
                let data = {
                    labelId: labelId,
                    userId: this.userLabelForm.userId
                }
                let res = await doUserLabelDel(data)
                if (!res.code) {
                    this.$Message.success('删除成功')
                    this.userLabelForm.labelArray.splice(index, 1)
                } else {
                    this.$Message.error(res.msg)
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

            //系统用户翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getUserListBySys(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //打开系统用户添加页面
            openUserAddBySys() {
                this.$refs.sysAdd.isAdd = true;
            },

            //打开系统用户编辑页面
            openUserEditBySys(params) {
                this.$refs.sysEdit.isEdit = true;
                this.$refs.sysEdit.userEditForm = params;
            },

            //系统用户表搜索（根据姓名或者手机）
            handleSearch() {
                if (this.searchSysUser) {//判断搜索条件是否为空
                    this.searchOption.search = this.searchSysUser;
                    this.searchOption.page = 1;// 初始化搜索页数
                    this.getUserListBySys(this.searchOption);
                } else {//重置该搜索内容
                    this.searchOption.search_data = '';
                    this.getUserListBySys();
                }
            },

            //系统用户表筛选（根据用户类型）
            handleSearchByUserType(params) {
                if (params) {//判断搜索条件是否为空
                    this.searchOption.sex = params;
                    this.searchOption.page = 1;// 初始化搜索页数
                    this.getUserListBySys(this.searchOption);
                } else {//重置该搜索内容
                    this.searchOption.sex = '';
                    this.getUserListBySys();
                }
            },

            //用户标签modal打开
            openUserLabel(params) {
                this.userLabelForm = params
                this.isLabel = true
            },
            //用户标签modal关闭
            doCancelByUserLabelEdit() {
                this.isLabel = false
            },

            //用户画像modal打开
            openUserPortrait(params) {
                this.userName = params.name
                let dom = document.getElementById('userPortrait')
                let myChart = this.$echarts.init(dom)
                let array = []
                let array2 = []
                let data = []
                params.labelArray.forEach(v=>{
                    let res = []
                    this.toolsForCas(this.resLabelData,v.id.toString(),res)
                    array.push(res)
                })
                array.forEach((v,index)=>{
                    v.forEach((k)=>{
                        if(k.pid === '0'){
                            array2.push({
                                name:k.name,
                                value:1,
                            })
                        }else{
                            if(array2[index].children){
                                array2[index].children[0].children = [{
                                    name:k.name,
                                    value:1
                                }]
                            }else{
                                array2[index].children = [{
                                    name:k.name,
                                    value:1
                                }]
                            }
                        }
                    })
                })
                let length = array2.length
                for(let i =0;i<array2.length;i++){
                    let q = i+1
                    for(let j=i+1;j<length;j++){
                        if(array2[q]){
                            if(array2[i].name === array2[q].name){
                                if(array2[i].children){
                                    let isExist = false //该子类是否存在
                                    for(let k=0;k<array2[i].children.length;k++){
                                        if(array2[i].children[k].name === array2[q].children[0].name){
                                            array2[i].children[k].children.push(array2[q].children[0].children[0])
                                            array2[i].children[k].value = array2[i].children[k].children.length
                                            isExist = true
                                            break
                                        }
                                    }
                                    if(!isExist){
                                        array2[i].children.push(array2[q].children[0])
                                    }
                                    array2.splice(q,1)
                                    let sum = 0
                                    array2[i].children.forEach(v=>{
                                        sum = v.children.length + sum
                                    })
                                    array2[i].value = sum
                                }
                                // console.log(array2[q].name)
                            }else{
                                q++
                            }
                        }else{
                            break
                        }

                    }
                }
                console.log(array2)
                data =array2
                // 绘制图表
                myChart.setOption({
                    series: {
                        type: 'sunburst',
                        name: '用户画像',
                        // highlightPolicy: 'ancestor',
                        data: data,
                        radius: [20, '100%'],
                        center: ['50%', '50%'],
                        label: {
                            rotate: 'radial'
                        }
                    }
                })
                this.isPortrait = true
            },
            //用户画像modal关闭
            doCancelByUserPortrait(params) {
                this.isPortrait = false
            },
            //画像数据组装
            toolsForCas(array, id, resArray) {
                array.forEach((v) => {
                    if (v.id === id) {
                        if (v.id === 0) {
                            if (resArray.length === 0) {
                                resArray.unshift({
                                    name: v.content,
                                    id : v.id,
                                    pid : v.pid
                                })
                            }
                        } else {
                            resArray.unshift({
                                name: v.content,
                                id : v.id,
                                pid : v.pid
                            })
                            this.toolsForCas(array, v.pid, resArray)
                        }
                    }
                })
            }
        },

        created() {
            this.getUserListBySys()
            this.getLabelList()
        }
    }
</script>

<style scoped>

</style>
