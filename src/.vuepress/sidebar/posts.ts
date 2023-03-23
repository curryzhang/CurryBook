import { sidebar } from "vuepress-theme-hope";

export const posts = sidebar({
  "/": [
    // "",
    {
      text: "代码笔记",
      icon: "code",
      prefix: "code/",
      link: "code/",
      children: "structure",
    },
    
    // "intro",
    // "slides",
  ],
});
