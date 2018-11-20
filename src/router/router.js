import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-Not Found'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-Not Authurized'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-Error'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/form/article-publish/preview.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'ownspace', title: 'Own Space', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
        { path: 'message', title: 'Messages', name: 'message_index', component: () => import('@/views/message/message.vue') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/kpi',
        icon: 'pie-graph',
        name: 'kpi',
        title: 'KPI',
        component: Main,
        children: [
            { path: 'index', title: 'KPI', name: 'kpi_index', component: () => import('@/views/kpi/exportable-table.vue') }
        ]
    },
    {
        path: '/team',
        icon: 'person-stalker',
        title: 'Team',
        name: 'team',
        access: 0,
        component: Main,
        children: [
            { path: 'index', title: 'Team', name: 'accesstest_index', access: 0, component: () => import('@/views/team/exportable-table.vue') }
        ]
    },
    {
        path: '/usr',
        icon: 'person',
        title: 'Member',
        name: 'usr',
        component: Main,
        children: [
            { path: 'index', title:'Member', name: 'usr_index', component: () => import('@/views/user/exportable-table.vue') }
        ]
    },
    {
        path: '/org',
        icon: 'android-funnel',
        title: 'Orgnazation',
        name: 'org',
        access: 0,
        component: Main,
        children: [
            { path: 'index', title: 'Orgnazation', name: 'org_index', access: 0, component: () => import('@/views/org/index.vue') }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
