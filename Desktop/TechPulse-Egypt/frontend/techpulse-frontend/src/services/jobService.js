import api from "./api";

// =============================
// Hero Stats
// =============================
export const getStats = async () => {
  const res = await api.get("/stats");
  return res.data;
};

// =============================
// Jobs
// =============================
export const getJobs = async (
  page = 1,
  limit = 12,
  filters = {}
) => {

  const res = await api.get("/jobs", {
    params: {
      page,
      limit,
      ...filters,
    },
  });

  return res.data;
};

// =============================
// Search
// =============================
export const searchJobs = async (filters) => {

  const res = await api.get("/jobs", {
    params: filters,
  });

  return res.data;
};

export const getJobById = async (id) => {

  const res = await api.get(`/jobs/${id}`);

  return res.data;

};