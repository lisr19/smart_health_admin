<template>
    <Modal v-model="isAdd" title="添加药品" @on-cancel="doCancel">
        <Form :model="drugAddForm" ref="drugAddForm" :label-width="100" :rules="addRules">
            <FormItem label="名称：" prop="name">
                <Input clearable v-model="drugAddForm.name" placeholder="请输入名称"/>
            </FormItem>
            <FormItem label="类型：" prop="type">
                <Input clearable v-model="drugAddForm.type" placeholder="请输入类型"/>
            </FormItem>
            <FormItem label="类别：" prop="category">
                <Select clearable v-model="drugAddForm.category">
                    <Option v-for="item in categoryList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="别名：" prop="alias">
                <Input clearable v-model="drugAddForm.alias" placeholder="请输入别名"/>
            </FormItem>
            <FormItem label="图片链接：" prop="imageUrl">
                <Input clearable v-model="drugAddForm.imageUrl" placeholder="请输入图片链接"/>
            </FormItem>
            <FormItem label="药用部位：" prop="medicinalPart">
                <Input clearable v-model="drugAddForm.medicinalPart" placeholder="请输入药用部位"/>
            </FormItem>
            <FormItem label="成分：" prop="component">
                <Input clearable v-model="drugAddForm.component" placeholder="请输入成分"/>
            </FormItem>
            <FormItem label="功能主治：" prop="functionalManage">
                <Input clearable v-model="drugAddForm.functionalManage" placeholder="请输入功能主治"/>
            </FormItem>
            <FormItem label="药理作用：" prop="pharmacological">
                <Input clearable v-model="drugAddForm.pharmacological" placeholder="请输入药理作用"/>
            </FormItem>
            <FormItem label="用法用量：" prop="usageDosage">
                <Input clearable v-model="drugAddForm.usageDosage" placeholder="请输入药理作用"/>
            </FormItem>
            <FormItem label="宜忌：" prop="compatIncompat">
                <Input clearable v-model="drugAddForm.compatIncompat" placeholder="请输入宜忌"/>
            </FormItem>
            <FormItem label="选方：" prop="prescription">
                <Input clearable v-model="drugAddForm.prescription" placeholder="请输入选方"/>
            </FormItem>
            <FormItem label="临床应用：" prop="clinicalApplication">
                <Input clearable v-model="drugAddForm.clinicalApplication" placeholder="请输入临床应用"/>
            </FormItem>
            <FormItem label="不良反应：" prop="adverseReactions">
                <Input clearable v-model="drugAddForm.adverseReactions" placeholder="请输入药理作用"/>
            </FormItem>
            <FormItem label="注意事项：" prop="matters">
                <Input clearable v-model="drugAddForm.matters" placeholder="请输入注意事项"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doDrugAdd">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {addDrug} from '@/libs/API/drug.js';

    export default {
        name: 'drug-add',
        props: ['categoryList'],
        data () {
            return {
                isAdd: false,
                drugAddForm: {},
                addRules:{
                    name:[
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                    ],
                    type:[
                        {required: true, message: '类型不能为空', trigger: 'blur'},
                    ],
                    category:[
                        {required: true, message: '类别不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doDrugAdd() {
                let form = this.drugAddForm;
                let res = await addDrug(form);
                if (!res.code) {
                    this.$Message.success('添加成功');
                    this.$emit('refreshDrugList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.drugAddForm.resetFields();//重置表单
                this.drugAddForm = {};
                this.isAdd = false;
            }
        }
    };
</script>

<style scoped>

</style>
