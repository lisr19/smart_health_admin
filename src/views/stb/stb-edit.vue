<template>
    <Modal v-model="isEdit" title="添加机顶盒" @on-cancel="doCancel">
        <Form :model="stbEditForm" ref="stbEditForm" :label-width="100" :rules="stbRules">
            <FormItem label="设备识别码：" prop="code">
                <Input clearable v-model="stbEditForm.code" placeholder="请输入设备识别码"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doStbEdit">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {editStb} from '@/libs/API/stb.js';

    export default {
        name: 'stb-edit',
        data () {
            return {
                isEdit: false,
                stbEditForm: {},
                stbRules:{
                    code:[
                        {required: true, message: '识别码不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doStbEdit() {
                let form = this.stbEditForm;
                let res = await editStb(form);
                if (!res.code) {
                    this.$Message.success('添加成功');
                    this.$emit('refreshStbList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.stbEditForm.resetFields();//重置表单
                this.stbEditForm = {};
                this.isEdit = false;
            },
            handleTime(params){
                this.stbEditForm.startTime=params;
            },
            handleTime1(params){
                this.stbEditForm.endTime=params;
            }
        }
    };

</script>

<style scoped>

</style>
