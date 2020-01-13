<template>
    <Modal v-model="isAdd" title="添加疾病" @on-cancel="doCancel">
        <Form :model="diseaseAddForm" ref="diseaseAddForm" :label-width="100" :rules="addRules">
            <FormItem label="名称：" prop="name">
                <Input clearable v-model="diseaseAddForm.name" placeholder="请输入名称"/>
            </FormItem>
            <FormItem label="科室：" prop="department">
                <Select clearable v-model="diseaseAddForm.department">
                    <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="介绍：" prop="introduction">
                <Input clearable v-model="diseaseAddForm.introduction" placeholder="请输入介绍"/>
            </FormItem>
            <FormItem label="医保：" prop="medicalInsurance">
                <Select clearable v-model="diseaseAddForm.medicalInsurance">
                    <Option v-for="item in insuranceList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="别名：" prop="alias">
                <Input clearable v-model="diseaseAddForm.alias" placeholder="请输入别名"/>
            </FormItem>
            <FormItem label="发病部位：" prop="incidenceSite">
                <Input clearable v-model="diseaseAddForm.incidenceSite" placeholder="请输入发病部位"/>
            </FormItem>
            <FormItem label="传染性：" prop="infectiousness">
                <Select clearable v-model="diseaseAddForm.infectiousness">
                    <Option v-for="item in infectiousnessList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
            </FormItem>
            <FormItem label="多发人群：" prop="common">
                <Input clearable v-model="diseaseAddForm.common" placeholder="请输入多发人群"/>
            </FormItem>
            <FormItem label="相关症状：" prop="relatedSymptoms">
                <Input clearable v-model="diseaseAddForm.relatedSymptoms" placeholder="请输入相关症状"/>
            </FormItem>
            <FormItem label="并发症：" prop="concurrentIsease">
                <Input clearable v-model="diseaseAddForm.concurrentIsease" placeholder="请输入并发症"/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doDiseaseAdd">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import {addDisease} from '@/libs/API/disease.js';

    export default {
        name: 'disease-add',
        props: ['insuranceList', 'infectiousnessList','departmentList'],
        data () {
            return {
                isAdd: false,
                diseaseAddForm: {},
                addRules:{
                    name:[
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                    ],
                    department:[
                        {required: true, message: '科室不能为空', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            async doDiseaseAdd() {
                let form = this.diseaseAddForm;
                let res = await addDisease(form);
                if (!res.code) {
                    this.$Message.success('添加成功');
                    this.$emit('refreshDiseaseList');//调用父组件获取用户列表方法刷新列表
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            },
            doCancel () {
                this.$refs.diseaseAddForm.resetFields();//重置表单
                this.diseaseAddForm = {};
                this.isAdd = false;
            }
        }
    };
</script>

<style scoped>

</style>
