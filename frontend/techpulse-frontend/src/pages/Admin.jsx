import { useEffect, useState } from "react";
import { FaHome, FaBriefcase, FaUsers, FaChartBar, FaFileAlt, FaPlus, FaSyncAlt, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import DashboardCards from "../components/admin/DashboardCards";
import JobTable from "../components/admin/JobsTable";
import JobModal from "../components/admin/JobModal";
import Charts from "../components/admin/Charts";
import UserTable from "../components/admin/UsersTable";
import ApplicationTable from "../components/admin/ApplicationTable";
import ApplicationStats from "../components/admin/ApplicationStats";

import { 
    getDashboard, 
    getAnalytics, 
    getJobs, 
    deleteJob, 
    addJob, 
    updateJob, 
    deleteUser, 
    updateRole 
} from "../services/adminService";
import { confirmDelete, success, error } from "../utils/alerts";

export default function Admin() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [dashboard, setDashboard] = useState({});
    
    // Analytics State جديد
    const [analytics, setAnalytics] = useState({
        jobsByCategory: [],
        workTypes: [],
        companies: [],
        locations: []
    });

    const [jobs, setJobs] = useState([]);
    const [users, setUsers] = useState([]);
    const [applicationsCount, setApplicationsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);

    const pageSize = 10;

    async function loadData() {
        try {
            setLoading(true);
            const [dashboardRes, jobsRes, analyticsRes] = await Promise.all([
                getDashboard(), 
                getJobs(page, pageSize),
                getAnalytics()
            ]);
            
            setDashboard(dashboardRes.data.dashboard);
            setUsers(dashboardRes.data.users);
            setApplicationsCount(dashboardRes.data.dashboard.Applications || 0);
            setJobs(jobsRes.data.jobs);
            setTotalJobs(jobsRes.data.total);
            setTotalPages(jobsRes.data.totalPages);

            setAnalytics({
                jobsByCategory: analyticsRes.data.jobsByCategory || [],
                workTypes: analyticsRes.data.workTypes || [],
                companies: analyticsRes.data.companies || [],
                locations: analyticsRes.data.locations || []
            });
        } catch (err) {
            error("Failed Loading Data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadData(); }, [page]);

    async function handleSubmit(job) {
        try {
            if (editingJob) {
                await updateJob(editingJob.JobKey, job);
                success("Job Updated Successfully");
            } else {
                await addJob(job);
                success("Job Added Successfully");
            }
            setOpen(false);
            setEditingJob(null);
            loadData();
        } catch (err) {
            error("Operation Failed");
        }
    }

    async function handleDelete(job) {
        const ok = await confirmDelete(`Delete "${job.Title}" ?`);
        if (!ok) return;
        try {
            await deleteJob(job.JobKey);
            success("Job Deleted Successfully");
            loadData();
        } catch { error("Delete Failed"); }
    }

    async function handleDeleteUser(user) {
        const ok = await confirmDelete(`Delete ${user.Name}?`);
        if (!ok) return;
        try {
            await deleteUser(user.Id);
            success("User Deleted");
            loadData();
        } catch { error("Delete Failed"); }
    }

    async function handleRole(user) {
        try {
            const role = user.Role === "Admin" ? "User" : "Admin";
            await updateRole(user.Id, role);
            success("Role Updated");
            loadData();
        } catch { error("Role Update Failed"); }
    }

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
    );

    const tabs = [
        { name: "dashboard", label: "Dashboard", icon: <FaHome /> },
        { name: "jobs", label: "Jobs", icon: <FaBriefcase /> },
        { name: "applications", label: "Applications", icon: <FaFileAlt />, count: applicationsCount },
        { name: "users", label: "Users", icon: <FaUsers /> },
        { name: "analytics", label: "Analytics", icon: <FaChartBar /> }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
            
            <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 p-6 z-30 transform transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-black text-blue-500">TechPulse</h1>
                        <p className="text-gray-500 text-xs">Admin Panel</p>
                    </div>
                    <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><FaTimes /></button>
                </div>

                <div className="space-y-2">
                    {tabs.map(tab => (
                        <button key={tab.name} onClick={() => { setActiveTab(tab.name); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${activeTab === tab.name ? "bg-blue-600 shadow-lg" : "hover:bg-slate-800"}`}>
                            <div className="flex gap-3 items-center">{tab.icon} {tab.label}</div>
                            {tab.count > 0 && <span className="bg-red-500 px-2 rounded-full text-[10px]">{tab.count}</span>}
                        </button>
                    ))}
                </div>
            </aside>

            <main className="flex-1 p-4 lg:p-10 w-full overflow-hidden">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 bg-slate-800 rounded-lg" onClick={() => setIsSidebarOpen(true)}><FaBars /></button>
                        <div>
                            <h1 className="text-2xl lg:text-4xl font-bold capitalize">{activeTab}</h1>
                            <p className="text-gray-400 text-sm">{activeTab === "jobs" ? `${totalJobs} Jobs Available` : "Welcome back, Admin"}</p>
                        </div>
                    </div>
                    <button onClick={loadData} className="bg-slate-800 p-3 rounded-xl hover:bg-slate-700 transition"><FaSyncAlt /></button>
                </header>

                <div className="max-w-7xl mx-auto">
                    {activeTab === "dashboard" && (
                        <div className="space-y-8">
                            <DashboardCards dashboard={dashboard} />
                            <ApplicationStats dashboard={dashboard} />
                            <Charts 
                                jobsByCategory={analytics.jobsByCategory} 
                                workTypes={analytics.workTypes} 
                            />
                        </div>
                    )}
                    {activeTab === "jobs" && (
                        <div>
                            <div className="flex justify-end mb-6"><button onClick={() => { setEditingJob(null); setOpen(true); }} className="bg-green-600 px-6 py-3 rounded-xl flex gap-2 items-center"><FaPlus /> Add Job</button></div>
                            <JobTable jobs={jobs} onDelete={handleDelete} onEdit={(job) => { setEditingJob(job); setOpen(true); }} page={page} setPage={setPage} totalPages={totalPages} />
                        </div>
                    )}
                    {activeTab === "applications" && <ApplicationTable />}
                    {activeTab === "users" && <UserTable users={users} onDelete={handleDeleteUser} onRole={handleRole} />}
                    {activeTab === "analytics" && (
                        <Charts 
                            jobsByCategory={analytics.jobsByCategory} 
                            workTypes={analytics.workTypes} 
                        />
                    )}
                </div>
            </main>

            <JobModal open={open} editingJob={editingJob} onClose={() => { setOpen(false); setEditingJob(null); }} onSubmit={handleSubmit} />
        </div>
    );
}