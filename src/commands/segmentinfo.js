const { InteractionResponseType } = require("discord-interactions");
const { ApplicationCommandOptionType } = require("slash-commands");
const { isValidSegmentUUID } = require("../util/sbc-util.js");
const { formatSegment } = require("../util/formatResponse.js");
const { segmentComponents } = require("../util/components.js");
const { invalidSegment, segmentNotFound } = require("../util/invalidResponse.js");
const { getSegmentInfo } = require("../util/min-api.js");

module.exports = {
  type: 1,
  name: "segmentinfo",
  description: "retrieves segment info",
  options: [
    {
      name: "segmentid",
      description: "UUID of segment to look up",
      type: ApplicationCommandOptionType.STRING,
      required: true
    },
    {
      name: "hide",
      description: "Only you can see the response",
      type: ApplicationCommandOptionType.BOOLEAN,
      required: false
    }
  ],
  execute: async ({ interaction, response }) => {
    // get params from discord
    const segmentid = ((interaction.data.options.find((opt) => opt.name === "segmentid") || {}).value || "").trim();
    const hide = (interaction.data.options.find((opt) => opt.name === "hide") || {}).value;
    // check for invalid segmentid
    if (!isValidSegmentUUID(segmentid)) return response(invalidSegment);
    // fetch
    const parsed = await getSegmentInfo(segmentid);
    if (parsed[0] === null) return response(segmentNotFound);
    return response({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: formatSegment(parsed[0]),
        components: segmentComponents(parsed[0].videoID, false),
        flags: (hide ? 64 : 0)
      }
    });
  }
};
