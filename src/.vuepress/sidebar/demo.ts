import { sidebar } from "vuepress-theme-hope";

export const demo = sidebar({
  "/": [
    // "",
    {
      text: "代码笔记",
      icon: "code",
      prefix: "code/",
      link: "code/",
      children: "structure",
    },
    // {
    //   text: "文章",
    //   icon: "note",
    //   prefix: "posts/",
    //   children: "structure",
    // },
    // "intro",
    // "slides",
  ],
});
