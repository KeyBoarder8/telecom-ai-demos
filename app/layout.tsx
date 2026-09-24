import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "中国电信 · 新区AI智慧服务平台", description: "企业知识中枢、智能客服与检修工单演示平台", icons:{icon:"/favicon.svg"} };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="zh-CN"><body>{children}</body></html>}
