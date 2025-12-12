import axios from "axios";

const pushNotification = async (title, body) => {
  try {
    const res = await axios.post(
      "https://api.pushbullet.com/v2/pushes",
      {
        type: "note",
        title,
        body,
      },
      {
        headers: {
          "Access-Token": process.env.PUSHBULLET_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Push sent:", res.data);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default { pushNotification };
