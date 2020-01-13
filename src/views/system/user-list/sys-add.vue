<template>
    <Modal v-model="isAdd" @on-cancel="doCancel" title="添加用户：">
        <Form :model="userAddForm" ref="userAddForm" :label-width="90" :rules="rules">
            <FormItem label="手机号：" prop="phone">
                <Input clearable v-model="userAddForm.phone" placeholder="请输入手机号码"/>
            </FormItem>
            <FormItem label="身份证号：" prop="idNumber">
                <Input clearable v-model="userAddForm.idNumber" placeholder="请输入身份证号码"/>
            </FormItem>
            <FormItem label="姓名：" prop="name">
                <Input clearable v-model="userAddForm.name" placeholder="请输入用户姓名"/>
            </FormItem>
            <FormItem label="性别：" prop="sex">
                <Select clearable v-model="userAddForm.sex" style="max-width: 60%">
                    <Option v-for="item in roleList" :value="item.id" :key="item.id">{{item.sex_desc}}</Option>
                </Select>
            </FormItem>
            <FormItem label="密码：" prop="password">
                <Input clearable v-model="userAddForm.password" type="password"
                       placeholder="请输入6-20位由大小写字母、数字、符号：?、!、@组成的密码"/>
            </FormItem>
            <FormItem label="确认密码：" prop="re_password">
                <Input clearable v-model="userAddForm.re_password" type="password" placeholder="请再次输入密码"/>
            </FormItem>
            <FormItem label="邮箱：" prop="email">
                <Input clearable v-model="userAddForm.email" placeholder="请输入邮箱"/>
            </FormItem>
            <FormItem label="身高(cm)：" prop="height">
                <Input clearable v-model="userAddForm.height" placeholder="请输入身高"/>
            </FormItem>
            <FormItem label="体重(kg)：" prop="weight">
                <Input clearable v-model="userAddForm.weight" placeholder="请输入体重"/>
            </FormItem>
        </Form>
        <!--自定义页脚-->
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doUserAddBySystem">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {doUserAddBySystem} from '@/libs/API/user';
    import {userRules} from "@/libs/check";
    import md5 from 'js-md5';

    export default {
        name: "sys-add",
        data() {
            //密码二次验证规则
            const validatePassCheck = (rule, value, callback) => {
                if (value !== this.userAddForm.password) {
                    callback(new Error('两次密码输入不一致'));
                } else {
                    callback();
                }
            };
            return {
                isAdd: false, //model显示控制
                userAddForm: {},//用户数据表单对象
                //表单校验对象
                rules: {
                    re_password: [{validator: validatePassCheck, trigger: 'blur'}]
                }
            };
        },
        props: ['roleList'],

        methods: {
            //用户添加
            async doUserAddBySystem() {
                this.$refs.userAddForm.validate( async (valid) => {//表单验证
                    if(valid){//表单验证成功
                        let pwd = this.userAddForm.password; // 密码缓存
                        let re_pwd = this.userAddForm.re_password;// 确认密码缓存
                        // this.userAddForm.password = md5(this.userAddForm.password); // md5加密
                        // this.userAddForm.re_password = md5(this.userAddForm.re_password); // md5加密
                        let data = {};
                        let form = this.userAddForm;
                        data.name = form.name;
                        data.phone = form.phone;
                        data.password = form.password;
                        data.email = form.email;
                        data.sex = form.sex;
                        data.idNumber=form.idNumber;
                        data.weight=form.weight;
                        data.height=form.height;
                        // console.log('form',form);
                        let res = await doUserAddBySystem(data);
                        if(!res.code){
                            this.$Message.success('添加成功');
                            this.$emit('refreshUserListBySys');//调用父组件获取用户列表方法刷新列表
                            this.doCancel();
                        }else{
                            this.userAddForm.password = pwd; // 复原密码
                            this.userAddForm.re_password = re_pwd; // 复原密码
                            this.$Message.error(res.msg);
                        }
                    }else {
                        this.$Message.error('请正确填写表单')
                    }
                })
            },
            //取消页面
            doCancel() {
                this.$refs.userAddForm.resetFields();//重置表单
                this.userAddForm = {};
                this.isAdd = false;
            },
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
