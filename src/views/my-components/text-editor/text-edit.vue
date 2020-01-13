<style lang="less">
    @import '../../../styles/loading.less';
</style>

<template>
    <Modal v-model="isShow" width="1200" title="编辑富文本" @on-cancel="doCancel">
        <Card shadow>
            <div style="height: 50px">
                标题：
                <Input v-model="textEditForm.title" style="width:1000px"/>
            </div>
            <textarea class='tinymce-textarea' id="tinymceEdit"></textarea>
        </Card>
        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载组件中...</div>
        </Spin>
        <div slot="footer">
            <Button type="text" @click="doCancel">取消</Button>
            <Button type="primary" @click="doEdit">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import tinymce from 'tinymce';
    import {editText} from '@/libs/API/article.js';
    export default {
        name: 'text-edit',
        data () {
            return {
                isShow: false,
                spinShow: true,
                textEditForm:{}
            };
        },
        methods: {
            init () {
                this.$nextTick(() => {
                    let vm = this;
                    let height = document.body.offsetHeight - 400;
                    tinymce.init({
                        selector: '#tinymceEdit',
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
                tinymce.get('tinymceEdit').setContent(this.textEditForm.content);
            },
            async doEdit () {
                let form={};
                form.content=tinymce.get('tinymceEdit').getContent();
                form.title=this.textEditForm.title;
                form.id=this.textEditForm.id;
                let res = await editText(form);
                if (!res.code){
                    this.$Message.success('编辑成功');
                    this.doCancel();
                } else {
                    this.$Message.error(res.msg);
                }
            }
        },
        mounted () {
            this.init();
        },
        destroyed () {
            tinymce.get('tinymceEdit').destroy();
        }
    };
</script>

<style>

</style>
