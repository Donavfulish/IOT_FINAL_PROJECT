import { sendToFrontendBySocket } from "./device.services.js";

export const sendFaultSignal = (data) => {
  console.log(data);
  sendToFrontendBySocket({
    id: "button-fault-signal",
  });
};
