<style lang="less">
    @import '../../../styles/loading.less';
</style>

<template>
    <Modal v-model="isShow" width="1200" title="添加富文本" @on-cancel="doCancel">
        <Card shadow>
            <div style="height: 50px">
                标题：
                <Input v-model="textAddForm.title" style="width:1000px"/>
            </div>
            <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
        </Card>
        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载组件中...</div>
        </Spin>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doAdd">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import tinymce from 'tinymce';
    import {addText} from '@/libs/API/article.js';
    export default {
        name: 'text-add',
        data () {
            return {
                isShow: false,
                spinShow: true,
                textAddForm:{}
            };
        },
        methods: {
            init () {
                this.$nextTick(() => {
                    let vm = this;
                    let height = document.body.offsetHeight - 400;
                    tinymce.init({
                        selector: '#tinymceEditer',
                        branding: false,
                        elementpath: false,
                        height: height,
                        language: 'zh_CN.GB2312',
                        menubar: 'edit insert view format table tools',
                        plugins: [
                            'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                            'searchreplace visualblocks visualchars code fullpage',
                            'insertdatetime media nonbreaking save table contextmenu directionality',
                            'emoticons paste textcolor colorpicker textpattern imagetools codesample'
                        ],
                        toolbar1: ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
                        autosave_interval: '20s',
                        image_advtab: true,
                        table_default_styles: {
                            width: '100%',
                            borderCollapse: 'collapse'
                        },
                        setup: function (editor) {
                            editor.on('init', function (e) {
                                vm.spinShow = false;
                            });
                            editor.on('keydown', function (e) {
                                // localStorage.editorContent = tinymce.get('tinymceEditer').getContent();
                                // console.log(tinymce.get('tinymceEditer').getContent());
                            });
                        }
                    });
                });
            },
            doCancel () {
                this.isShow = false;
            },
            changeText () {
                tinymce.get('tinymceEditer').setContent(this.textAddForm.content);
            },
            async doAdd () {
                let form={};
                form.content=tinymce.get('tinymceEditer').getContent();
                form.title=this.textAddForm.title;
                form.status=2;
                let res = await addText(form);
                if (!res.code){
                    this.$Message.success('编辑成功');
                    this.doCancel();
                    this.$emit('refreshTextList');
                } else {
                    this.$Message.error(res.msg);
                }
            }
        },
        mounted () {
            this.init();
        },
        destroyed () {
            tinymce.get('tinymceEditer').destroy();
        }
    };
</script>

<style>

</style>
