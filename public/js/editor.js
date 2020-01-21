/**
 * wangEditor
 * @author 李哲军
 * @date    2019-10-18
 * @type {null}
 */

const editor_L = {
    imgMaxWidth: '', // 本地上传图片最大宽度
    imgMaxSize: 0,  // 本地上传图片最大尺寸
    // 本地上传图片允许后缀
    allowTheSuffix: ['jpg', 'jpeg', 'png'],
    imgMaxNumber: 0, // 本地上传图片最大数量
    /**
     * 富文本编辑器 editor -> 实例化对象
     * editor.txt.html('<p>用 JS 设置的内容</p>') 值为空则为获取
     * editor.txt.text()获取无标签
     * editor.txt.append('<p>追加的内容</p>')
     * editor.txt.clear()
     * editor.txt.getJSON获取 JSON 格式的编辑器的内容
     *
     * 参数说明
     * @param editorObjName     String    用于存储富文本编辑器对象的状态名 * String
     * @param toolbarSelector   存储菜单的节点
     * @param textSelector      编辑内容的节点
     * @param editorContentName String    存储初始化显示的编辑内容的状态名
     * @param editorParent  包裹存储菜单节点与内容节点的父节点
     * @param imgMaxSize    默认值 1M  1024*1024
     * @param imgMaxNumber  Number
     */

    editor(editorObjName, toolbarSelector, textSelector = null, editorContentName, editorParent, imgMaxSize = 1048576, imgMaxNumber = 10){
        // 设置图片限制大小
        editor_L.imgMaxSize = imgMaxSize;
        // 设置本地上传图片最大数量
        editor_L.imgMaxNumber = imgMaxNumber;

        let editor = require('wangeditor');
        let result = new editor(toolbarSelector, textSelector);

        result.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            // 'video',  // 插入视频
            // 'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ];

        editor_L.editorText.call(this, result, editorObjName, toolbarSelector, textSelector, editorContentName, editorParent);
    },
    // 自定义初始化富文本
    editorText(Editor, editorObjName, toolbarSelector, textSelector, editorContentName, editorParent){
        // 插入图片最大宽度
        editor_L.imgMaxWidth = getComputedStyle(textSelector).width;

        // 关闭粘贴样式的过滤
        Editor.customConfig.pasteFilterStyle = false;

        // 是否忽略粘贴内容中的图片
        Editor.customConfig.pasteIgnoreImg = false;

        // 粘贴触发的函数
        // Editor.customConfig.pasteTextHandle = function (content) {
        //     // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
        //     return content
        // };
        textSelector.onpaste =  (e) => {
            //获取clipboardData对象
            let data =e.clipboardData||window.clipboardData;

            if (!data.item) return ; // 复制为非文本的时拦截

            // 验证本地图片上传是否达到限制
            if (!editor_L.verifyImageNumber.call(this, editorObjName)){
                this.$message({message: '本地上传图片数量超过限制：' + editor_L.imgMaxNumber, type:'warning'});
                return ;
            }

            //获取图片内容
            let blob = data.items[0].getAsFile();

            // 判断文件大小 并拦截
            if (blob.size > editor_L.imgMaxSize) {
                this.$message({message: '本地上传图片大小超过限制：' + editor_L.imgMaxSize/1024 + 'KB', type: 'warning'});
                return ;
            }

            //判断是不是图片，最好通过文件类型判断
            let isImg = (blob&&1) || -1;


            let reader = new FileReader();
            if(isImg>=0){
                //将文件读取为 DataURL
                reader.readAsDataURL(blob);
            }

            reader.onload =  (event) => {
                let base64_str = event.target.result;
                // 在编辑内容中插入图片
                editor_L.inEditorText.call(this, editorObjName, base64_str)
            }
        };

        // 插入图片时触发
        // Editor.customConfig.linkImgCallback = function (url) {
        //     console.log(url) // url 即插入图片的地址
        // };

        // 校验插入链接
        // Editor.customConfig.linkCheck = function (text, link) {
        //     console.log(text) // 插入的文字
        //     console.log(link) // 插入的链接
        //
        //     return true // 返回 true 表示校验成功
        //     // return '验证失败' // 返回字符串，即校验失败的提示信息
        // };
        Editor.create();
        if (this[editorContentName]) {
            Editor.txt.html(this[editorContentName]);
        }

        this[editorObjName] = Editor;

        // 添加本地上传功能
        let label = document.createElement('label');
        let ipt = document.createElement('input');
        let span = document.createElement('span');
        ipt.type = 'file';
        ipt.id = 'pic';
        ipt.style.position = 'fixed';
        ipt.style.top = '-1000px';
        ipt.onchange = editor_L.getPicture.bind(this, editorObjName);
        label.innerHTML = '本地图片上传';
        label.style.position = "relative";
        label.style.top = '1px';
        label.className = 'pointer';
        label.setAttribute('for', 'pic');
        span.innerHTML = '（本地图片最多上传10张）';
        span.style.marginLef = '10px';
        span.style.color = 'red';

        toolbarSelector.appendChild(label);
        toolbarSelector.appendChild(ipt);
        toolbarSelector.appendChild(span);

        // 实现子元素相对于父元素固定定位 （固定定位菜单）
        editorParent.style.position = 'relative';
        let parent = document.createElement('div');
        parent.style.height = '100%';
        parent.style.width = '100%';
        toolbarSelector.style.position = 'absolute';
        toolbarSelector.style.top = 0;
        toolbarSelector.style.left = 0;
        toolbarSelector.style.zIndex = 30000;
        toolbarSelector.style.backgroundColor = '#fff';

        parent.appendChild(toolbarSelector);
        parent.appendChild(textSelector);
        editorParent.appendChild(parent);
        // 解决编辑内容与编辑菜单重叠问题
        let w_e_text = document.querySelector('.w-e-text-container > .w-e-text');
        w_e_text.style.paddingTop = toolbarSelector.getBoundingClientRect().height + 'px';
    },
    /**
     * 获取本地图片数据并插入光标处
     * @param editorObjName     用于存储富文本编辑器对象的状态名 *
     * @param e     Event事件对象
     * @returns {Promise<void>}
     */
    async getPicture(editorObjName, e){
        // 验证本地图片上传是否达到限制
        if (!editor_L.verifyImageNumber.call(this, editorObjName)){
            this.$message({message: '本地上传图片数量超过限制：' + editor_L.imgMaxNumber, type:'warning'});
            return ;
        }

        // 图片后缀是否允许
        let suffix = e.target.files[0].name.match(/(\.)(\w+)$/)[2];
        if (editor_L.allowTheSuffix.every((item)=>{
            return item !== suffix;
        })) {
            this.$message({message: '只能上传图片且后缀必须为jpg、jpeg、png', type: 'warning'});
            return ;
        }

        // 获取图片数据
        let picData = await editor_L.getPictureData.call(this, e);
        // 等于false则表示大小超过限制
        if (!picData) {
            this.$message({message: '本地上传图片大小超过限制：' + editor_L.imgMaxSize/1024 + 'KB', type: 'warning'});
            return ;
        }
        editor_L.inEditorText.call(this, editorObjName, picData)
    },
    // 将图片插入编辑内容
    inEditorText(editorObjName, picData){
        let Editor = this[editorObjName],
            evt = Editor.selection.getSelectionContainerElem()[0],
            endOffset = Editor.selection._currentRange.endOffset,
            imgStr = `<span><img src="${picData}" alt="" style="max-width: ${(editor_L.imgMaxWidth.match(/\d+/)[0] - 35) + 'px'}"></span>`;   // 光标位于当前元素的位置

        // 是否为 <span><img/></span> 的格式 --> <span><span><img/></span><span><img/></span></span>
        let nodeEl = evt.childNodes[0];
        if (nodeEl.nodeName === 'IMG'){
            evt.innerHTML = `<span><img src="${nodeEl.src}" /></span>` + `<span>${imgStr}</span>`
        } else {
            // 元素中无img节点
            // 获取光标最后停留的元素
            let leftStr = evt.innerHTML.substring(0, endOffset),
                rightStr = evt.innerHTML.substring(endOffset, evt.innerHTML.length);

            evt.innerHTML = `<span>${leftStr.trim()}</span>` + imgStr.trim() + `<span>${rightStr.trim()}</span>`;
            // evt.innerHTML = `<span>${leftStr.trim()}</span>` + imgStr.trim() + `<span>${rightStr.trim()}</span>`;
        }
    },

    /**
     * 获取上传图片数据
     * @param e 事件对象
     * @returns {Promise<unknown>} 图片数据
     */
    getPictureData(e){
        return new Promise(resolve=>{
            let file = e.target.files;
            if(!file.length) return;
            if (file[0].size > editor_L.imgMaxSize) resolve(false);
            let reader = new FileReader();
            reader.onload = (e) => {    //成功读取文件
                resolve(e.target.result)
            };
            reader.readAsDataURL(file[0]);
        })
    },
    /**
     * 验证图片数量
     */
    verifyImageNumber(editorObjName){
        let data = this[editorObjName].txt.html().match(/(<img src)([^>])+>/g);
        if (!data) return true; // 不存在图片
        return data.length < editor_L.imgMaxNumber; // 图片数量是否超出
    }
};

export default editor_L.editor
