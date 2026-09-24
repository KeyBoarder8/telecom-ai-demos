<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import type { Component } from "vue";
import type { EChartsOption } from "echarts";
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Bell, BookOpen, Bot, Building2,
  Check, CheckCircle2, ChevronDown, Clock3, Database, FileSearch,
  Gauge, Headphones, Image, LayoutDashboard, MessageSquareText, Network,
  Plus, Search, Send, Settings, ShieldCheck, Sparkles, Star, TicketCheck, Upload,
  Users, Wrench, X,
} from "lucide-vue-next";
import EChart from "./components/EChart.vue";

type PageKey = "dashboard" | "knowledge" | "assistant" | "service" | "orders" | "quality";
interface NavItem { key: PageKey; label: string; icon: Component; badge?: number }

const navItems: NavItem[] = [
  { key: "dashboard", label: "工作台", icon: LayoutDashboard },
  { key: "knowledge", label: "企业知识中枢", icon: Database },
  { key: "assistant", label: "智能问答", icon: Sparkles },
  { key: "service", label: "智能客服", icon: Headphones, badge: 8 },
  { key: "orders", label: "检修工单", icon: Wrench, badge: 3 },
  { key: "quality", label: "智能质检", icon: ShieldCheck },
];
const page = ref<PageKey>("dashboard");
const collapsed = ref(false);
const toast = ref("");
const question = ref("新区工厂的互联网专线从上午9点开始频繁丢包，生产系统登录很慢");
const answered = ref(false);
const diagnosing = ref(false);
const replySent = ref(false);
const orderStage = ref(1);
const documentQuery = ref("");

const currentLabel = computed(() => navItems.find(item => item.key === page.value)?.label ?? "");
const metricData = [
  { label: "今日接待量", value: "3,286", change: "+12.6%", icon: MessageSquareText, tone: "blue" },
  { label: "机器人解决率", value: "71.4%", change: "+3.2%", icon: Bot, tone: "green" },
  { label: "工单按时办结", value: "96.7%", change: "+1.4%", icon: TicketCheck, tone: "purple" },
  { label: "客户满意度", value: "94.2%", change: "+2.1%", icon: Star, tone: "amber" },
];
const knowledgeMetrics = [
  { label: "知识文档", value: "12,684", change: "+436", icon: BookOpen, tone: "blue" },
  { label: "有效知识片段", value: "186,520", change: "+2.8%", icon: Database, tone: "purple" },
  { label: "问答命中率", value: "91.8%", change: "+1.9%", icon: Gauge, tone: "green" },
  { label: "待审核知识", value: "37", change: "8 条新增", icon: Clock3, tone: "amber" },
];
const qualityMetrics = [
  { label: "本月质检会话", value: "28,640", change: "+18.2%", icon: MessageSquareText, tone: "blue" },
  { label: "平均质检得分", value: "92.7", change: "+1.6", icon: Gauge, tone: "green" },
  { label: "高风险会话", value: "46", change: "-8.4%", icon: AlertTriangle, tone: "amber" },
  { label: "服务规范率", value: "96.3%", change: "+2.1%", icon: ShieldCheck, tone: "purple" },
];
const documents = [
  ["互联网专线产品手册 V3.2", "产品手册", "政企客户部", "V3.2", "2026-09-23", "已发布", "1,286"],
  ["政企客户故障申告处理规范", "制度流程", "客户服务部", "V2.6", "2026-09-22", "已发布", "985"],
  ["重大网络故障应急预案", "应急预案", "网络维护中心", "V4.1", "2026-09-20", "已发布", "746"],
  ["5G定制网售前技术问答", "FAQ", "解决方案部", "V1.9", "2026-09-18", "审核中", "538"],
  ["制造园区云网融合解决方案", "解决方案", "工业行业部", "V2.1", "2026-09-16", "已发布", "412"],
];
const filteredDocuments = computed(() => documents.filter(doc => doc[0].includes(documentQuery.value) || doc[1].includes(documentQuery.value)));

