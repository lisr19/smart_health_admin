<template>
    <Modal v-model="isEdit" title="修改视频系列" @on-cancel="doCancel">
        <Form :model="videoSeriesEditForm" ref="videoSeriesEditForm" :label-width="100" :rules="editRules">
            <FormItem label="名称：" prop="name">
                <Input clearable v-model="videoSeriesEditForm.name" placeholder="请输入名称"/>
            </FormItem>
            <FormItem label="Url：" prop="imageUrl">
                <Input clearable v-model="videoSeriesEditForm.imageUrl" placeholder="请输入Url"/>
            </FormItem>
            <FormItem label="描述：" prop="desc">
                <Input clearable v-model="videoSeriesEditForm.desc" placeholder="请输入描述"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doVideoSeriesEdit">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {editVideoSeries} from '@/libs/API/videoSeries.js';

    export default {
        name: 'videoSeries-edit',
        data () {
            return {
                isEdit: false,
                videoSeriesEditForm: {},
                editRules:{
                    name:[
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                    ],
                    imageUrl:[
                        {required: true, message: '链接不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doVideoSeriesEdit() {
                let form = this.videoSeriesEditForm;
                let res = await editVideoSeries(form);
                if (!res.code) {
                    this.$Message.success('添加成功');
                    this.$emit('refreshVideoSeriesList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.videoSeriesEditForm.resetFields();//重置表单
                this.videoSeriesEditForm = {};
                this.isEdit = false;
            }
        }
    };
</script>

<style scoped>

</style>
