const getDaysAgo = (updatedDate: string) =>
  updatedDate
    ? Math.round(
        ((new Date().getTime() - new Date(updatedDate).getTime()) /
          (1000 * 60 * 60 * 24)) *
          100,
      ) / 100
    : -1;

const getTextColor = (updatedDate: string) => {
  const daysAgo = getDaysAgo(updatedDate);

  if (daysAgo < 0 || daysAgo > 3) {
    return "text-red-500";
  }

  if (daysAgo <= 1) return "text-green-500";
  if (daysAgo <= 3) return "text-orange-500";
};

export { getTextColor };