const axis = { axisLine: { lineStyle: { color: "#d9e2ec" } }, axisTick: { show: false }, axisLabel: { color: "#6b7785", fontSize: 11 } };
const trendOption: EChartsOption = {
  tooltip: { trigger: "axis", backgroundColor: "#ffffff", borderColor: "#d9e2ec", textStyle: { color: "#253242" } },
  legend: { right: 12, top: 2, textStyle: { color: "#5f6b78" }, itemWidth: 14 },
  grid: { left: 44, right: 18, top: 42, bottom: 28 },
  xAxis: { type: "category", data: ["09/18","09/19","09/20","09/21","09/22","09/23","今日"], ...axis },
  yAxis: { type: "value", splitLine: { lineStyle: { color: "#edf1f5" } }, ...axis },
  series: [
    { name: "服务总量", type: "line", smooth: true, symbolSize: 6, data: [2380,2720,2490,3080,2840,3190,3286], lineStyle: { color: "#4aa3e8", width: 2 }, itemStyle: { color: "#4aa3e8" }, areaStyle: { color: "rgba(74,163,232,.12)" } },
    { name: "机器人解决", type: "line", smooth: true, symbolSize: 6, data: [1610,1870,1710,2180,2010,2260,2347], lineStyle: { color: "#44c2a3", width: 2 }, itemStyle: { color: "#44c2a3" } },
  ],
};
const channelOption: EChartsOption = {
  tooltip: { trigger: "item" }, legend: { orient: "vertical", right: 0, top: "center", textStyle: { color: "#5f6b78" } },
  series: [{ type: "pie", radius: ["48%","70%"], center: ["34%","50%"], avoidLabelOverlap: true, label: { show: false }, itemStyle: { borderColor: "#ffffff", borderWidth: 3 }, data: [
    { value: 36, name: "网页客服", itemStyle: { color: "#4a9fe3" } }, { value: 28, name: "微信服务号", itemStyle: { color: "#42b99a" } },
    { value: 21, name: "企业微信", itemStyle: { color: "#7f78c7" } }, { value: 15, name: "语音转写", itemStyle: { color: "#d5a24a" } },
  ]}],
};
const faultOption: EChartsOption = {
  tooltip: { trigger: "axis", axisPointer: { type: "shadow" } }, grid: { left: 92, right: 28, top: 10, bottom: 15 },
  xAxis: { type: "value", show: false }, yAxis: { type: "category", inverse: true, data: ["互联网专线","企业宽带","云主机","5G专网","安全服务"], ...axis },
  series: [{ type: "bar", barWidth: 11, data: [168,126,84,51,32], itemStyle: { color: "#458fc9", borderRadius: [0,2,2,0] } }],
};

function go(target: PageKey) { page.value = target; window.scrollTo({ top: 0, behavior: "smooth" }); }
async function ask() { diagnosing.value = true; await new Promise(resolve => setTimeout(resolve, 850)); diagnosing.value = false; answered.value = true; }
function createOrder() { orderStage.value = 1; toast.value = "P1 检修工单 XZ202609240087 已创建并完成智能派发"; window.setTimeout(() => toast.value = "", 3200); nextTick(() => go("orders")); }
function advanceOrder() { orderStage.value = Math.min(5, orderStage.value + 1); }
</script>

