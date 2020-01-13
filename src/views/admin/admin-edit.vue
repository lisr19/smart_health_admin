<template>
    <Modal v-model="isEdit" @on-cancel="doCancel" title="修改管理员信息：">
        <Form :model="adminEditForm" ref="adminEditForm" :label-width="90" :rules="editRules">
            <FormItem label="姓名：" prop="name">
                <Input clearable v-model="adminEditForm.name" placeholder="请输入用户姓名"/>
            </FormItem>
            <FormItem label="密码：" prop="password">
                <Input clearable v-model="adminEditForm.password" type="password"
                       placeholder="请输入6-20位由大小写字母、数字、符号：?、!、@组成的密码"/>
            </FormItem>
            <FormItem label="确认密码：" prop="re_password">
                <Input clearable v-model="adminEditForm.re_password" type="password" placeholder="请再次输入密码"/>
            </FormItem>
        </Form>
        <!--自定义页脚-->
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doAdminEditBySystem">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {editAdmin} from '@/libs/API/admin.js';
    import md5 from 'js-md5';

    export default {
        name: "sys-edit",
        data() {
            //密码二次验证规则
            const validatePassCheck = (rule, value, callback) => {
                if(value!==undefined) {
                    if (value !== this.adminEditForm.password) {
                        callback(new Error('两次密码输入不一致'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };

            return {
                isEdit: false, //model显示控制
                adminEditForm: {},//用户数据表单对象
                //表单校验对象
                editRules: {
                    password: [
                        {required: false, message: '密码不能为空', trigger: 'blur'},
                        {
                            pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
                            message: '密码格式不正确',
                            trigger: 'blur'
                        },
                    ],
                    re_password: [
                        {required: false, validator: validatePassCheck, trigger: 'blur'},
                        {
                            pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
                            message: '密码格式不正确',
                            trigger: 'blur'
                        },
                    ],
                    name: [
                        {max: 20, message: '请输入20个以内字符', trigger: 'blur'},
                        {
                            pattern:/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
                            message:'姓名只含有汉字、数字、字母、下划线不能以下划线开头和结尾',
                            trigger:'blur'
                        }
                    ],
                },
            };
        },

        methods: {
            //用户添加
            async doAdminEditBySystem() {
                this.$refs.adminEditForm.validate( async (valid) => {//表单验证
                    if(valid){//表单验证成功
                        let pwd = this.adminEditForm.password; // 密码缓存
                        let re_pwd = this.adminEditForm.re_password;// 确认密码缓存
                        // this.adminEditForm.password = md5(this.adminEditForm.password); // md5加密
                        // this.adminEditForm.re_password = md5(this.adminEditForm.re_password); // md5加密
                        let data = {};
                        let form = this.adminEditForm;
                        data.id=form.id;
                        data.name = form.name;
                        data.phone = form.phone;
                        data.password = form.password;

                        let res = await editAdmin(data);
                        if(!res.code){
                            this.$Message.success('修改成功');
                            this.$emit('refreshAdminList');//调用父组件获取用户列表方法刷新列表
                            this.doCancel();
                        }else{
                            this.adminEditForm.password = pwd; // 复原密码
                            this.adminEditForm.re_password = re_pwd; // 复原密码
                            this.$Message.error(res.msg);
                        }
                    }else {
                        this.$Message.error('请正确填写表单')
                    }
                })
            },
            //取消页面
            doCancel() {
                this.$refs.adminEditForm.resetFields();//重置表单
                this.adminEditForm = {};
                this.isEdit = false;
            },
        },
    }
</script>

<style scoped>

</style>
