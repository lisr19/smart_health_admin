<template>
    <Modal v-model="isEdit" title="修改标签" @on-cancel="doCancel">
        <Form :model="labelEditForm" ref="labelEditForm" :label-width="100" :rules="editRules">
            <FormItem label="标签名称：" prop="content">
                <Input clearable v-model="labelEditForm.content" placeholder="请输入内容"/>
            </FormItem>
            <FormItem label="父类：" prop="addCas">
                <Cascader :data="labelCas" v-model="labelEditForm.labelCas" change-on-select filterable></Cascader>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doLabelEdit">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {editLabel} from '@/libs/API/label.js';

    export default {
        name: 'label-edit',
        props:['labelCas'],
        data () {
            return {
                isEdit: false,
                labelEditForm: {},
                editRules:{
                    content:[
                        {required: true, message: '内容不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doLabelEdit() {
                this.$refs.labelAddForm.validate( async (valid) => {//表单验证
                    if(valid){
                        let form = this.labelEditForm;
                        delete form.createTime;
                        delete form.updateTime;
                        delete form._index;
                        delete form._rowKey;
                        let res = await editLabel(form);
                        if (!res.code) {
                            this.$Message.success('修改成功');
                            this.$emit('refreshLabelList');//调用父组件获取用户列表方法刷新列表
                            this.doCancel();
                        } else {
                            this.$Message.error(res.msg);
                        }
                    }else{
                        this.$Message.error('请正确填写表单')
                    }
                })

            },
            doCancel () {
                this.$refs.labelEditForm.resetFields();//重置表单
                this.labelEditForm = {};
                this.isEdit = false;
            }
        }
    };
</script>

<style scoped>

</style>
