import axios from "axios";


// ==========================
// API
// ==========================

const API = "http://localhost:5000/api/admin";


// ==========================
// Axios Config
// ==========================

const config = () => ({
    headers: {
        Authorization:
            `Bearer ${localStorage.getItem("token")}`
    }
});


// ==========================
// Dashboard
// ==========================

export const getDashboard = () => {

    return axios.get(
        `${API}/dashboard`,
        config()
    );

};


// ==========================
// Analytics
// ==========================

export const getAnalytics = () => {

    return axios.get(
        `${API}/analytics`,
        config()
    );

};


// ==========================
// Jobs
// ==========================

export const getJobs = (
    page = 1,
    limit = 10
) => {

    return axios.get(

        `${API}/jobs?page=${page}&limit=${limit}`,

        config()

    );

};


// ==========================
// Add Job
// ==========================

export const addJob = (job) => {

    return axios.post(

        `${API}/jobs`,

        job,

        config()

    );

};


// ==========================
// Update Job
// ==========================

export const updateJob = (
    id,
    job
) => {

    return axios.put(

        `${API}/jobs/${id}`,

        job,

        config()

    );

};


// ==========================
// Delete Job
// ==========================

export const deleteJob = (id) => {

    return axios.delete(

        `${API}/jobs/${id}`,

        config()

    );

};


// ==========================
// Users
// ==========================

export const deleteUser = (id) => {

    return axios.delete(

        `${API}/users/${id}`,

        config()

    );

};


// ==========================
// Update User Role
// ==========================

export const updateRole = (
    id,
    role
) => {

    return axios.put(

        `${API}/users/${id}/role`,

        {
            role
        },

        config()

    );

};


// ==========================
// Applications
// ==========================

export const getApplications = () => {

    return axios.get(

        `${API}/applications`,

        config()

    );

};


// ==========================
// Get Application By ID
// ==========================

export const getApplicationById = (
    id
) => {

    return axios.get(

        `${API}/applications/${id}`,

        config()

    );

};


// ==========================
// Update Application Status
// ==========================

export const updateApplicationStatus = (
    id,
    status
) => {

    return axios.put(

        `${API}/applications/${id}`,

        {
            status
        },

        config()

    );

};


// ==========================
// Delete Application
// ==========================

export const deleteApplication = (
    id
) => {

    return axios.delete(

        `${API}/applications/${id}`,

        config()

    );

};