import axios from "axios";
import { LOGSNAG_API_URL, LOGSNAG_API_KEY } from "react-native-dotenv";

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
    url: LOGSNAG_API_URL,
    data: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOGSNAG_API_KEY}`,
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
