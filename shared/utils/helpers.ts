export const fixSlug = (name?: string | null) => {
  return name?.replace(/ /g, "-")?.normalize("NFD").replace(/[^a-zA-Z0-9-]/g, "")?.toLowerCase();
};

export const watchStatus = {
  PLAN_TO_WATCH: {
    id: 0,
    name: "Plan to Watch"
  },
  WATCHING: {
    id: 1,
    name: "Watching"
  },
  COMPLETED: {
    id: 2,
    name: "Completed"
  },
  ON_HOLD: {
    id: 3,
    name: "On Hold"
  },
  DROPPED: {
    id: 4,
    name: "Dropped"
  }
};

export const watchStatusNameBydId = (id: number) => {
  return Object.values(watchStatus).find(status => status.id === id)?.name;
};
