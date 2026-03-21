<script>
  let { data = [], maxValue = 1 } = $props();

  function getMax() {
    if (maxValue > 0) return maxValue;
    return Math.max(...data, 1);
  }
</script>

<div class="chart">
  <div class="ref-line" style="bottom: 80%"><span>80%</span></div>
  <div class="ref-line" style="bottom: 60%"><span>60%</span></div>
  <div class="ref-line" style="bottom: 40%"><span>40%</span></div>
  <div class="ref-line" style="bottom: 20%"><span>20%</span></div>
  {#each data as value}
    <div class="bar" style="height: {(value / getMax()) * 100}%"></div>
  {/each}
</div>

<style>
  .chart {
    height: 150px;
    width: 100%;
    background: linear-gradient(180deg, rgba(34,197,94,0.15), transparent);
    border-radius: 12px;
    margin-top: 10px;
    display: flex;
    align-items: flex-end;
    padding: 10px;
    gap: 4px;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  .bar {
    flex: 1;
    min-width: 4px;
    background: #22c55e;
    border-radius: 4px;
    opacity: 0.8;
    position: relative;
    z-index: 2;
  }

  .ref-line {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed #475569;
    z-index: 1;
  }

  .ref-line span {
    position: absolute;
    right: 8px;
    top: -10px;
    font-size: 0.65rem;
    color: #64748b;
  }
</style>