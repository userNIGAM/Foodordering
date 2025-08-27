export const randomGreeting = (name) => {
  const greetings = [
    `Hi ${name}!`,
    `Hello ${name}!`,
    `Hey ${name}!`,
    `Namaste ${name}!`,
    `Warm greetings, ${name}!`,
  ];
  const idx = Math.floor(Math.random() * greetings.length);
  return greetings[idx];
};
