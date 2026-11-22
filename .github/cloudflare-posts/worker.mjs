const dispatchEndpoint =
  'https://api.github.com/repos/alex-coch/alex-coch.github.io/actions/workflows/sync-linkedin-posts.yml/dispatches';

export default {
  async scheduled(event, env) {
    if (!env.GITHUB_DISPATCH_TOKEN) throw new Error('Missing GITHUB_DISPATCH_TOKEN Worker secret.');

    const response = await fetch(dispatchEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${env.GITHUB_DISPATCH_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'alex-coch-posts-scheduler',
        'X-GitHub-Api-Version': '2026-03-10',
      },
      body: JSON.stringify({ ref: 'main', inputs: { source: 'cloudflare-cron' } }),
    });

    if (!response.ok) {
      throw new Error(`GitHub refused the scheduled dispatch (HTTP ${response.status}).`);
    }

    const runId = response.status === 200 ? (await response.json()).workflow_run_id : undefined;
    console.log('Dispatched Posts sync', {
      scheduledTime: new Date(event.scheduledTime).toISOString(),
      runId,
    });
  },
};
