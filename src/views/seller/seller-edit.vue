<template>
    <Modal v-model="isEdit" title="修改商家" @on-cancel="doCancel">
        <Form :model="sellerEditForm" ref="sellerEditForm" :label-width="100" :rules="editRules">
            <FormItem label="名称：" prop="content">
                <Input clearable v-model="sellerEditForm.name"/>
            </FormItem>
            <FormItem label="地址：" prop="address">
                <Input clearable v-model="sellerEditForm.address"/>
            </FormItem>
            <FormItem label="电话：" prop="address">
                <Input clearable v-model="sellerEditForm.phone"/>
            </FormItem>
            <FormItem label="描述：" prop="description">
                <Input clearable v-model="sellerEditForm.description"/>
            </FormItem>
            <FormItem label="经营范围：" prop="businessScope">
                <Input clearable v-model="sellerEditForm.businessScope"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doSellerEdit">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {editSeller} from '@/libs/API/seller.js';

    export default {
        name: 'seller-edit',
        data () {
            return {
                isEdit: false,
                sellerEditForm: {},
                editRules:{
                    content:[
                        {required: true, message: '内容不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doSellerEdit() {
                let form = this.sellerEditForm;
                delete form.createTime;
                delete form.imgUrl;
                delete form.imgKey;
                delete form._index;
                delete form._rowKey;
                let res = await editSeller(form);
                if (!res.code) {
                    this.$Message.success('修改成功');
                    this.$emit('refreshSellerList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.sellerEditForm.resetFields();//重置表单
                this.sellerEditForm = {};
                this.isEdit = false;
            }
        }
    };
</script>

<style scoped>

</style>
