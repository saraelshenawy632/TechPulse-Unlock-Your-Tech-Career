import { useState, useEffect, useCallback } from "react";
import { 
    Briefcase, 
    Building2, 
    MapPin, 
    Layers, 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    SlidersHorizontal,
    X,
    Calendar
} from "lucide-react";
import Container from "../components/UI/Container";

// سنفترض وجود خدمات جلب البيانات هنا، قم بتعديل المسار حسب مشروعك
import { getAnalyticsJobs } from "../services/analyticsService"; 

export default function ExploreJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // إعدادات البحث والفلاتر والـ Pagination
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        company: "",
        platform: "",
        workType: "",
        experience: ""
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
    });

    // الخيارات المتاحة في القوائم المنسدلة (تُستخرج ديناميكياً من كافة الوظائف)
    const [filterOptions, setFilterOptions] = useState({
        companies: [],
        platforms: [],
        workTypes: [],
        experiences: []
    });

    // جلب البيانات من الباكيند مع تطبيق الفلاتر والصفحة الحالية
    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            // تحويل الفلاتر إلى Query Params وإرسالها للباكيند
            const queryParams = new URLSearchParams({
                search,
                company: filters.company,
                platform: filters.platform,
                workType: filters.workType,
                experience: filters.experience,
                page: pagination.page,
                limit: pagination.limit
            });

            // تأكدي من تعديل الرابط الـ API الأساسي حسب إعدادات مشروعك
            const response = await fetch(`http://localhost:5000/api/jobs?${queryParams.toString()}`);
            const result = await response.json();

            if (result && result.data) {
                setJobs(result.data);
                setPagination(prev => ({
                    ...prev,
                    total: result.pagination.total,
                    pages: result.pagination.pages
                }));
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    }, [search, filters, pagination.page, pagination.limit]);

    // جلب الوظائف عند تغيير أي فلتر أو صفحة أو عند البحث
    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    // جلب جميع الوظائف مرة واحدة في البداية لملء قوائم الفلاتر المنسدلة ديناميكياً
    useEffect(() => {
        async function loadFilterOptions() {
            try {
                const allJobs = await getAnalyticsJobs();
                if (allJobs && allJobs.length > 0) {
                    setFilterOptions({
                        companies: [...new Set(allJobs.map(x => x.CompanyName).filter(Boolean))],
                        platforms: [...new Set(allJobs.map(x => x.PlatformName).filter(Boolean))],
                        workTypes: [...new Set(allJobs.map(x => x.WorkType).filter(Boolean))],
                        experiences: [...new Set(allJobs.map(x => x.ExperienceLevel).filter(Boolean))]
                    });
                }
            } catch (err) {
                console.error("Error loading filter options:", err);
            }
        }
        loadFilterOptions();
    }, []);

    // إعادة تعيين كافة الفلاتر والبحث
    const handleResetFilters = () => {
        setSearch("");
        setFilters({
            company: "",
            platform: "",
            workType: "",
            experience: ""
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 })); // العودة للصفحة الأولى عند التصفية
    };

    // المكون الخاص بالفلاتر (تم فصله ليعاد استخدامه في نسخة الموبايل والديسك توب)
    const FiltersSidebar = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-cyan-400" />
                    Filter Options
                </h3>
                <button 
                    onClick={handleResetFilters}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                    Reset All
                </button>
            </div>

            {/* Company Filter */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</label>
                <select
                    value={filters.company}
                    onChange={(e) => handleFilterChange("company", e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                >
                    <option value="">All Companies</option>
                    {filterOptions.companies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Platform Filter */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform</label>
                <select
                    value={filters.platform}
                    onChange={(e) => handleFilterChange("platform", e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                >
                    <option value="">All Platforms</option>
                    {filterOptions.platforms.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            {/* Work Type Filter */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Work Type</label>
                <select
                    value={filters.workType}
                    onChange={(e) => handleFilterChange("workType", e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                >
                    <option value="">All Work Types</option>
                    {filterOptions.workTypes.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
            </div>

            {/* Experience Level Filter */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experience Level</label>
                <select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange("experience", e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                >
                    <option value="">All Experience</option>
                    {filterOptions.experiences.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </select>
            </div>
        </div>
    );

    return (
        <section className="min-h-screen py-12 md:py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative">
            <Container>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3">
                            <Briefcase size={40} className="text-cyan-400" />
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                                Explore Jobs
                            </h1>
                        </div>
                        <p className="text-slate-300 mt-2 text-sm md:text-base">
                            Discover and filter technology opportunities across Egypt
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search size={18} className="text-slate-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by company or job category..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
                            className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Main Content Body */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Desktop Sidebar Filters (Hidden on Mobile) */}
                    <div className="hidden lg:block lg:col-span-1 bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6 h-fit backdrop-blur-md">
                        <FiltersSidebar />
                    </div>

                    {/* Mobile Floating Filters Button & Side Sheet */}
                    <div className="lg:hidden flex justify-between items-center bg-slate-900/50 p-4 border border-slate-800 rounded-xl">
                        <span className="text-sm text-slate-300">Found {pagination.total} Jobs</span>
                        <button 
                            onClick={() => setShowMobileFilters(true)}
                            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs py-2 px-4 rounded-lg transition-colors"
                        >
                            <SlidersHorizontal size={14} />
                            Filters
                        </button>
                    </div>

                    {/* Mobile Fullscreen Filter Overlay */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm lg:hidden transition-opacity">
                            <div className="fixed right-0 top-0 bottom-0 w-80 bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-black text-white">Filters</span>
                                    <button onClick={() => setShowMobileFilters(false)} className="text-slate-400 hover:text-white">
                                        <X size={24} />
                                    </button>
                                </div>
                                <FiltersSidebar />
                                <button 
                                    onClick={() => setShowMobileFilters(false)}
                                    className="w-full bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl mt-8 transition-colors"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Jobs List Grid */}
                    <div className="lg:col-span-3 space-y-4">
                        
                        {/* Status Bar / Info */}
                        <div className="hidden lg:flex justify-between items-center text-sm text-slate-400">
                            <span>Showing {jobs.length} of {pagination.total} opportunities</span>
                            {search || Object.values(filters).some(Boolean) ? (
                                <span className="text-cyan-400/80">Filters applied</span>
                            ) : null}
                        </div>

                        {loading ? (
                            <div className="py-24 text-center">
                                <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-slate-400 animate-pulse text-lg">Fetching top matches...</p>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl py-20 text-center">
                                <Briefcase size={48} className="text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No Jobs Found</h3>
                                <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
                                    We couldn't find any job matching your current filters or search term. Try resetting them.
                                </p>
                                <button 
                                    onClick={handleResetFilters}
                                    className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold py-2.5 px-6 rounded-xl transition-all"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {jobs.map((job, idx) => (
                                    <div 
                                        key={idx}
                                        className="group bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            {/* Left details */}
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-400/10 py-1 px-2.5 rounded-md">
                                                        {job.JobCategory || "Tech Opportunity"}
                                                    </span>
                                                    <h2 className="text-xl font-bold text-white mt-2 group-hover:text-cyan-400 transition-colors">
                                                        {job.JobCategory} Position
                                                    </h2>
                                                    <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-1.5 font-medium">
                                                        <Building2 size={15} />
                                                        {job.CompanyName}
                                                    </p>
                                                </div>

                                                {/* Meta Badges */}
                                                <div className="flex flex-wrap gap-2.5 pt-1">
                                                    <span className="flex items-center gap-1 text-xs text-slate-300 bg-slate-900/80 border border-slate-800 py-1 px-2.5 rounded-lg">
                                                        <MapPin size={13} className="text-rose-400" />
                                                        {job.FullLocation || "Egypt"}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-slate-300 bg-slate-900/80 border border-slate-800 py-1 px-2.5 rounded-lg">
                                                        <Briefcase size={13} className="text-emerald-400" />
                                                        {job.WorkType || "On-site"}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-slate-300 bg-slate-900/80 border border-slate-800 py-1 px-2.5 rounded-lg">
                                                        <Layers size={13} className="text-indigo-400" />
                                                        {job.ExperienceLevel || "Any"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right action details (Platform & Date) */}
                                            <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-4 h-full pt-2 sm:pt-0 border-t sm:border-0 border-slate-800">
                                                <span className="text-xs text-slate-400 bg-slate-800/40 py-1 px-2.5 rounded-md border border-slate-800">
                                                    via {job.PlatformName}
                                                </span>
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Calendar size={13} />
                                                    {job.PostedDate ? job.PostedDate.split("T")[0] : "Recently"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination Controls */}
                                {pagination.pages > 1 && (
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                            disabled={pagination.page === 1}
                                            className="flex items-center gap-2 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-900/50 py-2.5 px-4 rounded-xl text-sm transition-all"
                                        >
                                            <ChevronLeft size={16} />
                                            Prev
                                        </button>

                                        <span className="text-sm font-semibold text-slate-400">
                                            Page <span className="text-white">{pagination.page}</span> of {pagination.pages}
                                        </span>

                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                                            disabled={pagination.page === pagination.pages}
                                            className="flex items-center gap-2 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-900/50 py-2.5 px-4 rounded-xl text-sm transition-all"
                                        >
                                            Next
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}