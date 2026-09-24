<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";

echarts.use([BarChart, LineChart, PieChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

const props = defineProps<{ option: EChartsOption }>();
const root = ref<HTMLDivElement>();
let chart: echarts.ECharts | undefined;

function resize() { chart?.resize(); }

onMounted(() => {
  if (!root.value) return;
  chart = echarts.init(root.value);
  chart.setOption(props.option);
  window.addEventListener("resize", resize);
});

watch(() => props.option, (value) => chart?.setOption(value, true), { deep: true });
onBeforeUnmount(() => { window.removeEventListener("resize", resize); chart?.dispose(); });
</script>

<template><div ref="root" class="echart" /></template>
