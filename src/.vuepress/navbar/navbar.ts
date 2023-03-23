import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  { text: "主页", icon: "home", link: "/" },
  { text: "演示", icon: "discover", link: "/demo/" },
  {
    text: "代码笔记",
    icon: "edit",
    // prefix: "/posts/",
    children: [
      { text: "代码笔记", icon: "code", link: "/code/" },
      {
        text: "DEMO",
        icon: "edit",
        // prefix: "",
        children: [
          { text: "测试代码", icon: "edit", link: "/posts/" },
          { text: "演示", icon: "discover", link: "/demo/" },
        ],
      }
    ],
  },
  {
    text: "官方文档",
    icon: "note",
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);
