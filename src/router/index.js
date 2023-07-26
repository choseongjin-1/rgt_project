import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Project',
        component: () => import('../components/Project.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})
  
router.onError((error) => {
    console.log('에러 발생!! v2')
    // const pattern = /Loading chunk (\d)+ failed/g;
    // const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    // if (isChunkLoadFailed) {
    //  router.replace(targetPath);
    // }
    console.error(error);

    if (error.name === 'ChunkLoadError') {
        window.location.href = targetPath || '/';
    }
});
export default router