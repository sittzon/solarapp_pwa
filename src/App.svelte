<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/dist/Chart.js';

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/";

  let loading = $state(true);
  let lastUpdate = $state('');
  let status = $state('');
  let powerNow = $state(0);
  let powerUnit = $state('W');
  let temperature = $state('');
  let today = $state(0);
  let month = $state(0);
  let year = $state(0);
  let total = $state(0);
  let totalUnit = $state('');
  let timelineData = $state({ x: [], y: [] });

  let chartCanvas;
  let chart;

  async function fetchStatus() {
    try {
      const res = await fetch(`${API_URL}status`);
      const json = await res.json();
      status = json.Status;
    } catch (e) {
      console.error('Status error:', e);
    }
  }

  async function fetchEnergyNow() {
    try {
      const res = await fetch(`${API_URL}now`);
      const json = await res.json();
      lastUpdate = new Date(json.TimeStamp).toLocaleString();
      let power = json.Energy;
      const unit = json.Unit;
      if (power > 1000) {
        power = power / 100;
        power = Math.round(power) / 10;
        powerUnit = 'kW';
      } else {
        powerUnit = unit;
      }
      powerNow = power;
    } catch (e) {
      console.error('EnergyNow error:', e);
    }
  }

  async function fetchEnergySummary() {
    try {
      const res = await fetch(`${API_URL}summary`);
      const json = await res.json();
      today = json.Today;
      month = json.Month;
      year = json.Year;
      total = Math.round(json.Total * 10) / 10;
      totalUnit = json.Unit;
    } catch (e) {
      console.error('EnergySummary error:', e);
    }
  }

  async function fetchTimeline() {
    try {
      const res = await fetch(`${API_URL}timeline`);
      const json = await res.json();
      const x = [];
      const y = [];
      for (let i = 0; i < json.length; i++) {
        x.push(json[i].TimeStamp.substring(11, 16));
        y.push(json[i].Value * 1000);
      }
      timelineData = { x, y };
      updateChart();
    } catch (e) {
      console.error('Timeline error:', e);
    }
  }

  async function fetchSmhiData() {
    try {
      const res = await fetch('http://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/16.349/lat/56.678/data.json');
      const json = await res.json();
      const key = Object.keys(json.timeSeries[0].parameters).find(k => json.timeSeries[0].parameters[k].name === 't');
      temperature = json.timeSeries[0].parameters[key].values[0] + '°C';
    } catch (e) {
      console.error('SMHI error:', e);
    }
  }

  async function fetchAllData() {
    loading = true;
    await Promise.all([
      fetchStatus(),
      fetchEnergyNow(),
      fetchEnergySummary(),
      fetchTimeline(),
      fetchSmhiData()
    ]);
    loading = false;
  }

  function updateChart() {
    if (chart) {
      chart.data.labels = timelineData.x;
      chart.data.datasets[0].data = timelineData.y;
      chart.update();
    } else if (chartCanvas && timelineData.x.length > 0) {
      chart = new Chart(chartCanvas, {
        type: 'line',
        data: {
          labels: timelineData.x,
          datasets: [{
            label: 'Power (W)',
            data: timelineData.y,
            borderColor: 'orange',
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            fill: true
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { ticks: { color: 'white' } },
            y: { ticks: { color: 'white' } }
          },
          plugins: {
            legend: { labels: { color: 'white' } }
          }
        }
      });
    }
  }

  onMount(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 60000);
    return () => clearInterval(interval);
  });
</script>

<div class="h-100 text-light container-fluid" style="background: black;">
  <h3 class="text-center display-8">Solar App</h3>
  
  {#if loading}
    <div class="d-flex justify-content-center">
      <div class="spinner-border ml-auto"></div>
    </div>
  {/if}

  <div class="container text-center">
    <p>{lastUpdate}</p>
    
    <div class="col">
      <div class="row"></div>
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <div class="row">
            <div class="col">
              <p>{status}</p>
            </div>
          </div>
          <img src="/solar_blue_icon.png" class="rounded-circle border border-warning rounded-sm mx-auto d-block img-fluid" alt="Solar" />

          <div class="row mt-3">
            <div class="col">
              <p>{powerNow} {powerUnit}</p>
            </div>
            <div class="col">
              <p>{temperature}</p>
            </div>
          </div>
        </div>
        <div class="col"></div>
      </div>
    </div>

    <div class="row mt-3">
      <canvas bind:this={chartCanvas} width="200" height="100"></canvas>
    </div>

    <div class="row mt-3">
      <p>Today: {today} | Month: {month} | Year: {year} | Total: {total} {totalUnit}</p>
    </div>
  </div>
</div>
