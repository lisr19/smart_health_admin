<style lang="less">
    @import '../../../styles/loading.less';
</style>

<template>
    <Modal v-model="isShow" width="1200" title="编辑文章" @on-cancel="doCancel">
        <Card shadow>
            <textarea class='tinymce-textarea' id="tinymceEditer1"></textarea>
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
import {addText} from '@/libs/API/article.js';
export default {
    name: 'text-editor',
    data () {
        return {
            isShow: false,
            spinShow: true,
            articleData:{}
        };
    },
    methods: {
        init () {
            this.$nextTick(() => {
                let vm = this;
                let height = document.body.offsetHeight - 400;
                tinymce.init({
                    selector: '#tinymceEditer1',
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
        changeText (params) {
            let text = '';
            let img = '';
            // console.log(params)
            if(this.IsJsonString(params)){
                let content = JSON.parse(params);
                for (let i = 0; i < content.length; ++i) {
                    let item = content[i];
                    if (item.tag === 'img') {
                        img += item.text;
                        img += '\n';
                    } else if (item.tag === 'p') {
                        text += item.text;
                    }
                }
                text = text + img;
                tinymce.get('tinymceEditer1').setContent(text);
            }else{
                tinymce.get('tinymceEditer1').setContent(params);
            }
        },
        //判断字符串是否为JSON格式
        IsJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false
            }
            return true
        },
        async doEdit () {
            let form={};
            form.content=tinymce.get('tinymceEditer1').getContent();
            form.title=this.articleData.title;
            form.status=this.articleData.status;
            console.log(form)
            let res = await addText(form);
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
        tinymce.get('tinymceEditer1').destroy();
    }
};
</script>

<style>

</style>
