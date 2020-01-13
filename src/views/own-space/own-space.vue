<style lang="less">
    @import './own-space.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息
            </p>
            <div>
                <Form :model="userForm" ref="userForm" @refreshUserListBySys="findPersonInfo" :label-width="100" label-position="right" :rules="editRules">
                    <FormItem label="账户：">
                        <span>{{userForm.username}}</span>
                    </FormItem>
                    <FormItem label="姓名：" prop="name">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.name"/>
                        </div>
                    </FormItem>
                    <FormItem label="用户类型：">
                        <span>{{userForm.role_desc}}</span>
                    </FormItem>
                    <FormItem label="手机号：" prop="phone">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.phone"/>
                        </div>
                    </FormItem>
                    <FormItem label="邮箱：" prop="email">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.email"/>
                        </div>
                    </FormItem>
                    <div style="margin-left: 13px">
                        <Button type="error" style="width: 100px;" @click="doCancel">取消</Button>
                        <Button type="success" style="width: 100px;" @click="editPersonInfo">保存</Button>
                    </div>
                </Form>
            </div>
        </Card>
    </div>
</template>

<script>
    import {findPersonInfo} from '@/libs/API/person.js';
    import {editPersonInfo} from '@/libs/API/person.js';

    export default {
        name: 'ownspace_index',
        data () {
            return {
                sysUserData: [],//系统用户列表数据（后台获取）
                userForm: {}, // 用户数据表单对象
                editPasswordModal: false, // 修改密码模态框显示
                savePassLoading: false,
                // 表单校验对象
                editRules: {
                    email: [
                        {type: 'email', message: '请输入正确邮箱格式', trigger: 'blur'}
                    ],
                    /*phone: [
                        {pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur'},
                    ],*/
                    name: [
                        {max: 20, message: '请输入20个以内字符', trigger: 'blur'},
                        {
                            pattern: /^[^~# @$……^。，；：“”‘’{}()`%!?*&|_+<>/,.;:'"=[\]\\]{0,20}$/,
                            message: '请勿输入非法字符',
                            trigger: 'blur'
                        },
                    ]
                },
            };
        },
        methods: {
            doCancel () {
                this.$store.commit('removeTag', 'ownspace_index');
                localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
                let lastPageName = '';
                if (this.$store.state.app.pageOpenedList.length > 1) {
                    lastPageName = this.$store.state.app.pageOpenedList[1].name;
                } else {
                    lastPageName = this.$store.state.app.pageOpenedList[0].name;
                }
                this.$router.push({
                    name: lastPageName
                });
            },
            async findPersonInfo(params) {
                let data = {};
                data.username = params;
                let res = await findPersonInfo(data);
                if (!res.errno) {
                    this.userForm = res.data;
                    this.userForm.username = params;
                }
            },
            async editPersonInfo() {
                this.$refs.userForm.validate( async (valid) => {//表单验证
                    if(valid){//表单验证成功
                        // let pwd = this.userForm.password; // 密码缓存
                        // let re_pwd = this.userForm.re_password;// 确认密码缓存
                        // this.userEditForm.password = md5(this.userEditForm.password); // md5加密
                        // this.userEditForm.re_password = md5(this.userEditForm.re_password); // md5加密
                        let data = {};
                        let form = this.userForm;
                        data.phone = form.phone;
                        data.name = form.name;
                        data.password = form.password;
                        data.email = form.email;
                        data.sex = form.sex;
                        data.weight=form.weight;
                        data.height=form.height;

                        let res = await editPersonInfo(data);
                        if(!res.code){
                            this.$Message.success('修改成功');
                            this.$emit('refreshUserListBySys');//调用父组件获取用户列表方法刷新列表
                        }else{
                            // this.userForm.password = pwd; // 复原密码
                            // this.userForm.re_password = re_pwd; // 复原密码
                            this.$Message.error(res.msg);
                        }
                    }else {
                        this.$Message.error('请正确填写表单')
                    }
                })
            },
        },
        created (){
            // this.searchByusername.search_data = this.$route.params.name;
            this.findPersonInfo(this.$route.query.username);
        },
    };
</script>


