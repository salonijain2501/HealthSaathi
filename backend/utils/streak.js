export const calculateStreak = (moods) => {
  if (!moods || moods.length === 0) return 0;

  let streak = 1;

  for (let i = moods.length - 1; i > 0; i--) {
    const diff =
      (new Date(moods[i].date) - new Date(moods[i - 1].date)) /
      (1000 * 60 * 60 * 24);

    if (Math.floor(diff) === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};
