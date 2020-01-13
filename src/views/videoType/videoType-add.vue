<template>
    <Modal v-model="isAdd" title="添加视频系列" @on-cancel="doCancel">
        <Form :model="videoTypeAddForm" ref="videoTypeAddForm" :label-width="100" :rules="addRules">
            <FormItem label="名称：" prop="name">
                <Input clearable v-model="videoTypeAddForm.name" placeholder="请输入名称"/>
            </FormItem>
            <FormItem label="父系列：" prop="pid">
                <Select v-model="videoTypeAddForm.pid" style="width:200px">
                    <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doVideoTypeAdd">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {addVideoType} from '@/libs/API/videoType.js';

    export default {
        name: 'videoType-add',
        data () {
            return {
              typeList:[],//类型列表
                isAdd: false,
                videoTypeAddForm: {
                  name:""// 类型名称
                },
                addRules:{
                    name:[
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doVideoTypeAdd() {
                let form = this.videoTypeAddForm;
                let res = await addVideoType(form);
                if (!res.code) {
                    this.$Message.success('添加成功');
                    this.$emit('refreshVideoTypeList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.videoTypeAddForm.resetFields();//重置表单
                this.videoTypeAddForm = {};
                this.isAdd = false;
            }
        }
    };
</script>

<style scoped>

</style>
