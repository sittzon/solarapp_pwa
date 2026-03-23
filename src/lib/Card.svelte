<script>
  let { span = 1, loading = false, title, subtitle, children } = $props();
</script>

<div class="card" class:span-2={span === 2}  class:span-3={span === 3}>
  {#if title || subtitle}
    <div class="header">
      {#if title}
        <div class="label">{title}</div>
      {/if}
      {#if subtitle}
        <div class="subtitle">{subtitle}</div>
      {/if}
    </div>
  {/if}
  <div class="content">
    {#if loading}
      <div class="spinner"></div>
    {:else if children}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  .card {
    background: var(--color-surface);
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    transition: transform 0.2s;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  .card:hover {
    transform: translateY(-4px);
  }

  .span-2 {
    grid-column: span 2;
  }

  .span-3 {
    grid-column: span 3;
  }

  .content {
    width: 100%;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: right;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-green);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .label {
    font-size: 0.9rem;
    color: var(--color-text-muted);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 0.85rem;
    color: var(--color-yellow);
    font-weight: 500;
  }
</style>