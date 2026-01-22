export const getTimeOfDay = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 18) return "Afternoon";
  return "Night";
};
