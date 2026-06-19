const { ActivityType } = require("discord.js");
const loadCommands = require("../../handlers/commandHandler");
const {
  setClient,
  startHeartbeat,
  seedSystems,
} = require("../../utils/systemMonitor");

module.exports = {
  name: "clientReady",
  once: true,

  async execute(client) {
    await Promise.all([loadCommands(client)]);

    client.logger.info(`${client.user.tag} is online!`);

    const updateStatus = () => {
      client.user.setActivity("v1.3.1 | Tracking Bugs", {
        type: ActivityType.Custom,
      });
    };

    // Run immediately once
    updateStatus();

    // Then update every minute (60000 ms)
    setInterval(updateStatus, 60 * 1000);

    // Register client for status monitoring and kick off the 30-second heartbeat
    // that keeps the single BotStatus document up to date for the website
    setClient(client);
    startHeartbeat();

    // Seed BotStatus with every known command and event so the website shows
    // all systems from the moment the bot starts (existing status data preserved)
    seedSystems(client).catch((err) =>
      client.logger.error(
        "[SystemMonitor] seedSystems failed:",
        err
      )
    );
  },
};