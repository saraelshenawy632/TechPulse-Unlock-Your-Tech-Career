import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFilePdf, FaLinkedin, FaUser, FaBuilding, FaBriefcase, FaCheck, FaTimes, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { getApplicationById, updateApplicationStatus } from "../../services/adminService";
import { success, error } from "../../utils/alerts";

export default function ApplicationProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadData() {
        try {
            setLoading(true);
            const res = await getApplicationById(id);
            setApplication(res.data.application || res.data);
        } catch (err) {
            error("Failed loading application");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadData(); }, [id]);

    async function changeStatus(status) {
        try {
            await updateApplicationStatus(id, status);
            success(`Application ${status}`);
            loadData();
        } catch (err) {
            error("Status update failed");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const statusStyle = {
        Pending: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
        Accepted: "bg-green-500/10 text-green-500 border border-green-500/20",
        Rejected: "bg-red-500/10 text-red-500 border border-red-500/20"
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-xl hover:bg-slate-800 transition mb-8">
                <FaArrowLeft /> Back
            </button>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* USER CARD */}
                <motion.div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
                    <div className="flex items-center gap-5 mb-8">
                        <div className="bg-blue-600/20 p-5 rounded-2xl text-blue-500 text-3xl">
                            <FaUser />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{application.ApplicantName}</h1>
                            <p className="text-slate-400">{application.ApplicantEmail}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { label: "Job Title", value: application.JobTitle, icon: <FaBriefcase /> },
                            { label: "Company", value: application.CompanyName, icon: <FaBuilding /> }
                        ].map((item, i) => (
                            <div key={i}>
                                <p className="text-slate-500 text-sm">{item.label}</p>
                                <p className="flex items-center gap-2 font-semibold mt-1">{item.icon} {item.value}</p>
                            </div>
                        ))}
                        <div>
                            <p className="text-slate-500 text-sm">Status</p>
                            <span className={`inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-bold ${statusStyle[application.Status]}`}>
                                {application.Status}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT SIDE */}
                <div className="lg:col-span-2 space-y-8">
                    {/* ACTIONS */}
                    <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
                        <h2 className="text-xl font-bold mb-6">Application Actions</h2>
                        <div className="flex gap-4">
                            <button onClick={() => changeStatus("Accepted")} className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl flex items-center justify-center gap-2 transition font-bold">
                                <FaCheck /> Accept
                            </button>
                            <button onClick={() => changeStatus("Rejected")} className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-xl flex items-center justify-center gap-2 transition font-bold">
                                <FaTimes /> Reject
                            </button>
                        </div>
                    </div>

                    {/* DOCUMENTS & TIMELINE */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
                            <h2 className="text-xl font-bold mb-6">Documents</h2>
                            <div className="flex flex-col gap-3">
                                {application.ResumeURL && (
                                    <a href={application.ResumeURL} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-slate-800 p-4 rounded-xl hover:bg-slate-700 transition">
                                        <FaFilePdf className="text-red-500" /> View Resume
                                    </a>
                                )}
                                {application.LinkedInURL && (
                                    <a href={application.LinkedInURL} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-slate-800 p-4 rounded-xl hover:bg-slate-700 transition">
                                        <FaLinkedin className="text-blue-500" /> LinkedIn Profile
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
                            <h2 className="text-xl font-bold mb-6">Timeline</h2>
                            <div className="border-l border-slate-700 pl-6 space-y-6">
                                <div className="relative">
                                    <div className="absolute -left-[33px] p-1.5 bg-blue-500 rounded-full text-xs"><FaClock /></div>
                                    <p className="text-sm text-slate-400">Applied Date</p>
                                    <p className="font-semibold">{new Date(application.AppliedAt).toLocaleString()}</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[33px] p-1.5 bg-green-500 rounded-full text-xs"><FaCheck /></div>
                                    <p className="text-sm text-slate-400">Current Status</p>
                                    <p className="font-semibold">{application.Status}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}