export const buildPrompt = ({ mood, note, timeOfDay, streak }) => {
  return `
User mood: ${mood}
User note: "${note}"
Time of day: ${timeOfDay}
Mood streak: ${streak} days

Give a SHORT (2–3 lines), motivational, emotional support message.
Use different wording every time.
Avoid repeating phrases like "You are not alone".
Add warmth, encouragement, and hope.
No medical advice.
`;
};
