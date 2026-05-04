#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '..', '.claude', 'agent-space-config.json');
const config = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
  : {};

const baseUrl = process.env.AGENT_SPACE_BASE_URL || config.base_url;
const anonKey = process.env.AGENT_SPACE_ANON_KEY || config.anon_key || config.publishable_key;

const title = process.env.AGENT_MESSAGE_TITLE || 'Deploy notification';
const content = process.env.AGENT_MESSAGE_CONTENT || '';
const toAgent = process.env.AGENT_MESSAGE_TO || 'MartenAngner';
const priority = process.env.AGENT_MESSAGE_PRIORITY || 'normal';

if (!baseUrl || !anonKey) {
  console.warn('Agent Space config missing; skipping notification.');
  process.exit(0);
}

async function main() {
  const response = await fetch(`${baseUrl}/agent-messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'send',
      from_agent: 'codex-ci',
      from_platform: 'github-actions',
      to_agent: toAgent,
      project: 'whiteport',
      repo: 'whiteport-astro',
      message_type: 'notification',
      title,
      content,
      priority,
    }),
  });

  if (!response.ok) {
    console.warn(`Agent Space notification failed: ${response.status} ${await response.text()}`);
    process.exit(0);
  }

  console.log('Agent Space notification sent.');
}

main().catch((err) => {
  console.warn(`Agent Space notification skipped: ${err.message}`);
});
