<script>
  let { data = [], labels = [], maxValue = 1 } = $props();

  let filteredData = $derived(data.filter(v => v > 0));
  let filteredLabels = $derived(labels.filter((_, i) => data[i] > 0));

  let chartWidth = $state(300);
  let chartEl = $state(null);

  $effect(() => {
    if (chartEl) {
      chartWidth = chartEl.offsetWidth;
      const observer = new ResizeObserver(entries => {
        chartWidth = entries[0].contentRect.width;
      });
      observer.observe(chartEl);
      return () => observer.disconnect();
    }
  });

  function getMax() {
    if (maxValue > 0) return maxValue;
    return Math.max(...filteredData, 1);
  }

  function shouldShowTimestamp(i) {
    const current = filteredData[i];
    const prev = i > 0 ? filteredData[i - 1] : 0;
    return current > 10 && prev <= 10;
  }

  function getTimestampPosition(i) {
    const barWidth = (chartWidth - 50) / filteredData.length;
    return ((10 + (i + 0.5) * barWidth) / chartWidth) * 100;
  }

  function getPeakIndex() {
    if (filteredData.length === 0) return -1;
    const maxVal = Math.max(...filteredData);
    return filteredData.indexOf(maxVal);
  }

  function shouldShowPeakTimestamp(i) {
    return i === getPeakIndex() && filteredData[i] > 0;
  }
</script>

<div class="chart" bind:this={chartEl}>
  <div class="ref-line" style="bottom: 80%"><span>80%</span></div>
  <div class="ref-line" style="bottom: 60%"><span>60%</span></div>
  <div class="ref-line" style="bottom: 40%"><span>40%</span></div>
  <div class="ref-line" style="bottom: 20%"><span>20%</span></div>
  {#each filteredData as value, i}
    <div class="bar-container">
      <div class="bar" class:peak={shouldShowPeakTimestamp(i)} style="height: {(value / getMax()) * 100}%"></div>
    </div>
  {/each}
  {#each filteredData as _, i}
    {#if shouldShowTimestamp(i)}
      <div class="timestamp" style="left: {getTimestampPosition(i)}%">{filteredLabels[i]}</div>
    {/if}
    {#if shouldShowPeakTimestamp(i)}
      <div class="timestamp peak" style="left: {getTimestampPosition(i)}%">{filteredLabels[i]}</div>
    {/if}
  {/each}
</div>

<style>
  .chart {
    height: 180px;
    width: 100%;
    background: linear-gradient(180deg, color-mix(in srgb, var(--color-green, #22c55e) 15%, transparent), transparent);
    border-radius: 12px;
    margin-top: 10px;
    display: flex;
    align-items: flex-end;
    padding: 10px 40px 20px 10px;
    gap: 1px;
    overflow-x: hidden;
    position: relative;
    z-index: 1;
  }

  .bar-container {
    flex: 1;
    min-width: 1px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
  }

  .bar {
    width: 100%;
    background: var(--color-green, #22c55e);
    border-radius: 4px;
    opacity: 0.8;
    position: relative;
    z-index: 2;
  }

  .bar.peak {
    background: var(--color-yellow, #f59e0b);
  }

  .timestamp {
    position: absolute;
    bottom: 8px;
    transform: translateX(-50%);
    font-size: 0.5rem;
    color: var(--color-text-dim, #64748b);
    white-space: nowrap;
    z-index: 3;
    font-weight: bold;
  }

  .timestamp.peak {
    color: var(--color-yellow, #f59e0b);
  }

  .ref-line {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed var(--color-ref-line, #475569);
    z-index: 1;
  }

  .ref-line span {
    position: absolute;
    right: 10px;
    top: -10px;
    font-size: 0.65rem;
    color: var(--color-text-dim, #64748b);
  }
</style>