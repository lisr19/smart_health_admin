<template>
    <Modal v-model="isAdd" @on-cancel="doCancel" title="添加设备类型：">
        <Form :model="deviceAddForm" ref="deviceAddForm" :label-width="90" :rules="addRules">
            <FormItem label="设备类型：" prop="name">
                <Input clearable v-model="deviceAddForm.name" placeholder="请输入设备类型"/>
            </FormItem>
            <FormItem label="制造商：" prop="maker">
                <Input clearable v-model="deviceAddForm.maker" placeholder="请输入制造商"/>
            </FormItem>
            <FormItem label="品牌：" prop="brand">
                <Input clearable v-model="deviceAddForm.brand" placeholder="请输入品牌"/>
            </FormItem>
            <FormItem label="介绍：" prop="introduction">
                <Input clearable v-model="deviceAddForm.introduction" placeholder="请输入介绍"/>
            </FormItem>
        </Form>
        <!--自定义页脚-->
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doDeviceAdd">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {addDevice} from '@/libs/API/device.js';
    import md5 from 'js-md5';

    export default {
        name: "device-add",
        data() {
            return {
                isAdd: false, //model显示控制
                deviceAddForm: {},//用户数据表单对象
                //表单校验对象
                addRules: {
                    name: [
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                        {max: 20, message: '请输入20个以内字符', trigger: 'blur'},
                        {
                            pattern:/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
                            message:'名称只含有汉字、数字、字母、下划线不能以下划线开头和结尾',
                            trigger:'blur'
                        }
                    ],
                    maker:[],
                    brand:[],
                    introduction:[]
                }
            };
        },

        methods: {
            //用户添加
            async doDeviceAdd() {
                this.$refs.deviceAddForm.validate( async (valid) => {//表单验证
                    if(valid){//表单验证成功
                        let data = {};
                        let form = this.deviceAddForm;
                        data.name = form.name;
                        data.maker = form.maker;
                        data.brand=form.brand;
                        data.introduction=form.introduction;

                        let res = await addDevice(data);
                        if(!res.code){
                            this.$Message.success('添加成功');
                            this.$emit('refreshDeviceList');//调用父组件获取用户列表方法刷新列表
                            this.doCancel();
                        }else{
                            this.$Message.error(res.msg);
                        }
                    }else {
                        this.$Message.error('请正确填写表单')
                    }
                })
            },
            //取消页面
            doCancel() {
                this.$refs.deviceAddForm.resetFields();//重置表单
                this.deviceAddForm = {};
                this.isAdd = false;
            },
        },
    }
</script>

<style scoped>

</style>
