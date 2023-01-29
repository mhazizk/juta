import axios from "axios";
import env from "../../config/env";

const postLogSnagEvent = async (displayName, eventTypes) => {
  const data = JSON.stringify({
    project: "juta",
    channel: eventTypes.channel,
    event: eventTypes.title,
    description: displayName + " " + eventTypes.description,
    icon: eventTypes.icon,
    notify: false,
  });

  const options = {
    method: "POST",
    url: env.logSnagConfig.apiUrl,
    data: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.logSnagConfig.apiKey}`,
    },
  };

  try {
    const { data } = await axios(options);
    return JSON.stringify(data);
  } catch (error) {
    console.log(error);
  }
};

export default postLogSnagEvent;
