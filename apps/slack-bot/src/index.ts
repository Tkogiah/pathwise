import { App } from '@slack/bolt';
import { registerSlashHandlers } from './slack/handlers/slash';
import { registerReactionHandlers } from './slack/handlers/reaction';
import { registerActionHandlers } from './slack/handlers/action';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

registerSlashHandlers(app);
registerReactionHandlers(app);
registerActionHandlers(app);

void (async () => {
  await app.start();
  console.log('⚡️ Pathwise Slack bot is running (Socket Mode)');
})();
