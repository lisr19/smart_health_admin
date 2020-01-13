<template>
    <Modal v-model="isEdit" title="修改视频系列" @on-cancel="doCancel">
        <Form :model="videoTypeEditForm" ref="videoTypeEditForm" :label-width="100" :rules="editRules">
            <FormItem label="名称：" prop="name">
                <Input clearable v-model="videoTypeEditForm.name" placeholder="请输入名称"/>
            </FormItem>
            <FormItem label="父系列：" prop="pid">
                <Select v-model="videoTypeEditForm.pid" style="width:200px">
                    <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doVideoTypeEdit">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {updateVideoType} from '@/libs/API/videoType.js';

    export default {
        name: 'videoType-edit',
        data () {
            return {
              typeList:[],//类型列表
                isEdit: false,
                videoTypeEditForm: {
                  pid:"",// 父系列id
                  name:""// 类型名称
                },
                editRules:{
                    name:[
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doVideoTypeEdit() {
                let form = this.videoTypeEditForm;
                delete(form.createTime);
                let res = await updateVideoType(form);
                if (!res.code) {
                    this.$Message.success('修改成功');
                    this.$emit('refreshVideoTypeList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.videoTypeEditForm.resetFields();//重置表单
                this.videoTypeEditForm = {};
                this.isEdit = false;
            }
        }
    };
</script>

<style scoped>

</style>
