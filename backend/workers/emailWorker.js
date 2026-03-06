import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { sendEmail } from "../utils/mailer.js";

const worker = new Worker(
  "emailQueue",
  async (job) => {
    if (job.name === "orderPreparedEmail") {
      const { email, orderId } = job.data;

      await sendEmail({
        to: email,
        subject: `Order ${orderId} Ready`,
        html: `<h2>Your order is ready</h2>`,
      });
    }
  },
  { connection: redis }
);

worker.on("completed", (job) => {
  console.log("Email job completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("Email job failed:", err);
});