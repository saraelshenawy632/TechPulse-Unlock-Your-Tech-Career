import { useEffect, useMemo, useState } from "react";
import {
    Briefcase, Building2, MapPin, Layers, BarChart3, 
    PieChart, TrendingUp, Loader2
} from "lucide-react";

import Container from "../components/UI/Container";
import StatCard from "../components/Analytics/StatCard";
import FilterBar from "../components/Analytics/FilterBar";
import ChartCard from "../components/Analytics/ChartCard";

import JobsCompanyChart from "../components/Analytics/JobsCompanyChart";
import PlatformChart from "../components/Analytics/PlatformChart";
import WorkTypeChart from "../components/Analytics/WorkTypeChart";
import ExperienceChart from "../components/Analytics/ExperienceChart";
import CategoryChart from "../components/Analytics/CategoryChart";
import JobsTrendChart from "../components/Analytics/JobsTrendChart";

import { getAnalytics, getAnalyticsJobs } from "../services/analyticsService";

export default function Analytics() {
    const [data, setData] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        company: "",
        platform: "",
        workType: "",
        experience: ""
    });

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const [analytics, allJobs] = await Promise.all([
                    getAnalytics(),
                    getAnalyticsJobs()
                ]);
                setData(analytics);
                setJobs(allJobs);
            } catch (error) {
                console.error("Failed to load analytics", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // ... (باقي دوال useMemo كما هي)
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            return (
                (!filters.company || job.CompanyName === filters.company) &&
                (!filters.platform || job.PlatformName === filters.platform) &&
                (!filters.workType || job.WorkType === filters.workType) &&
                (!filters.experience || job.ExperienceLevel === filters.experience)
            );
        });
    }, [jobs, filters]);

    const companyChart = useMemo(() => {
        const result = {};
        filteredJobs.forEach(job => {
            if (!result[job.CompanyName]) result[job.CompanyName] = { CompanyName: job.CompanyName, Jobs: 0 };
            result[job.CompanyName].Jobs++;
        });
        return Object.values(result).sort((a, b) => b.Jobs - a.Jobs);
    }, [filteredJobs]);

    const platformChart = useMemo(() => {
        const result = {};
        filteredJobs.forEach(job => {
            if (!result[job.PlatformName]) result[job.PlatformName] = { PlatformName: job.PlatformName, Jobs: 0 };
            result[job.PlatformName].Jobs++;
        });
        return Object.values(result);
    }, [filteredJobs]);

    const workChart = useMemo(() => {
        const result = {};
        filteredJobs.forEach(job => {
            if (!job.WorkType) return;
            if (!result[job.WorkType]) result[job.WorkType] = { WorkType: job.WorkType, Jobs: 0 };
            result[job.WorkType].Jobs++;
        });
        return Object.values(result);
    }, [filteredJobs]);

    const experienceChart = useMemo(() => {
        const result = {};
        filteredJobs.forEach(job => {
            if (!job.ExperienceLevel) return;
            if (!result[job.ExperienceLevel]) result[job.ExperienceLevel] = { ExperienceLevel: job.ExperienceLevel, Jobs: 0 };
            result[job.ExperienceLevel].Jobs++;
        });
        return Object.values(result);
    }, [filteredJobs]);

    const categoryChart = useMemo(() => {
        const result = {};
        filteredJobs.forEach(job => {
            if (!job.JobCategory || job.JobCategory === "Other") return;
            if (!result[job.JobCategory]) result[job.JobCategory] = { JobCategory: job.JobCategory, Jobs: 0 };
            result[job.JobCategory].Jobs++;
        });
        return Object.values(result).sort((a, b) => b.Jobs - a.Jobs).slice(0, 8);
    }, [filteredJobs]);

    const trendChart = useMemo(() => {
        const result = {};
        filteredJobs.forEach(job => {
            const date = job.PostedDate?.split("T")[0];
            if (!date) return;
            if (!result[date]) result[date] = { FullDate: date, Jobs: 0 };
            result[date].Jobs++;
        });
        return Object.values(result).sort((a, b) => new Date(a.FullDate) - new Date(b.FullDate));
    }, [filteredJobs]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                <h1 className="text-white text-lg font-medium tracking-widest uppercase">
                    Analyzing Data...
                </h1>
            </div>
        );
    }

    return (
        <section className="min-h-screen py-12 md:py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
            <Container>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <BarChart3 size={42} className="text-cyan-400 shrink-0" />
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Analytics Dashboard</h1>
                        <p className="text-slate-300 mt-1 md:mt-2 text-sm md:text-base">Technology Jobs Insights Across Egypt</p>
                    </div>
                </div>

                <FilterBar
                    filters={filters}
                    setFilters={setFilters}
                    data={{
                        companies: [...new Set(jobs.map(x => x.CompanyName))],
                        platforms: [...new Set(jobs.map(x => x.PlatformName))],
                        workTypes: [...new Set(jobs.map(x => x.WorkType))],
                        experiences: [...new Set(jobs.map(x => x.ExperienceLevel))]
                    }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-10">
                    <StatCard icon={<Briefcase />} title="Jobs" value={filteredJobs.length} />
                    <StatCard icon={<Building2 />} title="Companies" value={new Set(filteredJobs.map(x => x.CompanyName)).size} />
                    <StatCard icon={<Layers />} title="Platforms" value={new Set(filteredJobs.map(x => x.PlatformName)).size} />
                    <StatCard icon={<MapPin />} title="Locations" value={new Set(filteredJobs.map(x => x.Location)).size} />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 mt-10">
                    <ChartCard title="Jobs Trend" icon={<TrendingUp size={22} />}><JobsTrendChart data={trendChart} /></ChartCard>
                    <ChartCard title="Jobs By Company" icon={<Building2 size={22} />}><JobsCompanyChart data={companyChart} /></ChartCard>
                    <ChartCard title="Platforms" icon={<Layers size={22} />}><PlatformChart data={platformChart} /></ChartCard>
                    <ChartCard title="Work Type" icon={<PieChart size={22} />}><WorkTypeChart data={workChart} /></ChartCard>
                    <ChartCard title="Experience Level" icon={<Briefcase size={22} />}><ExperienceChart data={experienceChart} /></ChartCard>
                    <ChartCard title="Job Categories" icon={<BarChart3 size={22} />}><CategoryChart data={categoryChart} /></ChartCard>
                </div>
            </Container>
        </section>
    );
}