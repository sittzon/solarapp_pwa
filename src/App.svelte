<script>
  import { onMount } from 'svelte';
  import Card from './lib/Card.svelte';
  import Chart from './lib/Chart.svelte';
  import './lib/theme.css';

  const API_URL = import.meta.env.VITE_API_URL || "/api/";

  let loadingStatus = $state(true);
  let loadingNow = $state(true);
  let loadingSummary = $state(true);
  let loadingTimeline = $state(true);
  let loadingTemp = $state(true);
  let lastUpdate = $state('');
  let status = $state('');
  let powerNow = $state(0);
  let powerUnit = $state('W');
  let temperature = $state('');
  let today = $state(0);
  let month = $state(0);
  let year = $state(0);
  let total = $state(0);
  let totalUnit = $state('kWh');
  let timelineData = $state({ x: [], y: [] });

  async function fetchStatus() {
    loadingStatus = true;
    try {
      const res = await fetch(`${API_URL}status`);
      const json = await res.json();
      status = json.Status;
    } catch (e) {
      console.error('Status error:', e);
    } finally {
      loadingStatus = false;
    }
  }

  async function fetchEnergyNow() {
    loadingNow = true;
    try {
      const res = await fetch(`${API_URL}now`);
      const json = await res.json();
      lastUpdate = new Date().toLocaleTimeString();
      let power = json.Energy;
      if (power > 1000) {
        power = power / 1000;
        power = Math.round(power * 10) / 10;
        powerUnit = 'kW';
      } else {
        powerUnit = 'W';
      }
      powerNow = power;
    } catch (e) {
      console.error('EnergyNow error:', e);
    } finally {
      loadingNow = false;
    }
  }

  async function fetchEnergySummary() {
    loadingSummary = true;
    try {
      const res = await fetch(`${API_URL}summary`);
      const json = await res.json();
      today = Math.round(json.Today * 10) / 10;
      month = Math.round(json.Month * 10) / 10;
      year = Math.round(json.Year * 10) / 10;
      total = Math.round(json.Total * 10) / 10;
      totalUnit = json.Unit;
    } catch (e) {
      console.error('EnergySummary error:', e);
    } finally {
      loadingSummary = false;
    }
  }

  async function fetchTimeline() {
    loadingTimeline = true;
    try {
      const res = await fetch(`${API_URL}timeline`);
      const json = await res.json();
      const intervalData = {};
      for (let i = 0; i < json.length; i++) {
        const timestamp = json[i].TimeStamp;
        const hour = timestamp.substring(11, 13);
        const minute = timestamp.substring(14, 16);
        const interval = `${hour}:${minute}`;
        const value = json[i].Value * 1000;
        if (!intervalData[interval]) {
          intervalData[interval] = { sum: 0, count: 0 };
        }
        intervalData[interval].sum += value;
        intervalData[interval].count += 1;
      }
      const x = [];
      const y = [];
      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 5) {
          const hour = h.toString().padStart(2, '0');
          const minute = m.toString().padStart(2, '0');
          const interval = `${hour}:${minute}`;
          x.push(`${hour}:${minute}`);
          if (intervalData[interval] && intervalData[interval].count > 0) {
            y.push(Math.round(intervalData[interval].sum / intervalData[interval].count));
          } else {
            y.push(0);
          }
        }
      }
      timelineData = { x, y };
    } catch (e) {
      console.error('Timeline error:', e);
    } finally {
      loadingTimeline = false;
    }
  }

  async function fetchSmhiData() {
    loadingTemp = true;
    try {
      const res = await fetch('https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/16.349/lat/56.678/data.json');
      const json = await res.json();
      const key = Object.keys(json.timeSeries[0].parameters).find(k => json.timeSeries[0].parameters[k].name === 't');
      temperature = json.timeSeries[0].parameters[key].values[0];
    } catch (e) {
      console.error('SMHI error:', e);
    } finally {
      loadingTemp = false;
    }
  }

  async function fetchAllData() {
    await Promise.all([
      fetchStatus(),
      fetchEnergyNow(),
      fetchEnergySummary(),
      fetchTimeline(),
      fetchSmhiData()
    ]);
  }

  function getMaxPower() {
    return Math.max(...timelineData.y, 1);
  }

  onMount(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 60000);
    return () => clearInterval(interval);
  });
</script>

<div class="app">

  <div class="grid">
    <Card loading={loadingStatus} title="Status">
      <div class="value" class:green={status === 'Online'} class:red={status === 'Offline'}>{status || 'Unknown'}</div>
    </Card>

    <Card loading={loadingNow} title="Current Production">
      <div class="value green">{powerNow}
        <span class="unit">{powerUnit}</span>
      </div>
    </Card>

    <Card loading={loadingSummary} title="Today's Production">
      <div class="value green">{today}
        <span class="unit">{totalUnit}</span>
      </div>
    </Card>

    <Card loading={loadingTemp} title="Temperature">
      <div class="value blue">{temperature}
        <span class="unit">°C</span>
      </div>
    </Card>

    <Card span={2} loading={loadingTimeline} title="Production (Last 24 Hours)" subtitle="Peak: {(getMaxPower() / 1000).toFixed(2)} kW">
      <Chart data={timelineData.y} labels={timelineData.x} maxValue={getMaxPower()} />
    </Card>

    <Card loading={loadingSummary} title="This Month">
      <div class="value green">{month}
        <span class="unit">{totalUnit}</span>
      </div>
    </Card>

    <Card loading={loadingSummary} title="This Year">
      <div class="value green">{year}
        <span class="unit">{totalUnit}</span>
      </div>
    </Card>

    <Card loading={loadingSummary} title="Total Lifetime">
      <div class="value green">{(total / 1000).toFixed(2)}
        <span class="unit">MWh</span>
      </div>
    </Card>
  </div>

  <footer>
    Updated at {lastUpdate}
  </footer>
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  :global(body) {
    background: var(--color-bg);
    color: var(--color-text);
    min-height: 100vh;
  }

  .app {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
  }

  header {
    margin-bottom: 20px;
  }

  header h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--color-text);
    text-align: center;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
  }

  .value {
    font-size: 2rem;
    font-weight: 600;
  }

  .unit
  {
    font-size: 1.5rem;
    font-weight: 100;
    color: var(--color-text-muted);
  }

  .green { color: var(--color-green); }
  .yellow { color: var(--color-yellow); }
  .blue { color: var(--color-blue); }
  .red { color: var(--color-red); }

  footer {
    margin-top: 30px;
    color: var(--color-text-muted);
    font-size: 0.8rem;
    text-align: center;
  }
</style>