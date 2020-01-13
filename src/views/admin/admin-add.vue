<template>
    <Modal v-model="isAdd" @on-cancel="doCancel" title="添加管理员：">
        <Form :model="adminAddForm" ref="adminAddForm" :label-width="90" :rules="addRules">
            <FormItem label="手机号：" prop="phone">
                <Input clearable v-model="adminAddForm.phone" placeholder="请输入手机号码"/>
            </FormItem>
            <FormItem label="姓名：" prop="name">
                <Input clearable v-model="adminAddForm.name" placeholder="请输入用户姓名"/>
            </FormItem>
            <FormItem label="密码：" prop="password">
                <Input clearable v-model="adminAddForm.password" type="password"
                       placeholder="请输入6-20位由大小写字母、数字、符号：?、!、@组成的密码"/>
            </FormItem>
            <FormItem label="确认密码：" prop="re_password">
                <Input clearable v-model="adminAddForm.re_password" type="password" placeholder="请再次输入密码"/>
            </FormItem>
        </Form>
        <!--自定义页脚-->
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doAdminAddBySystem">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {addAdmin} from '@/libs/API/admin.js';
    import md5 from 'js-md5';

    export default {
        name: "sys-add",
        data() {
            //密码二次验证规则
            const validatePassCheck = (rule, value, callback) => {
                if (value !== this.adminAddForm.password) {
                    callback(new Error('两次密码输入不一致'));
                } else {
                    callback();
                }
            };

            return {
                isAdd: false, //model显示控制
                adminAddForm: {},//用户数据表单对象
                //表单校验对象
                addRules: {
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {
                            pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
                            message: '密码格式不正确',
                            trigger: 'blur'
                        },
                    ],
                    re_password: [
                        {required: true, validator: validatePassCheck, trigger: 'blur'},
                        {
                            pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
                            message: '密码格式不正确',
                            trigger: 'blur'
                        },
                    ],
                    phone: [
                        {required: true, message: '手机号码不能为空', trigger: 'blur'},
                        //{pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur'},
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
            async doAdminAddBySystem() {
                this.$refs.adminAddForm.validate( async (valid) => {//表单验证
                    if(valid){//表单验证成功
                        let pwd = this.adminAddForm.password; // 密码缓存
                        let re_pwd = this.adminAddForm.re_password;// 确认密码缓存
                        // this.adminAddForm.password = md5(this.adminAddForm.password); // md5加密
                        // this.adminAddForm.re_password = md5(this.adminAddForm.re_password); // md5加密
                        let data = {};
                        let form = this.adminAddForm;
                        data.name = form.name;
                        data.phone = form.phone;
                        data.password = form.password;

                        let res = await addAdmin(data);
                        if(!res.code){
                            this.$Message.success('添加成功');
                            this.$emit('refreshAdminList');//调用父组件获取用户列表方法刷新列表
                            this.doCancel();
                        }else{
                            this.adminAddForm.password = pwd; // 复原密码
                            this.adminAddForm.re_password = re_pwd; // 复原密码
                            this.$Message.error(res.msg);
                        }
                    }else {
                        this.$Message.error('请正确填写表单')
                    }
                })
            },
            //取消页面
            doCancel() {
                this.$refs.adminAddForm.resetFields();//重置表单
                this.adminAddForm = {};
                this.isAdd = false;
            },
        },
    }
</script>

<style scoped>

</style>
