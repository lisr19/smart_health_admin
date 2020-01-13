<template>
    <div>
        <!--按钮部分-->
        <Card>
            <p slot="title">运营管理员权限列表</p>
            <!--表格部分-->
            <Row>
                <Col span="4" offset="20">
                    <Input v-model="searchRole" icon="search" @on-change="handleSearchByName" clearable placeholder="请输入姓名或账号搜索..."/>
                </Col>
            </Row>
            <br>
            <div>
                <Table :columns="columnsList" :data="roleData"  border disabled-hover></Table>
            </div>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page show-total show-elevator :total="page.count" :current="page.currentPage"
                          @on-change="changePage"></Page>
                </div>
            </div>
        </Card>
        <!--编辑用户权限Modal-->
        <Modal v-model="isEdit" @on-cancel="doCancel" title="编辑用户权限：" width="720">
            <Card>
                <p style="font-size: 14px;color: #464c5b;font-weight: 700;line-height: 20px;">
                    角色账号：<span style="font-size: 13px;color: #9E9E9E">{{accessEditForm.username}}</span>
                </p>
            </Card>
            <Form :model="accessEditForm" ref="accessEditForm" :label-width="120">
                <Card>
                    <p slot="title">功能列表：</p>
                    <FormItem v-for="(item,index) in accessList" :label="accessList[index].name+'：'" :key="index" >
                        <Checkbox v-model="group[index].checkAll" :value="item.id" @on-change="v=>{handleCheckAll(v,index,group)}">{{item.name+'（全选）'}}</Checkbox>
                        <Checkbox-group v-model="group[index].checkAllGroup" @on-change="checkAllGroupChange(index,group)">
                            <Checkbox  v-for="(item1,index1) in accessList[index].children" :key="index1" :value="item1.id" :label="item1.name"></Checkbox>
                        </Checkbox-group>
                    </FormItem>
                </Card>
            </Form>
            <!--自定义页脚-->
            <div slot="footer">
                <Button type="text" @click="doCancel">取消</Button>
                <Button type="primary" @click="userAccessEdit">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    //import {getAccessList} from "@/libs/API/access.js";
    import {getAccessListByUser,userAccessEdit} from '@/libs/API/user.js'
    import util from '@/libs/util.js';
    export default {
        name: 'access',
        data() {
            return {
                isEdit: false,//角色权限modal显示控制
                //节点用户表头数组
                columnsList: [
                    {
                        title: '账号',
                        align: 'center',
                        width: 200,
                        key: 'username',
                    },
                    {
                        title: '姓名',
                        align: 'center',
                        width: 200,
                        key: 'name',
                    },
                    {
                        title: '权限',
                        align: 'center',
                        key: 'access_info',
                        render: (h, params) => {
                            if (params.row.access_info) {
                                let array = params.row.access_info.split(',');
                                let group = [];//权限id数组
                                for (let i = 0; i < array.length; i++) {//获取权限id数组
                                    let res = array[i].split('-');
                                    group.push(res[1]);
                                }
                                let str = group.toString();
                                let texts = '';//表格列显示文字
                                if (str) {
                                    if (str.length > 85) {//进行截取列显示字数
                                        texts = str.substring(0, 85) + ".....";
                                    } else {
                                        texts = str;
                                    }
                                }
                                return h('p', [
                                    h('Poptip', {
                                        props: {
                                            trigger:"hover",
                                            placement: 'top',
                                        },
                                    }, [//这个中括号表示是Tooltip标签的子标签
                                        texts,//表格列显示文字
                                        h('p', {
                                            slot: 'content',
                                            style: {
                                                maxWidth:'300px',
                                                fontSize:'14px',
                                                whiteSpace: 'normal'
                                            },
                                        }, str)//整个的信息即气泡内文字
                                    ])
                                ])
                            } else {
                                return h('span', [
                                    params.row.access_info === '' ? '无' : params.row.access_info
                                ])
                            }
                        }
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
                                            let data = Object.assign({},params.row)
                                            this.openRoleAccessEdit(data);
                                        }
                                    }
                                }, '编辑'),
                            ]);
                        }
                    }
                ],
                roleData: [],//角色列表数据数组（后台获取）
                searchRole: '',//用户搜索字段
                accessList:[],//权限列表
                searchOption: {},//传到后台的对象
                group:[],//多选选项数组
                accessEditForm: {},//编辑用户权限表单对象
                page: {//翻页对象
                    total: 10,
                    currentPage: 1,
                    current: 1
                },
            }
        },

        methods: {
            //查询运营管理员用户权限列表
            async getAccessListByUser(params) {
                let res = await getAccessListByUser(params);
                if (!res.errno) {
                    this.roleData = res.data.data;
                    this.page = res.data;
                } else {
                    this.$Message.error(res.errmsg);
                }
            },
            //获取权限列表
            async getAccessList(){
                let res = await getAccessList({type:1});
                if(!res.errno){
                    this.accessList = util.array2tree((v) => {
                        v.value = v.id;
                        v.label = v.name;
                        v.type = v.type
                    }, res.data);
                    this.tool4GroupArray(this.group);
                }else{
                    this.$Message.error(res.errmsg);
                }
            },
            //修改运营管理员用户权限列表
            async userAccessEdit(){
                let data = {};
                data.user_id = this.accessEditForm.id;
                let id = '';
                this.group.forEach((v)=>{
                    if(v.checkAll){
                        if(id){
                            if(v.checkAllGroup.length > 0){
                                id = id + ',' + v.id + ',' +v.checkAllGroupById.toString();
                            }else{
                                id = id + ',' + v.id
                            }
                            // console.log(id);
                        }else{
                            if(v.checkAllGroup.length > 0){
                                id = v.id + ',' +v.checkAllGroupById.toString();
                            }else{
                                id = v.id
                            }
                        }
                    }else{
                        if(v.checkAllGroup.length > 0){
                            if(id){
                                id = id + ',' +v.checkAllGroupById.toString();
                            }else{
                                id = v.checkAllGroupById.toString();
                            }
                        }
                    }
                });
                data.access_ids = id;
                // console.log('data',data);
                let res = await userAccessEdit(data);
                if(!res.errno){
                    this.$Message.success('修改成功');
                    this.doCancel();
                    this.getAccessListByUser();//刷新列表
                }else{
                    this.$Message.error(res.errmsg);
                }
            },
            //重置多选选项数组
            tool4GroupArray(res) {
                for (let i = 0; i < this.accessList.length; i++) {
                    res.push(//按节点类型的权限列表载入
                        {
                            id: this.accessList[i].id.toString(),
                            checkAll: false,
                            checkAllGroup: [],//多选选项
                            checkAllGroupById: [],//多选选项id
                        }
                    );
                }
            },
            //打开角色权限编辑页面
            openRoleAccessEdit(params) {
                this.group = [];
                this.tool4GroupArray(this.group);
                this.isEdit = true;
                this.accessEditForm = params;
                let array = params.access_info.split(',');
                let group = [];//权限id数组
                for(let i=0;i<array.length;i++){//获取权限id数组
                    let res = array[i].split('-');
                    group.push(res[0]);
                }
                // console.log(this.accessList);
                group.forEach((k)=>{
                    this.tool4GroupById(k,this.accessList,this.group);
                })
            },
            //判断权限id在多选项中的位置
            tool4GroupById(k, list, res) {
                list.forEach((v, index) => {
                    if (k === v.id) {
                        if (v.pid === '0') {//若pid为0则为父类（该id子选项全选）
                            this.handleCheckAll(true, index, res);
                            res[index].checkAll = true;
                            return
                        } else {
                            res[v.pid - 1].checkAllGroup.push(v.name);
                            res[v.pid - 1].checkAllGroupById.push(v.id);
                        }
                    } else if (v.children) {
                        if(!res[index].checkAll){
                            this.tool4GroupById(k, v.children, res);
                        }
                    }
                })
            },
            //节点用户翻页
            changePage(page) {
                this.searchOption.page = page;
                this.getUserListByNode(this.searchOption);
                localStorage.page = JSON.stringify(this.page);
            },
            //多选选项全选
            //params 判断是否全选；index 数组位置；res 被调整的数组对象
            handleCheckAll(params, index, res) {
                if (this.accessList[index]) {
                    if (this.accessList[index][`children`]) {//若该权限有子类
                        if (params) {//若为全选
                            for (let i = 0; i < this.accessList[index].children.length; i++) {
                                let status = false;//判断数组中是否已存在该id，false为不存在
                                for(let j=0;j<res[index].checkAllGroupById.length;j++){
                                    if(res[index].checkAllGroupById[j] === this.accessList[index].children[i].id){
                                        status = true;
                                    }
                                }
                                if(!status){//若不存在则添加
                                    res[index].checkAllGroup.push(this.accessList[index].children[i].name);
                                    res[index].checkAllGroupById.push(this.accessList[index].children[i].id);
                                }
                            }
                        } else {//若不为全选
                            res[index].checkAllGroup.splice(0, res[index].checkAllGroup.length);//删除所有选项
                            res[index].checkAllGroupById = [];//删除所有选项
                        }
                    }
                }
            },
            //多选选选状态
            checkAllGroupChange(index, res) {
                if (this.accessList[index][`children`]) {//若该权限有子类
                    res[index].checkAllGroupById = [];//重置id数组
                    let id = [];
                    res[index].checkAllGroup.forEach(v => {
                        this.accessList[index].children.forEach(k => {
                            if (v === k.name) {
                                id.push(k.id.toString())
                            }
                        })
                    });
                    res[index].checkAllGroupById = id;//储存id
                    //若长度相同则为全选
                    if (res[index].checkAllGroup.length === this.accessList[index].children.length) {
                        res[index].checkAll = true;
                    } else {
                        res[index].checkAll = false;
                    }
                }
            },
            //根据姓名或账号获取权限列表
            handleSearchByName(){
                if (this.searchRole) {//判断搜索条件是否为空
                    this.searchOption.search = this.searchRole;
                    this.searchOption.page = 1; // 初始化页数
                    this.getAccessListByUser(this.searchOption);
                } else {//重置该搜索内容
                    this.searchOption.search = '';
                    this.getAccessListByUser(this.searchOption);
                }
            },
            //关闭编辑modal
            doCancel(){
                this.isEdit = false;
            }
        },


        activated() {
            // console.log(this,this.$route);
            this.getAccessListByUser();
            this.getAccessList();
        }
    };
</script>

<style scoped>

</style>
