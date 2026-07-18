import axios from "axios";


const API = "http://localhost:5000/api/admin";


// ==========================
// Axios Config
// ==========================

const config = () => ({
    headers:{
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
// بدون Backend Route
// ==========================

export const getAnalytics = async () => {

    const res = await axios.get(
        `${API}/dashboard`,
        config()
    );


    return {

        data:{
            categories:
            res.data.dashboard.categories || [],


            workTypes:
            res.data.dashboard.workTypes || [],


            companies:
            res.data.dashboard.companies || [],


            locations:
            res.data.dashboard.locations || []

        }

    };

};




// ==========================
// Jobs
// ==========================


export const getJobs = (page=1,limit=10)=>{

    return axios.get(

        `${API}/jobs?page=${page}&limit=${limit}`,

        config()

    );

};





export const addJob=(job)=>{

    return axios.post(

        `${API}/jobs`,

        job,

        config()

    );

};






export const updateJob=(id,job)=>{


    return axios.put(

        `${API}/jobs/${id}`,

        job,

        config()

    );

};






export const deleteJob=(id)=>{


    return axios.delete(

        `${API}/jobs/${id}`,

        config()

    );

};







// ==========================
// Users
// ==========================


export const deleteUser=(id)=>{


    return axios.delete(

        `${API}/users/${id}`,

        config()

    );

};







export const updateRole=(id,role)=>{


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


export const getApplications=()=>{


    return axios.get(

        `${API}/applications`,

        config()

    );

};






export const getApplicationById=(id)=>{


    return axios.get(

        `${API}/applications/${id}`,

        config()

    );

};







export const updateApplicationStatus=(id,status)=>{


    return axios.put(

        `${API}/applications/${id}`,

        {
            status
        },

        config()

    );

};






export const deleteApplication=(id)=>{


    return axios.delete(

        `${API}/applications/${id}`,

        config()

    );

};