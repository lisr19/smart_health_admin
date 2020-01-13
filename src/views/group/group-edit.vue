<template>
    <Modal v-model="isEdit" title="修改组" @on-cancel="doCancel">
        <Form :model="groupEditForm" ref="groupEditForm" :label-width="100" :rules="editRules">
            <FormItem label="名称：" prop="name">
                <Input clearable v-model="groupEditForm.name" placeholder="请输入名称"/>
            </FormItem>
            <FormItem label="类型：" prop="typeId">
                <Select clearable v-model="groupEditForm.typeId">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="pid：" prop="pid">
                <Input clearable v-model="groupEditForm.pid" placeholder="请输入pid"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doGroupEdit">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {editGroup} from '@/libs/API/group.js';

    export default {
        name: 'group-edit',
        props: ['typeList'],
        data () {
            return {
                isEdit: false,
                groupEditForm: {},
                editRules:{
                    name:[
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doGroupEdit() {
                let form = this.groupEditForm;
                let data={};
                data.id=form.id;
                data.name=form.name;
                data.typeId=form.typeId;
                data.pid=form.pid;

                let res = await editGroup(data);
                if (!res.code) {
                    this.$Message.success('修改成功');
                    this.$emit('refreshGroupList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.groupEditForm.resetFields();//重置表单
                this.groupEditForm = {};
                this.isEdit = false;
            }
        }
    };
</script>

<style scoped>

</style>
