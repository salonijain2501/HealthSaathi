const suggestions = {
  Happy: [
    "🌸 Your happiness is contagious — keep shining today!",
    "✨ Enjoy this moment fully, you deserve it.",
    "💛 Hold on to this joy and let it fuel your day."
  ],
  Anxious: [
    "🌱 Take one deep breath — you are doing your best.",
    "💙 It's okay to feel unsure. Progress happens slowly.",
    "🌸 Calmness begins with self-kindness."
  ],
  Sad: [
    "💙 Tough days don't last forever. Be gentle with yourself.",
    "🌧️ It's okay to feel low — brighter days will come.",
    "🌱 Healing takes time, and you're moving forward."
  ],
  Angry: [
    "🔥 Pause for a moment — your peace matters.",
    "🌿 Step back and breathe. Control returns with calm.",
    "💙 Let go of what you can't control today."
  ],
  Calm: [
    "🌸 Enjoy this peaceful state — it's a gift.",
    "✨ Stay present, this calm is powerful.",
    "💙 Balance like this helps you grow."
  ]
};

export const getFallbackSuggestion = (mood) => {
  const moodSuggestions = suggestions[mood] || [
    "💙 Thank you for sharing. You're doing well."
  ];

  return moodSuggestions[
    Math.floor(Math.random() * moodSuggestions.length)
  ];
};
