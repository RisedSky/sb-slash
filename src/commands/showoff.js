const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const { isValidUserUUID } = require("../util/sbc-util.js");
const { formatShowoff } = require("../util/formatResponse.js");
const { invalidPublicID } = require("../util/invalidResponse.js");
const { getUserInfoShowoff } = require("../util/min-api.js");

module.exports = {
  type: 1,
  name: "showoff",
  description: "Show off your stats",
  options: [
    {
      name: "publicid",
      description: "Public User ID",
      type: ApplicationCommandOptionType.STRING,
      required: true
    }
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const publicid = ((interaction.data.options.find((opt) => opt.name === "publicid") || {}).value || "").trim();
    // check for invalid publicID
    if (!isValidUserUUID(publicid)) return response(invalidPublicID);
    // fetch
    const res = await getUserInfoShowoff(publicid);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [formatShowoff(publicid, res)]
      }
    });
  }
};
