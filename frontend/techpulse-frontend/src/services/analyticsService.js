import api from "./api";


export const getAnalytics = async()=>{

const res = await api.get("/analytics");

return res.data;

};



export const getAnalyticsJobs = async()=>{

const res = await api.get("/analytics/jobs");

return res.data;

};