<template>
    <Modal v-model="isAdd" title="添加机顶盒" @on-cancel="doCancel">
        <Form :model="stbAddForm" ref="stbAddForm" :label-width="100" :rules="stbRules">
            <FormItem label="设备识别码：" prop="code">
                <Input clearable v-model="stbAddForm.code" placeholder="请输入设备识别码"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doStbAdd">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {addStb} from '@/libs/API/stb.js';

    export default {
        name: 'stb-add',
        data () {
            return {
                isAdd: false,
                stbAddForm: {},
                stbRules:{
                    code:[
                        {required: true, message: '识别码不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doStbAdd() {
                let form = this.stbAddForm;
                let res = await addStb(form);
                if (!res.code) {
                    this.$Message.success('添加成功');
                    this.$emit('refreshStbList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.stbAddForm.resetFields();//重置表单
                this.stbAddForm = {};
                this.isAdd = false;
            },
            handleTime(params){
                this.stbAddForm.startTime=params;
            },
            handleTime1(params){
                this.stbAddForm.endTime=params;
            }
        }
    };

</script>

<style scoped>

</style>
