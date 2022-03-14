
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'QRcode', component: () => import('pages/QRcode.vue') },
      { path: 'RFID', component: () => import('pages/RFID.vue') },
      { path: 'page-test', component: () => import('pages/page-test.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
