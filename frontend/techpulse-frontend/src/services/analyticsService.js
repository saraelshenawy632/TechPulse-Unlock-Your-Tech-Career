import axios from "axios";


// =====================================================
// API BASE URL
// =====================================================

const API_URL =
    "http://localhost:5000/api/admin/analytics";


// =====================================================
// GET ANALYTICS SUMMARY
//
// GET
// /api/admin/analytics
//
// Returns:
// - kpis
// - jobs
// - jobsByCategory
// - workTypes
// - experience
// - companies
// - platforms
// - locations
// - jobsTrend
// =====================================================

export const getAnalytics = async () => {

    return axios.get(

        API_URL,

        {

            timeout:
                30000

        }

    );

};


// =====================================================
// GET ALL ANALYTICS JOBS
//
// GET
// /api/admin/analytics/jobs
// =====================================================

export const getAnalyticsJobs = async () => {

    return axios.get(

        `${API_URL}/jobs`,

        {

            timeout:
                30000

        }

    );

};


// =====================================================
// GET LOCATIONS ANALYTICS
//
// GET
// /api/admin/analytics/locations
// =====================================================

export const getAnalyticsLocations = async () => {

    return axios.get(

        `${API_URL}/locations`,

        {

            timeout:
                30000

        }

    );

};