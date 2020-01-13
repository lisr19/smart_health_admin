<template>
    <Modal v-model="isEdit" @on-cancel="doCancel" title="编辑用户：">
        <Form :model="userEditForm" ref="userEditForm" :label-width="90" :rules="rules">
            <FormItem label="姓名：" prop="name">
                <Input clearable v-model="userEditForm.name" placeholder="请输入用户姓名"/>
            </FormItem>
            <FormItem label="身份证号：" prop="idNumber">
                <Input clearable v-model="userEditForm.idNumber" placeholder="请输入身份证号码"/>
            </FormItem>
            <FormItem label="性别：" prop="sex">
                <Select clearable filterable v-model="userEditForm.sex" style="max-width: 60%">
                    <Option v-for="item in roleList" :value="item.id" :key="item.id">{{item.sex_desc}}</Option>
                </Select>
            </FormItem>
            <FormItem label="密码：" prop="password">
                <Input clearable v-model="userEditForm.password" type="password"
                       placeholder="不修改时，请留空"/>
            </FormItem>
            <FormItem label="确认密码：" prop="re_password">
                <Input clearable v-model="userEditForm.re_password" type="password" placeholder="不修改时，请留空"/>
            </FormItem>
            <FormItem label="手机号：" prop="phone">
                <Input clearable v-model="userEditForm.phone" placeholder="请输入手机号码"/>
            </FormItem>
            <FormItem label="邮箱：" prop="email">
                <Input clearable v-model="userEditForm.email" placeholder="请输入邮箱"/>
            </FormItem>
            <FormItem label="身高(cm)：" prop="height">
                <Input clearable v-model="userEditForm.height" placeholder="请输入身高"/>
            </FormItem>
            <FormItem label="体重(kg)：" prop="weight">
                <Input clearable v-model="userEditForm.weight" placeholder="请输入体重"/>
            </FormItem>
        </Form>
        <!--自定义页脚-->
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doEditBySysUser">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {doEditBySysUser} from '@/libs/API/user.js';
    import {userRules} from "@/libs/check";
    import md5 from 'js-md5';

    export default {
        name: "sys-edit",
        data() {
            //密码二次验证规则
            const validatePassCheck = (rule, value, callback) => {
                if(value!==undefined) {
                    if (value !== this.userEditForm.password) {
                        callback(new Error('两次密码输入不一致'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
                isEdit: false, //modal显示控制
                userEditForm: {}, //用户数据表单对象
                //表单校验对象
                rules: {
                    re_password: [{validator: validatePassCheck, trigger: 'blur'}]
                }
            };
        },
        props: ['roleList'],

        methods: {
            //用户编辑
            async doEditBySysUser() {
                this.$refs.userEditForm.validate( async (valid) => {//表单验证
                    if(valid){//表单验证成功
                        let pwd = this.userEditForm.password; // 密码缓存
                        let re_pwd = this.userEditForm.re_password;// 确认密码缓存
                        // this.userEditForm.password = md5(this.userEditForm.password); // md5加密
                        // this.userEditForm.re_password = md5(this.userEditForm.re_password); // md5加密
                        let data = {};
                        let form = this.userEditForm;
                        data.id = form.id;
                        data.phone = form.phone;
                        data.name = form.name;
                        data.password = form.password;
                        data.email = form.email;
                        data.sex = form.sex;
                        data.weight=form.weight;
                        data.height=form.height;

                        //console.log('1',data);
                        let res = await doEditBySysUser(data);
                        if(!res.code){
                            this.$Message.success('修改成功');
                            this.$emit('refreshUserListBySys');//调用父组件获取用户列表方法刷新列表
                            this.doCancel();
                        }else{
                            this.userEditForm.password = pwd; // 复原密码
                            this.userEditForm.re_password = re_pwd; // 复原密码
                            this.$Message.error(res.msg);
                        }
                    }else {
                        this.$Message.error('请正确填写表单')
                    }
                })
            },
            //取消页面
            doCancel() {
                this.$refs.userEditForm.resetFields();//重置表单
                this.userEditForm = {};
                this.isEdit = false;
            }
        },
        created(){
            this.rules.phone = userRules.phone
            this.rules.idNumber = userRules.idNumber
            this.rules.name = userRules.name
            this.rules.password = userRules.password
            this.rules.email = userRules.email
            this.rules.weight = userRules.weight
            this.rules.height =userRules.height
        }
    }
</script>

<style scoped>

</style>
