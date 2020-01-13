<template>
    <Modal v-model="isAdd" title="添加标签" @on-cancel="doCancel">
        <Form :model="labelAddForm" ref="labelAddForm" :label-width="100" :rules="addRules">
            <FormItem label="标签名称：" prop="content">
                <Input clearable v-model="labelAddForm.content" placeholder="请输入标签名称"/>
            </FormItem>
            <FormItem label="父类：" prop="addCas">
                <Cascader :data="labelCas" v-model="labelAddForm.addCas" change-on-select filterable></Cascader>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doLabelAdd">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {addLabel} from '@/libs/API/label.js';

    export default {
        name: 'label-add',
        props:['labelCas'],
        data () {
            return {
                isAdd: false,
                labelAddForm: {
                    addCas:[]
                },
                addRules:{
                    content:[
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doLabelAdd() {
                this.$refs.labelAddForm.validate( async (valid) => {//表单验证
                    if(valid){
                        let form = this.labelAddForm;
                        let res = await addLabel(form);
                        if (!res.code) {
                            this.$Message.success('添加成功');
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
                this.$refs.labelAddForm.resetFields();//重置表单
                this.labelAddForm = {};
                this.isAdd = false;
            }
        }
    };
</script>

<style scoped>

</style>
