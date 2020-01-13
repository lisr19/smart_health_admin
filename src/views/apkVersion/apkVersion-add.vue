<template>
    <Modal v-model="isAdd" title="添加版本号" @on-cancel="doCancel">
        <Form :model="apkVersionAddForm" ref="apkVersionAddForm" :label-width="100" :rules="addRules">
            <FormItem label="版本号：" prop="version">
                <Input clearable v-model="apkVersionAddForm.version" placeholder="请输入版本号"/>
            </FormItem>
            <FormItem label="类型：" prop="type">
                <Select clearable v-model="apkVersionAddForm.type">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="下载链接：" prop="url">
                <Input clearable v-model="apkVersionAddForm.url" placeholder="请输入下载链接"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doApkVersionAdd">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {addApkVersion} from '@/libs/API/apkVersion.js';

    export default {
        name: 'apkVersion-add',
        props: ['typeList'],
        data () {
            return {
                isAdd: false,
                apkVersionAddForm: {},
                addRules:{
                    version:[
                        {required: true, message: '版本号不能为空', trigger: 'blur'},
                    ],
                    url:[
                        {required: true, message: '下载链接不能为空', trigger: 'blur'},
                    ],
                    type:[
                        {required: true, message: '类型不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doApkVersionAdd() {
                let form = this.apkVersionAddForm;
                let res = await addApkVersion(form);
                if (!res.code) {
                    this.$Message.success('添加成功');
                    this.$emit('refreshApkVersionList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.apkVersionAddForm.resetFields();//重置表单
                this.apkVersionAddForm = {};
                this.isAdd = false;
            }
        }
    };
</script>

<style scoped>

</style>
