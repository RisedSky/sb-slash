const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const BASEURL = "https://sponsor.ajay.app/api";
const sbcutil = require("../util/sbc-util.js");
const { formatShowoff } = require("../util/formatResponse.js");
const { invalidPublicID } = require("../util/invalidResponse.js");

module.exports = {
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
    if (!sbcutil.isValidUserUUID(publicid)) return response(invalidPublicID);
    // construct url
    const url = `${BASEURL}/userInfo?publicUserID=${publicid}`;
    // fetch
    let res = await fetch(url);
    let body = await res.text();
    const parsed = formatShowoff(JSON.parse(body)) ;
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: parsed
      }
    });
  }
};
