export const fixSlug = (name: string) => {
  return name.replace(/ /g, "-")?.normalize("NFD").replace(/[^a-zA-Z0-9-]/g, "")?.toLowerCase();
};

export const watchStatus = {
  WATCHING: {
    id: 1,
    name: "Watching",
    color: "#0090d0"
  },
  COMPLETED: {
    id: 2,
    name: "Completed",
    color: "#00c153"
  },
  ON_HOLD: {
    id: 3,
    name: "On Hold",
    color: "#fbbf24"
  },
  DROPPED: {
    id: 4,
    name: "Dropped",
    color: "#a90000"
  },
  PLAN_TO_WATCH: {
    id: 0,
    name: "Plan to Watch",
    color: "#000000"
  }
};

export const watchStatusNameBydId = (id: number) => {
  return Object.values(watchStatus).find(status => status.id === id)?.name;
};

export const watchStatusColorById = (id: number) => {
  return Object.values(watchStatus).find(status => status.id === id)?.color;
};
