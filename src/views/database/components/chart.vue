<template>
  <div class="database-tabs-content">
    <div ref="chartRef" style="width:100%; height: calc(100vh - 220px);"></div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
// import vis from 'vis-network';
import vis from 'vis-network/standalone/umd/vis-network.min.js';
import 'vis-network/styles/vis-network.min.css'; // 引入 CSS 文件
const chartRef = ref ()

onMounted (() => {
  if (chartRef.value) {
    const data = {
      nodes: new vis.DataSet ([
        {id: 1, label: 'Node 1'},
        {id: 2, label: 'Node 2'},
        {id: 3, label: 'Node 3'},
        {id: 4, label: 'Node 4'},
        {id: 5, label: 'Node 5'},
        // 更多节点...
      ]),
      edges: new vis.DataSet ([
        {from: 1, to: 2, label: "only"},
        {from: 1, to: 3, label: "and"},
        {from: 2, to: 3, label: "and"},
        {from: 4, to: 5, label: "Required for"},
        // 更多边...
      ])
    };
    const options = {
      interaction: { zoomView: true },
      physics: {
        enabled: true,       // 必须启用物理引擎
      }
    }; // 可配置项放在这里
    const network = new vis.Network (chartRef.value, data, options);
    let isFirstRender = true;
    network.on('afterDrawing', function(ctx) {
      //初次渲染时
      if (isFirstRender) {
        network.fit({
          // animation: true // 可启用动画过渡
        });
        isFirstRender = false;
      }
    });

  }
})
</script>

<style scoped>

</style>