<template>
  <div class="app-shell" :class="{ collapsed }">
    <aside class="sidebar">
      <div class="brand">
        <img class="telecom-logo" src="/china-telecom-logo.png" alt="中国电信 China Telecom" />
      </div>
      <nav class="main-nav">
        <button v-for="item in navItems" :key="item.key" :class="{ active: page === item.key }" @click="go(item.key)">
          <component :is="item.icon" :size="18" />
          <span v-if="!collapsed">{{ item.label }}</span><em v-if="item.badge && !collapsed">{{ item.badge }}</em>
        </button>
      </nav>
      <div class="sidebar-art" aria-hidden="true"><span>5G</span></div>
      <footer>
        <button><Bell :size="18"/><span v-if="!collapsed">消息中心</span></button>
        <button><Settings :size="18"/><span v-if="!collapsed">系统管理</span></button>
        <button @click="collapsed = !collapsed"><ArrowRight :size="18"/><span v-if="!collapsed">收起菜单</span></button>
      </footer>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <div class="product-name"><span></span><strong>企业知识库与智能客服 DEMO</strong></div>
        <label class="global-search"><Search :size="16"/><input placeholder="搜索知识、工单、会话、文档或功能…"/><kbd>⌘ K</kbd></label>
        <div class="top-actions"><button class="icon-button"><Bell :size="18"/><i></i></button><button class="grid-button">⌘</button><button class="role">企业管理员<ChevronDown :size="14"/></button><span class="avatar">运</span><span class="environment">演示环境｜模拟数据</span></div>
      </header>

      <main class="page-content">
        <div class="page-header">
          <div><small>{{ currentLabel }}</small><h1>{{ page === 'dashboard' ? '智慧服务运营工作台' : currentLabel }}</h1><p v-if="page === 'dashboard'">知识驱动服务，工单形成闭环，数据辅助运营决策</p></div>
          <div class="page-actions"><button v-if="page === 'knowledge'" class="button secondary"><Upload :size="15"/>批量导入</button><button v-if="page === 'knowledge'" class="button primary"><Plus :size="15"/>新建知识</button><button v-if="page === 'dashboard'" class="button primary" @click="go('service')"><Headphones :size="15"/>进入客服工作台</button></div>
        </div>

        <template v-if="page === 'dashboard'">
          <section class="metric-grid">
            <article v-for="item in metricData" :key="item.label" class="metric-card"><span class="metric-icon" :class="item.tone"><component :is="item.icon" :size="21"/></span><div><small>{{ item.label }}</small><strong>{{ item.value }}</strong><em>{{ item.change }} 较昨日</em></div><i class="mini-bars"><b v-for="n in 7" :key="n" :style="{height: `${20 + n * 7}%`}"></b></i></article>
          </section>
          <section class="dashboard-layout">
            <article class="panel wide"><header><div><h2>服务量趋势</h2><p>近 7 日服务总量与机器人独立解决量</p></div><button class="text-button">近7日<ChevronDown :size="13"/></button></header><EChart :option="trendOption"/></article>
            <article class="panel"><header><div><h2>渠道分布</h2><p>今日客户接入渠道</p></div></header><EChart :option="channelOption"/></article>
            <article class="panel wide"><header><div><h2>产品故障分布</h2><p>近 24 小时关联故障量</p></div></header><EChart :option="faultOption"/></article>
            <article class="panel"><header><div><h2>重点预警</h2><p>需要立即关注的服务风险</p></div></header><div class="alert-list"><button @click="go('orders')"><i class="danger"><AlertTriangle :size="16"/></i><span><b>P1 专线故障即将超时</b><small>新区智造科技 · 剩余 42 分钟</small></span><ArrowRight :size="14"/></button><button @click="go('service')"><i class="warning"><MessageSquareText :size="16"/></i><span><b>重复投诉情绪升级</b><small>2 次重复申告 · 负向情绪 91%</small></span><ArrowRight :size="14"/></button><button @click="go('knowledge')"><i><BookOpen :size="16"/></i><span><b>37 条候选知识待审核</b><small>其中 8 条来自今日人工工单</small></span><ArrowRight :size="14"/></button></div></article>
          </section>
        </template>

        <template v-else-if="page === 'knowledge'">
          <section class="metric-grid"><article v-for="item in knowledgeMetrics" :key="item.label" class="metric-card"><span class="metric-icon" :class="item.tone"><component :is="item.icon" :size="21"/></span><div><small>{{ item.label }}</small><strong>{{ item.value }}</strong><em>{{ item.change }}</em></div></article></section>
          <section class="knowledge-layout">
            <article class="panel spaces-panel"><header><div><h2>知识空间列表</h2><p>按业务域统一管理企业知识</p></div><button class="square-button"><Plus :size="15"/></button></header><div class="space-list"><button v-for="(space,index) in [['云网产品知识库','3,286',Network],['政企业务知识库','2,418',Building2],['网络运维与检修','1,976',Wrench],['园区工业知识库','1,528',Settings],['供应商管理知识库','864',Users]]" :key="String(space[0])" :class="{active:index===0}"><i><component :is="space[2]" :size="17"/></i><span><b>{{ space[0] }}</b><small>{{ space[1] }} 份文档</small></span><ArrowRight :size="14"/></button></div></article>
            <article class="panel document-panel"><header><div><h2>知识文档</h2><p>云网产品知识库 · 最近更新</p></div><label class="table-search"><Search :size="14"/><input v-model="documentQuery" placeholder="搜索文件名、关键词…"/></label></header><div class="table-wrap"><table><thead><tr><th>文档名称</th><th>分类</th><th>来源部门</th><th>版本</th><th>更新时间</th><th>状态</th><th>调用量</th></tr></thead><tbody><tr v-for="doc in filteredDocuments" :key="doc[0]"><td><i class="file-type">PDF</i><b>{{ doc[0] }}</b></td><td>{{ doc[1] }}</td><td>{{ doc[2] }}</td><td>{{ doc[3] }}</td><td>{{ doc[4] }}</td><td><span class="status-tag" :class="doc[5] === '已发布' ? 'success' : 'pending'">{{ doc[5] }}</span></td><td>{{ doc[6] }}</td></tr></tbody></table></div></article>
          </section>
        </template>

        <template v-else-if="page === 'assistant'">
          <section class="assistant-summary"><div><span><Sparkles :size="22"/></span><h2>多模态智能问答</h2><p>支持图片、文档、表格与企业知识的综合理解</p></div><ul><li><Image :size="18"/>图片识别</li><li><FileSearch :size="18"/>文档解析</li><li><BarChart3 :size="18"/>图表分析</li><li><BookOpen :size="18"/>知识推理</li></ul></section>
          <section class="assistant-layout">
            <aside class="panel conversation-panel"><header><div><h2>会话区</h2><p>故障咨询与附件</p></div><button class="button secondary"><Plus :size="14"/>新建会话</button></header><div class="customer-question"><div class="avatar small">客</div><div><small>客户 · 10:32</small><p>{{ question }}</p><div class="alarm-preview"><AlertTriangle :size="20"/><span><b>互联网专线 · LOS 告警</b><small>专线告警截图.png</small></span><em>严重</em></div></div></div><div class="question-box"><textarea v-model="question" placeholder="请输入您的问题，支持上传图片、文档等…"></textarea><footer><span><button><Plus :size="16"/></button><button><Image :size="16"/></button></span><small>0/2000</small><button class="send-button" @click="ask"><Activity v-if="diagnosing" class="spin" :size="16"/><Send v-else :size="16"/></button></footer></div></aside>
            <article class="panel answer-panel"><header><div><h2>答案区</h2><p>检索、诊断与处理建议</p></div><button class="text-button">复制答案</button></header><div v-if="!answered" class="empty-answer"><Bot :size="42"/><b>等待问题分析</b><p>发送问题后将展示知识检索、诊断结果及引用来源</p></div><div v-else class="answer-content"><div class="confidence-row"><span><Bot :size="17"/>置信度 <b>86%</b></span><p>基于企业知识库与模拟网管诊断</p></div><h3>一、综合判断</h3><p>系统识别到 <strong>LOS 告警</strong>，当前接收光功率为 <strong>-25.8 dBm</strong>，近 30 分钟丢包率为 <strong>18.6%</strong>。初步判断为园区汇聚链路光衰异常。</p><h3>二、处理建议</h3><ol><li>核验同区域关联告警与影响范围；</li><li>检查 OLT 端口及光功率，复测主干光路；</li><li>排查客户侧路由器和交换设备；</li><li>金牌客户业务受影响，建议立即创建 P1 检修工单。</li></ol><div class="answer-buttons"><button class="button secondary">转人工复核</button><button class="button primary" @click="createOrder"><TicketCheck :size="15"/>一键创建工单</button></div></div></article>
            <aside class="panel citation-panel"><header><div><h2>引用证据</h2><p>2 条有效知识</p></div></header><div class="citation"><i>1</i><span><b>政企客户故障申告处理规范</b><small>V2.6 · 第 18 页 · 相关度 96%</small><p>当互联网专线发生高丢包时，应核验光功率、端口状态及同区域告警……</p></span></div><div class="citation"><i>2</i><span><b>企业专线常见故障案例汇编</b><small>V3.1 · 第 42 页 · 相关度 87%</small><p>园区汇聚链路光衰异常常表现为丢包与访问时延升高……</p></span></div><div class="debug-box"><b>调试信息</b><p><span>召回文档</span><strong>12</strong></p><p><span>重排结果</span><strong>3</strong></p><p><span>模型耗时</span><strong>1.8s</strong></p></div></aside>
          </section>
        </template>

        <template v-else-if="page === 'service'">
          <section class="service-kpis"><div><Headphones :size="18"/><span>今日接待<strong>2,368</strong></span><em>↑ 12.5%</em></div><div><Clock3 :size="18"/><span>平均响应<strong>28秒</strong></span><em class="down">↓ 32%</em></div><div><CheckCircle2 :size="18"/><span>会话解决率<strong>78.4%</strong></span><em>↑ 2.1%</em></div><div><Star :size="18"/><span>客户满意度<strong>4.7/5.0</strong></span><em>↑ 0.2</em></div></section>
          <section class="service-layout">
            <aside class="panel session-list"><header><div><h2>会话列表</h2><p>23 个活跃会话</p></div><button class="square-button"><Search :size="15"/></button></header><nav><button class="active">全部 <b>23</b></button><button>待处理 <b>6</b></button><button>进行中 <b>8</b></button></nav><div v-for="(company,index) in [['新区智造科技有限公司','专线故障 · 金牌客户','刚刚'],['华星商贸有限公司','宽带续费 · 普通客户','2分钟前'],['新区政务服务中心','云主机扩容 · 重要客户','5分钟前'],['恒科电子制造','5G专网咨询 · 战略客户','8分钟前']]" :key="company[0]" class="session" :class="{active:index===0}"><i>{{ company[0].slice(0,2) }}</i><span><b>{{ company[0] }}</b><small>{{ company[1] }}</small></span><em>{{ company[2] }}</em></div></aside>
            <article class="panel chat-panel"><header><div class="company-title"><i>新区</i><span><h2>新区智造科技有限公司</h2><p>互联网/软件服务 · 金牌客户 · 会话中</p></span></div><button class="button secondary">结束会话</button></header><div class="messages"><small>今天 10:32</small><div class="incoming"><i>新区</i><p>我们工厂的互联网专线从上午9点开始一直丢包，生产系统登录很慢。</p></div><div class="incoming"><i>新区</i><p class="attachment"><AlertTriangle :size="21"/>专线告警截图.png</p></div><div class="outgoing"><p>您好，已为您识别电路信息并进行远程诊断。系统检测到园区汇聚链路光功率异常，我正在为您升级检修处理。<small>10:34 · AI 辅助生成</small></p><i>客</i></div><div v-if="replySent" class="outgoing"><p>已创建 P1 检修工单 <b>XZ202609240087</b>，网络维护中心将在 30 分钟内响应。<small>刚刚 · 已送达</small></p><i>客</i></div></div><footer><textarea>已为您创建 P1 检修工单 XZ202609240087，网络维护中心将在 30 分钟内响应。</textarea><button class="button primary" @click="replySent = true"><Send :size="15"/>发送</button></footer></article>
            <aside class="panel copilot-panel"><header><div><h2>AI 智能助手</h2><p>客户洞察与处置建议</p></div><span class="status-tag success">实时</span></header><div class="customer-profile"><h3>客户 360° 画像</h3><p><span>客户等级</span><b class="amber-text">金牌客户</b></p><p><span>产品实例</span><b>互联网专线</b></p><p><span>电路编号</span><b>XZ-IP-…0176</b></p><p><span>SLA 等级</span><b>30分钟/4小时</b></p></div><div class="risk-card"><AlertTriangle :size="17"/><span><b>高风险 · 需优先处理</b><small>负向情绪 78%，生产业务受影响</small></span></div><div class="diagnosis-card"><h3>AI 诊断建议</h3><p><span>接入设备</span><b>XZ-OLT-03</b></p><p><span>端口状态</span><b class="green-text">在线</b></p><p><span>接收光功率</span><b class="red-text">-25.8 dBm</b></p><p><span>近30分钟丢包</span><b class="red-text">18.6%</b></p><small>初判为园区汇聚链路光衰异常，建议派发网络维护中心复测。</small></div><button class="button primary full" @click="createOrder"><TicketCheck :size="15"/>生成检修工单</button></aside>
          </section>
        </template>

        <template v-else-if="page === 'orders'">
          <section class="order-title"><div><span class="critical"><AlertTriangle :size="18"/>P1 重大故障</span><h2>工单 XZ202609240087</h2><p>互联网专线 · 新区智造科技有限公司</p></div><div><button class="button secondary">打印</button><button class="button secondary">分享</button></div></section>
          <section class="order-layout">
            <aside class="panel order-summary"><header><div><h2>工单信息</h2><p>客户报障与影响范围</p></div></header><dl><dt>客户名称</dt><dd>新区智造科技有限公司</dd><dt>产品类型</dt><dd>互联网专线</dd><dt>电路编号</dt><dd>XZ-IP-20260918-0176</dd><dt>发生时间</dt><dd>2026-09-24 09:00</dd><dt>影响范围</dt><dd>生产系统约 160 个终端</dd></dl><div class="diagnostic-items"><h3>智能诊断结果</h3><p><CheckCircle2 :size="15"/><span>端口在线<small>PE-1/0/24</small></span><b class="green-text">在线</b></p><p><AlertTriangle :size="15"/><span>接收光功率<small>当前值 -25.8 dBm</small></span><b class="red-text">异常</b></p><p><AlertTriangle :size="15"/><span>同区域告警<small>发现 3 条关联告警</small></span><b>查看</b></p></div></aside>
            <main class="order-center"><article class="sla-card"><header><Clock3 :size="19"/><span>SLA 倒计时</span></header><strong>{{ orderStage >= 4 ? '已恢复' : '01:36:45' }}</strong><p><span>目标完成时间 2026-09-24 14:00</span><b>{{ orderStage >= 4 ? '提前完成' : '超时风险' }}</b></p><i><b :style="{width: `${Math.max(20, orderStage * 18)}%`}"></b></i></article><article class="panel process-panel"><header><div><h2>工单处理流程</h2><p>节点状态实时同步</p></div></header><div class="process-steps"><div v-for="(step,index) in ['工单创建','智能派发','专员受理','检修处理','客户确认','完成归档']" :key="step" :class="{done:index<orderStage,active:index===orderStage}"><i><Check v-if="index<orderStage" :size="14"/><span v-else>{{ index+1 }}</span></i><b>{{ step }}</b></div></div></article><article class="panel timeline-panel"><header><div><h2>处理记录</h2><p>Trace ID：TRC-20260924-8F72A9</p></div></header><div class="timeline"><div><i></i><span><b>客户提交故障</b><p>上传专线告警截图，反馈生产系统访问缓慢。</p><small>10:32 · 客户</small></span></div><div><i></i><span><b>AI 完成多模态诊断</b><p>识别 LOS 告警，检索 3 份知识，调用模拟网管。</p><small>10:33 · 系统自动</small></span></div><div><i></i><span><b>生成 P1 检修工单</b><p>依据金牌客户 SLA 自动派发网络维护中心。</p><small>10:34 · 系统自动</small></span></div><div v-if="orderStage>=2"><i></i><span><b>检修专员已受理</b><p>邮件 MAIL-6F28A 投递成功，王工已受理。</p><small>10:36 · 邮件工作流</small></span></div><div v-if="orderStage>=3"><i></i><span><b>现场检修完成</b><p>重新熔接尾纤，光功率恢复至 -18.2 dBm。</p><small>11:18 · 王工</small></span></div></div></article></main>
            <aside class="panel dispatch-panel"><header><div><h2>派发与调度</h2><p>推荐维护单位</p></div></header><div class="dispatch-unit"><i><Users :size="20"/></i><span><b>新区网络维护中心</b><small>匹配度 92% · 可用工程师 8 人</small></span></div><h3>推荐原因</h3><ol><li>该区域专线故障由本中心负责</li><li>当前有具备专线资质的工程师空闲</li><li>预计 30 分钟内到达客户现场</li><li>历史相似故障处理成功率 96.7%</li></ol><textarea>客户反馈企业内部网络中断，影响生产系统访问，请尽快安排工程师现场排查。</textarea><button class="button primary full" :disabled="orderStage===5" @click="advanceOrder">{{ ['立即派发','模拟专员受理','回写检修结果','提交客户确认','确认并归档','工单已完成'][orderStage] }}<ArrowRight :size="15"/></button></aside>
          </section>
        </template>

        <template v-else-if="page === 'quality'">
          <section class="metric-grid"><article v-for="item in qualityMetrics" :key="item.label" class="metric-card"><span class="metric-icon" :class="item.tone"><component :is="item.icon" :size="21"/></span><div><small>{{ item.label }}</small><strong>{{ item.value }}</strong><em>{{ item.change }}</em></div></article></section>
          <section class="quality-layout"><article class="panel quality-rules"><header><div><h2>质检规则与检测结果</h2><p>全量会话自动质检</p></div><button class="text-button">全部结果<ChevronDown :size="13"/></button></header><table><thead><tr><th>规则类型</th><th>规则名称</th><th>检测结果</th><th>命中次数</th><th>得分</th></tr></thead><tbody><tr v-for="row in [['服务规范','开场白是否标准','通过','0','10/10'],['身份核验','客户身份核验完整','通过','0','10/10'],['合规风险','是否存在违规承诺','疑似违规','1','-8/10'],['业务解答','产品资费解释清晰','通过','0','10/10'],['服务态度','是否存在不当用语','未通过','2','-6/10']]" :key="row[1]"><td>{{row[0]}}</td><td>{{row[1]}}</td><td><span class="status-tag" :class="row[2]==='通过'?'success':row[2]==='未通过'?'failed':'pending'">{{row[2]}}</span></td><td>{{row[3]}}</td><td :class="{'red-text':row[4].startsWith('-')}">{{row[4]}}</td></tr></tbody></table></article><article class="panel review-panel"><header><div><h2>客户回访</h2><p>回访记录与二次跟进</p></div></header><div v-for="item in [['满意','客户138****6688','服务态度很好，问题已经解决。'],['一般','客户159****3321','问题基本解决，但希望后续加快处理速度。'],['不满意','客户186****7755','问题仍未解决，希望尽快安排技术人员。']]" :key="item[1]" class="review"><i :class="item[0]==='满意'?'good':item[0]==='一般'?'normal':'bad'">{{item[0]}}</i><span><b>{{item[1]}}</b><p>{{item[2]}}</p></span></div><div class="follow-up"><AlertTriangle :size="17"/><span><b>已自动创建二次跟进任务</b><small>客户186****7755 · 优先级高 · 24小时内处理</small></span><button class="button secondary">查看任务</button></div></article></section>
        </template>
      </main>
    </section>
    <div v-if="toast" class="toast"><CheckCircle2 :size="18"/><span>{{ toast }}</span><button @click="toast=''"> <X :size="15"/></button></div>
  </div>
</template>
