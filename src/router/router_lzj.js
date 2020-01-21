// import引入组件
import systemMessage from "../components/components_lzj/header/chat/systemMessage";     // 回复消息

import addService from "../components/components_lzj/rightContent/addService/addService";   // 客服管理
import addServiceSub from "../components/components_lzj/rightContent/addService/addServiceSub"; // 人员添加

import schoolIntro from "../components/components_lzj/rightContent/schoolIntro/schoolIntro";    // 学校简介
import editor from "../components/components_lzj/rightContent/schoolIntro/editor";   // 富文本编辑器
import preview from "../components/components_lzj/rightContent/schoolIntro/preview";    // 预览

import messageManagement from "../components/components_lzj/rightContent/messageManagement/messageManagement"; // 留言管理

import coupon from "../components/components_lzj/rightContent/coupon/coupon";    // 优惠劵
import showCoupon from "../components/components_lzj/rightContent/coupon/showCoupon";   // 显示优惠劵
import addCoupon from "../components/components_lzj/rightContent/coupon/addCoupon";  // 优惠劵添加

export default [
    // 子组件
    {
        path: 'systemMessage',
        component: systemMessage
    },
    {
        path: 'addService',
        component: addService
    },
    {
        path: 'addService/add',
        component: addServiceSub
    },
    {
        path: 'schoolIntro',
        component: schoolIntro,
        children: [
            {
                path: '',
                component: editor
            },
            {
                path: 'preview',
                component: preview
            }
        ]
    },
    {
        path: 'messageManagement',
        component: messageManagement
    },
    {
        path: 'coupon',
        component: coupon,
        children: [
            {
                path: '',
                component: showCoupon
            },
            {
                path: 'add',
                component: addCoupon
            }
        ]
    }
]
