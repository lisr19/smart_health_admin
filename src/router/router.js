import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录'
    },
    component: () => import('@/views/login.vue')
};
export const demoRouter = {
    path: '/demo',
    name: 'demo',
    meta: {
        title: 'demo'
    },
    component: () => import('@/views/demo.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/form/article-publish/preview.vue')
};

// del by allen 2018.5.18 : 去除锁屏功能
// export const locking = {
//     path: '/locking',
//     name: 'locking',
//     component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
// };

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        {path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue')},
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: () => import('@/views/own-space/own-space.vue')
        },
        {
            path: 'order/:order_id',
            title: '订单详情',
            name: 'order-info',
            component: () => import('@/views/advanced-router/component/order-info.vue')
        }, // 用于展示动态路由
        {
            path: 'shopping',
            title: '购物详情',
            name: 'shopping',
            component: () => import('@/views/advanced-router/component/shopping-info.vue')
        }, // 用于展示带参路由

    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
// 左菜单列表
export const appRouter = [
    {
        path: '/admin',
        icon: 'ios-folder-outline',
        name: 'admin',
        title: '管理员',
        access:0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '管理员列表',
                name: 'admin-list',
                access: 0,
                component: () => import('@/views/admin/admin-list.vue')
            }
        ]
    },
    {
        path: '/user',
        icon: 'ios-folder-outline',
        name: 'user',
        title: '用户管理',
        access:0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '用户列表',
                name: 'user-list',
                access: 0,
                component: () => import('@/views/system/user-list.vue')
            }

        ]
    },
    {
        path: '/seller',
        icon: 'ios-folder-outline',
        name: 'seller',
        title: '商家管理',
        access: 0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '商家列表',
                name: 'seller-list',
                access: 0,
                component: () => import('@/views/seller/seller-list.vue')
            }
        ]
    },
    {
        path: '/doctor',
        icon: 'ios-folder-outline',
        name: 'doctor',
        title: '医生管理',
        access: 0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '医生列表',
                name: 'doctor-list',
                access: 0,
                component: () => import('@/views/doctor/doctor-list.vue')
            }
        ]
    },
    {
        path: '/group',
        icon: 'ios-folder-outline',
        name: 'group',
        title: '组管理',
        access:0,
        component: Main,
        children: [
            /*{
                path: 'userGroup',
                icon: 'document',
                title: '查看组',
                name: 'user-group',
                access: 0,
                component: () => import('@/views/group/user-group.vue')
            },*/
            {
                path: 'index',
                icon: 'document',
                title: '组列表',
                name: 'group-list',
                access: 0,
                component: () => import('@/views/group/group-list.vue')
            }
        ]
    },
    {
        path: '/article',
        icon: 'ios-folder-outline',
        name: 'article',
        title: '文章管理',
        access:0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '文章列表',
                name: 'article-list',
                access: 0,
                component: () => import('@/views/article/article-list.vue')
            }
        ]
    },
    {
        path: '/label',
        icon: 'ios-folder-outline',
        name: 'label',
        title: '标签管理',
        access: 0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '标签列表',
                name: 'label-list',
                access: 0,
                component: () => import('@/views/label/label-list.vue')
            }
        ]
    },
    {
        path: '/device',
        icon: 'ios-folder-outline',
        name: 'device',
        title: '设备管理',
        access:0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '设备列表',
                name: 'device-list',
                access: 0,
                component: () => import('@/views/device/device-list.vue')
            }
        ]
    },
    {
        path: '/disease',
        icon: 'ios-folder-outline',
        name: 'disease',
        title: '疾病管理',
        access:0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '疾病列表',
                name: 'disease-list',
                access: 0,
                component: () => import('@/views/disease/disease-list.vue')
            }
        ]
    },
    {
        path: '/drug',
        icon: 'ios-folder-outline',
        name: 'drug',
        title: '药品管理',
        access:0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '药品列表',
                name: 'drug-list',
                access: 0,
                component: () => import('@/views/drug/drug-list.vue')
            }
        ]
    },
    {
        path: '/video',
        icon: 'ios-folder-outline',
        name: 'video',
        title: '视频管理',
        access:0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '视频列表',
                name: 'video-list',
                access: 0,
                component: () => import('@/views/video/video-list.vue')
            },
            {
                path: 'series',
                icon: 'document',
                title: '视频系列',
                name: 'videoSeries-list',
                access: 0,
                component: () => import('@/views/video/videoSeries-list.vue')
            },
            {
                path: 'type',
                icon: 'document',
                title: '视频类型',
                name: 'videoType-list',
                access: 0,
                component: () => import('@/views/videoType/videoType-list.vue')
            }
        ]
    },
    {
        path: '/apkVersion',
        icon: 'ios-folder-outline',
        name: 'apkVersion',
        title: '版本管理',
        access:0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '版本列表',
                name: 'apkVersion-list',
                access: 0,
                component: () => import('@/views/apkVersion/apkVersion-list.vue')
            }
        ]
    },

    {
        path: '/ad',
        icon: 'ios-folder-outline',
        name: 'ad',
        title: '广告管理',
        access: 0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '广告列表',
                name: 'ad-list',
                access: 0,
                component: () => import('@/views/ad/ad-list.vue')
            }
        ]
    },
    {
        path: '/appliances',
        icon: 'ios-folder-outline',
        name: 'appliances',
        title: '智能家电管理',
        access: 0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '智能家电管理',
                name: 'appliances-control',
                access: 0,
                component: () => import('@/views/appliances/appliances-control.vue')
            }
        ]
    },
    {
        path: '/stb',
        icon: 'ios-folder-outline',
        name: 'stb',
        title: '机顶盒管理',
        access: 0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '机顶盒列表',
                name: 'stb-list',
                access: 0,
                component: () => import('@/views/stb/stb-list.vue')
            }
        ]
    },
    {
        path: '/textEditor',
        icon: 'ios-folder-outline',
        name: 'text',
        title: '富文本列表',
        access: 0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '富文本列表',
                name: 'text-list',
                access: 0,
                component: () => import('@/views/text/text-list.vue')
            }
        ]
    },
    {
        path: '/log',
        icon: 'ios-folder-outline',
        name: 'log',
        title: '日志管理',
        access: 0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '日志列表',
                name: 'log-list',
                access: 0,
                component: () => import('@/views/log/log-list.vue')
            }
        ]
    },

    /*{
        path: '/upload',
        icon: 'ios-folder-outline',
        name: 'upload',
        title: '上传',
        access: 0,
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'document',
                title: '上传',
                name: 'file-upload',
                access: 0,
                component: () => import('@/views/my-components/file-upload/file-upload.vue')
            }
        ]
    }
*/
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    demoRouter,
    loginRouter,
    otherRouter,
    preview,
    // locking,   del by allen 2018.5.18   =>  去除锁屏
    ...appRouter,
    page500,
    page403,
    page404,

];
