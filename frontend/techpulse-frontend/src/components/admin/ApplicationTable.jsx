import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTimes, FaTrash, FaSearch, FaFilePdf, FaLinkedin, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { getApplications, updateApplicationStatus, deleteApplication } from "../../services/adminService";
import { success, error, confirmDelete } from "../../utils/alerts";

export default function ApplicationTable() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    async function loadApplications() {
        try {
            const res = await getApplications();
            setApplications(res.data.applications || res.data || []);
        } catch (err) {
            error("Failed to load applications");
        }
    }

    useEffect(() => { loadApplications(); }, []);

    async function changeStatus(id, newStatus) {
        try {
            await updateApplicationStatus(id, newStatus);
            success(`Application status updated to ${newStatus}`);
            loadApplications();
        } catch (err) { error("Update Failed"); }
    }

    async function removeApplication(id) {
        const ok = await confirmDelete("Are you sure you want to delete this application?");
        if (!ok) return;
        try {
            await deleteApplication(id);
            success("Application Deleted");
            loadApplications();
        } catch (err) { error("Delete Failed"); }
    }

    const filteredApplications = applications.filter((app) => {
        const text = `${app.ApplicantName} ${app.ApplicantEmail} ${app.JobTitle} ${app.CompanyName}`.toLowerCase();
        return text.includes(search.toLowerCase()) && (status === "All" || app.Status === status);
    });

    const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize));
    const displayed = filteredApplications.slice((page - 1) * pageSize, page * pageSize);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 w-full">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Applications</h2>
                    <p className="text-slate-400 mt-1">Manage and track all incoming job requests</p>
                </div>
                <div className="bg-blue-600/10 border border-blue-500/20 px-6 py-3 rounded-2xl text-blue-400 font-bold">
                    Total: {applications.length} Requests
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <FaSearch className="absolute left-4 top-4 text-slate-500" />
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search by name, email or job..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-5 py-3.5 outline-none focus:border-blue-500 transition"
                    />
                </div>
                <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-6 py-3.5 outline-none cursor-pointer hover:border-slate-500 transition"
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 border-b border-slate-700">
                                <th className="p-5 text-slate-400 font-medium text-xs uppercase">Applicant</th>
                                <th className="p-5 text-slate-400 font-medium text-xs uppercase hidden md:table-cell">Job Details</th>
                                <th className="p-5 text-slate-400 font-medium text-xs uppercase hidden sm:table-cell">Status</th>
                                <th className="p-5 text-slate-400 font-medium text-xs uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {displayed.map((app) => (
                                <tr key={app.ApplicationID} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-5">
                                        <p className="font-bold text-white">{app.ApplicantName}</p>
                                        <p className="text-slate-400 text-sm">{app.ApplicantEmail}</p>
                                    </td>
                                    <td className="p-5 hidden md:table-cell">
                                        <p className="font-semibold text-blue-400 text-sm">{app.JobTitle}</p>
                                        <p className="text-slate-500 text-xs">{app.CompanyName}</p>
                                    </td>
                                    <td className="p-5 hidden sm:table-cell">
                                        <StatusBadge status={app.Status} />
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-end gap-2">
                                            <ActionButton onClick={() => navigate(`/admin/applications/${app.ApplicationID}`)} icon={<FaEye />} color="bg-purple-600" />
                                            <ActionButton onClick={() => changeStatus(app.ApplicationID, "Accepted")} icon={<FaCheck />} color="bg-green-600" />
                                            <ActionButton onClick={() => changeStatus(app.ApplicationID, "Rejected")} icon={<FaTimes />} color="bg-yellow-600" />
                                            {app.ResumeURL && <ActionLink href={app.ResumeURL} icon={<FaFilePdf />} color="bg-blue-600" />}
                                            <ActionButton onClick={() => removeApplication(app.ApplicationID)} icon={<FaTrash />} color="bg-red-600" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-center items-center gap-4 mt-8">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-5 py-2 bg-slate-800 rounded-xl hover:bg-slate-700 disabled:opacity-30">Prev</button>
                <span className="text-slate-400">{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-5 py-2 bg-slate-800 rounded-xl hover:bg-slate-700 disabled:opacity-30">Next</button>
            </div>
        </motion.div>
    );
}

// Sub-components
function StatusBadge({ status }) {
    const colors = {
        Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        Accepted: "bg-green-500/10 text-green-500 border-green-500/20",
        Rejected: "bg-red-500/10 text-red-500 border-red-500/20"
    };
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${colors[status]}`}>{status}</span>;
}

function ActionButton({ onClick, icon, color }) {
    return <button onClick={onClick} className={`${color} p-2.5 rounded-lg hover:scale-105 transition-transform shadow-lg`}>{icon}</button>;
}

function ActionLink({ href, icon, color }) {
    return <a href={href} target="_blank" rel="noreferrer" className={`${color} p-2.5 rounded-lg hover:scale-105 transition-transform shadow-lg`}>{icon}</a>;
}