<template>
    <Modal v-model="isEdit" title="修改疾病" @on-cancel="doCancel">
        <Form :model="diseaseEditForm" ref="diseaseEditForm" :label-width="100" :rules="EditRules">
            <FormItem label="名称：" prop="name">
                <Input clearable v-model="diseaseEditForm.name" placeholder="请输入名称"/>
            </FormItem>
            <FormItem label="科室：" prop="department">
                <Select clearable v-model="diseaseEditForm.department">
                    <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="介绍：" prop="introduction">
                <Input clearable v-model="diseaseEditForm.introduction" placeholder="请输入介绍"/>
            </FormItem>
            <FormItem label="医保：" prop="medicalInsurance">
                <Select clearable v-model="diseaseEditForm.medicalInsurance" style="max-width: 60%">
                    <Option v-for="item in insuranceList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="别名：" prop="alias">
                <Input clearable v-model="diseaseEditForm.alias" placeholder="请输入别名"/>
            </FormItem>
            <FormItem label="发病部位：" prop="incidenceSite">
                <Input clearable v-model="diseaseEditForm.incidenceSite" placeholder="请输入发病部位"/>
            </FormItem>
            <FormItem label="传染性：" prop="infectiousness">
                <Select clearable v-model="diseaseEditForm.infectiousness" style="max-width: 60%">
                    <Option v-for="item in infectiousnessList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="多发人群：" prop="common">
                <Input clearable v-model="diseaseEditForm.common" placeholder="请输入多发人群"/>
            </FormItem>
            <FormItem label="相关症状：" prop="relatedSymptoms">
                <Input clearable v-model="diseaseEditForm.relatedSymptoms" placeholder="请输入相关症状"/>
            </FormItem>
            <FormItem label="并发症：" prop="concurrentIsease">
                <Input clearable v-model="diseaseEditForm.concurrentIsease" placeholder="请输入并发症"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doDiseaseEdit">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {editDisease} from '@/libs/API/disease.js';

    export default {
        name: 'disease-Edit',
        props: ['insuranceList', 'infectiousnessList', 'departmentList'],
        data () {
            return {
                isEdit: false,
                diseaseEditForm: {},
                defaultList: [],
                uploadList: [],
                EditRules:{
                    name:[
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                    ],
                    department:[
                        {required: true, message: '科室必须为数字', trigger: 'blur', type:'number'},
                    ]
                }
            };
        },
        methods: {
            async doDiseaseEdit() {
                let form = this.diseaseEditForm;
                let res = await editDisease(form);
                if (!res.code) {
                    this.$Message.success('修改成功');
                    this.$emit('refreshDiseaseList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.diseaseEditForm.resetFields();//重置表单
                this.diseaseEditForm = {};
                this.isEdit = false;
            }
        }
    };
</script>

<style scoped>

</style>
