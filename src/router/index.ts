import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("../layouts/AppLayout.vue"),
      children: [
        {
          path: "",
          name: "home",
          component: () => import("../views/HomeView.vue"),
        },
        {
          path: "blog",
          name: "blog",
          component: () => import("../views/BlogView.vue"),
        },
        {
          path: "blog/:id",
          name: "blog-detail",
          component: () => import("../views/BlogDetailView.vue"),
          props: (route) => ({ id: Number(route.params.id) }),
        },
        {
          path: "gallery",
          name: "gallery",
          component: () => import("../views/GalleryView.vue"),
        },
        {
          path: "gallery/:id",
          name: "gallery-detail",
          component: () => import("../views/GalleryDetailView.vue"),
          props: (route) => ({ id: Number(route.params.id) }),
        },
        {
          path: "tag/:tagId",
          name: "tag",
          component: () => import("../views/TagView.vue"),
          props: (route) => ({ tagId: Number(route.params.tagId) }),
        },
        {
          path: "friend",
          name: "friend",
          component: () => import("../views/FriendView.vue"),
        },
      ],
    },
  ],
});

export default router;
