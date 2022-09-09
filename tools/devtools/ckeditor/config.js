/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
    config.toolbar = 'Full';
    config.language = 'zh-cn';
    config.uiColor = '#9AB8F3';
    config.height = 600;
    config.toolbarCanCollapse = true;       // 工具栏是否可以隐藏
    config.sourceAreaTabSize = 4;
    config.font_defaultLabel = 'Arial';
    config.fontSize_sizes ='8/8px;9/9px;10/10px;11/11px;12/12px;13/13px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px'
    // config.extraPlugins: 'uicolor,sourcedialog,sourcearea';

    // config.fillEmptyBlocks = false; // Prevent filler nodes in all empty blocks.
    // config.enterMode = CKEDITOR.ENTER_P;
    // config.shiftEnterMode = CKEDITOR.ENTER_BR;

    //是否强制复制来的内容去除格式 plugins/pastetext/plugin.js
    config.forcePasteAsPlainText = true; //不去除
        //是否强制用“&”来代替“&amp;”plugins/htmldataprocessor/plugin.js
    config.forceSimpleAmpersand = false;
     //是否忽略段落中的空字符 若不忽略 则字符将以“”表示 plugins/wysiwygarea/plugin.js
    config.ignoreEmptyParagraph = false;
    //撤销的记录步数 plugins/undo/plugin.js
    config.undoStackSize = 20;
};

/***
 * 添加背景颜色的显示
 */
CKEDITOR.addCss(".cke_editable{background-color: #FFFFFF}");