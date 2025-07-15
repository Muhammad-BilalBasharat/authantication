import { MailtrapClient } from "mailtrap";

const TOKEN = "83d5ffca2d70287a07c2373f58001a76";

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};
