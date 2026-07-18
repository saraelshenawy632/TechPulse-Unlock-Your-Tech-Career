import { Link } from "react-router-dom";
import {
  HiOutlineMapPin,
  HiOutlineBuildingOffice2,
  HiOutlineBriefcase
} from "react-icons/hi2";

export default function JobCard({ job }) {
  // جلب المعرّف المتاح بشكل مرن لتجنب مشاكل عدم العثور على الصفحة
  const jobId = job.id || job._id || job.JobKey;

  return (
    <div className="group rounded-3xl border border-slate-800 bg-[#0B132B] p-6 transition duration-300 hover:-translate-y-2 hover:border-violet-500 hover:shadow-2xl hover:shadow-violet-500/20 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-violet-600/20 px-3 py-1 text-xs text-violet-300 font-medium">
            {job.WorkType}
          </span>
          <span className="text-slate-500 text-sm">
            {job.PostedDate || job.Posted}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-bold text-white group-hover:text-violet-400 transition-colors duration-200 line-clamp-2">
          {job.Title}
        </h3>

        <div className="mt-6 space-y-3 text-slate-400">
          <div className="flex items-center gap-2 text-sm">
            <HiOutlineBuildingOffice2 className="text-lg text-violet-400" />
            <span className="truncate">{job.CompanyName}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <HiOutlineMapPin className="text-lg text-cyan-400" />
            <span>{job.City}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <HiOutlineBriefcase className="text-lg text-emerald-400" />
            <span>{job.ExperienceLevel}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <Link
          to={`/jobs/${jobId}`}
          className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm flex items-center gap-1 transition-colors group/btn"
        >
          View Details 
          <span className="transform translate-x-0 group-hover/btn:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}