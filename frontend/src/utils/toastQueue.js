import { toast } from "react-toastify";

export const showToastSequence = (messages, gap = 2000) => {
  const items = Array.isArray(messages) ? messages.filter(Boolean) : [messages].filter(Boolean);

  items.forEach((item, index) => {
    window.setTimeout(() => {
      if (typeof item === "string") {
        toast(item);
        return;
      }

      const { type = "default", message, ...options } = item;
      if (typeof toast[type] === "function") {
        toast[type](message, options);
      } else {
        toast(message, options);
      }
    }, index * gap);
  });
};
