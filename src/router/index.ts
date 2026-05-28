import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
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
          path: "gallery",
          name: "gallery",
          component: () => import("../views/GalleryView.vue"),
        },
        {
          path: "tag/:tagName",
          name: "tag",
          component: () => import("../views/TagView.vue"),
          props: true,
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
