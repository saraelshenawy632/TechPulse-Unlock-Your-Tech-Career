import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Briefcase,
    Building2,
    MapPin,
    Layers,
    BarChart3,
    PieChart,
    TrendingUp,
    Loader2,
    AlertCircle,
    RefreshCw
} from "lucide-react";

import Container
    from "../components/UI/Container";

import StatCard
    from "../components/Analytics/StatCard";

import FilterBar
    from "../components/Analytics/FilterBar";

import ChartCard
    from "../components/Analytics/ChartCard";

import JobsCompanyChart
    from "../components/Analytics/JobsCompanyChart";

import PlatformChart
    from "../components/Analytics/PlatformChart";

import WorkTypeChart
    from "../components/Analytics/WorkTypeChart";

import ExperienceChart
    from "../components/Analytics/ExperienceChart";

import CategoryChart
    from "../components/Analytics/CategoryChart";

import JobsTrendChart
    from "../components/Analytics/JobsTrendChart";

import {
    getAnalytics
} from "../services/analyticsService";


// =====================================================
// Analytics Page
// =====================================================

export default function Analytics() {


    // =====================================================
    // STATE
    // =====================================================

    const [
        analytics,
        setAnalytics
    ] = useState(null);


    const [
        jobs,
        setJobs
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    // =====================================================
    // FILTERS
    // =====================================================

    const [
        filters,
        setFilters
    ] = useState({

        company: "",

        platform: "",

        workType: "",

        experience: ""

    });


    // =====================================================
    // LOAD ANALYTICS
    // =====================================================

    const loadAnalytics = async () => {

        try {

            setLoading(true);

            setError("");


            console.log(
                "Loading Analytics..."
            );


            // =================================================
            // ONE API CALL ONLY
            // =================================================

            const response =
                await getAnalytics();


            console.log(
                "Analytics Response:",
                response
            );


            const data =
                response?.data || {};


            console.log(
                "Analytics Data:",
                data
            );


            if (
                data.success === false
            ) {

                throw new Error(

                    data.message ||
                    "Analytics API failed"

                );

            }


            // =================================================
            // Get Jobs From Same API
            // =================================================

            const jobsData =

                Array.isArray(data.jobs)

                    ? data.jobs

                    : [];


            console.log(
                "Total Analytics Jobs:",
                jobsData.length
            );


            // =================================================
            // Save State
            // =================================================

            setAnalytics(
                data
            );


            setJobs(
                jobsData
            );


        }

        catch (err) {

            console.error(
                "Failed to load analytics:",
                err
            );


            setError(

                err.response?.data?.message ||

                err.message ||

                "Failed to load analytics data"

            );

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(

        () => {

            loadAnalytics();

        },

        []

    );


    // =====================================================
    // FILTERED JOBS
    // =====================================================

    const filteredJobs = useMemo(

        () => {

            if (
                !Array.isArray(jobs)
            ) {

                return [];

            }


            return jobs.filter(

                (job) => {


                    const companyMatch =

                        !filters.company ||

                        job.CompanyName ===
                        filters.company;


                    const platformMatch =

                        !filters.platform ||

                        job.PlatformName ===
                        filters.platform;


                    const workTypeMatch =

                        !filters.workType ||

                        job.WorkType ===
                        filters.workType;


                    const experienceMatch =

                        !filters.experience ||

                        job.ExperienceLevel ===
                        filters.experience;


                    return (

                        companyMatch &&

                        platformMatch &&

                        workTypeMatch &&

                        experienceMatch

                    );

                }

            );

        },

        [
            jobs,
            filters
        ]

    );


    // =====================================================
    // FILTER OPTIONS
    // =====================================================

    const filterData = useMemo(

        () => {

            const companies = [

                ...new Set(

                    jobs

                        .map(
                            (job) =>
                                job.CompanyName
                        )

                        .filter(

                            (value) =>

                                value &&

                                value !== "Unknown"

                        )

                )

            ].sort();


            const platforms = [

                ...new Set(

                    jobs

                        .map(
                            (job) =>
                                job.PlatformName
                        )

                        .filter(

                            (value) =>

                                value &&

                                value !== "Unknown"

                        )

                )

            ].sort();


            const workTypes = [

                ...new Set(

                    jobs

                        .map(
                            (job) =>
                                job.WorkType
                        )

                        .filter(Boolean)

                )

            ].sort();


            const experiences = [

                ...new Set(

                    jobs

                        .map(
                            (job) =>
                                job.ExperienceLevel
                        )

                        .filter(Boolean)

                )

            ].sort();


            return {

                companies,

                platforms,

                workTypes,

                experiences

            };

        },

        [
            jobs
        ]

    );


    // =====================================================
    // JOBS BY COMPANY
    // =====================================================

    const companyChart = useMemo(

        () => {

            const result = {};


            filteredJobs.forEach(

                (job) => {

                    const company =

                        job.CompanyName ||

                        "Unknown";


                    if (
                        !result[company]
                    ) {

                        result[company] = {

                            CompanyName:
                                company,

                            Jobs:
                                0

                        };

                    }


                    result[company].Jobs++;

                }

            );


            return (

                Object.values(result)

                    .sort(

                        (a, b) =>

                            b.Jobs -
                            a.Jobs

                    )

                    .slice(
                        0,
                        10
                    )

            );

        },

        [
            filteredJobs
        ]

    );


    // =====================================================
    // JOBS BY PLATFORM
    // =====================================================

    const platformChart = useMemo(

        () => {

            const result = {};


            filteredJobs.forEach(

                (job) => {

                    const platform =

                        job.PlatformName ||

                        "Unknown";


                    if (
                        !result[platform]
                    ) {

                        result[platform] = {

                            PlatformName:
                                platform,

                            Jobs:
                                0

                        };

                    }


                    result[platform].Jobs++;

                }

            );


            return (

                Object.values(result)

                    .sort(

                        (a, b) =>

                            b.Jobs -
                            a.Jobs

                    )

            );

        },

        [
            filteredJobs
        ]

    );


    // =====================================================
    // JOBS BY WORK TYPE
    // =====================================================

    const workChart = useMemo(

        () => {

            const result = {};


            filteredJobs.forEach(

                (job) => {

                    const workType =

                        job.WorkType ||

                        "Unknown";


                    if (
                        !result[workType]
                    ) {

                        result[workType] = {

                            WorkType:
                                workType,

                            Jobs:
                                0

                        };

                    }


                    result[workType].Jobs++;

                }

            );


            return (

                Object.values(result)

                    .sort(

                        (a, b) =>

                            b.Jobs -
                            a.Jobs

                    )

            );

        },

        [
            filteredJobs
        ]

    );


    // =====================================================
    // JOBS BY EXPERIENCE
    // =====================================================

    const experienceChart = useMemo(

        () => {

            const result = {};


            filteredJobs.forEach(

                (job) => {

                    const experience =

                        job.ExperienceLevel ||

                        "Unknown";


                    if (
                        !result[experience]
                    ) {

                        result[experience] = {

                            ExperienceLevel:
                                experience,

                            Jobs:
                                0

                        };

                    }


                    result[experience].Jobs++;

                }

            );


            return (

                Object.values(result)

                    .sort(

                        (a, b) =>

                            b.Jobs -
                            a.Jobs

                    )

            );

        },

        [
            filteredJobs
        ]

    );


    // =====================================================
    // JOBS BY CATEGORY
    // =====================================================

    const categoryChart = useMemo(

        () => {

            const result = {};


            filteredJobs.forEach(

                (job) => {

                    const category =

                        job.JobCategory ||

                        "Other";


                    if (
                        !result[category]
                    ) {

                        result[category] = {

                            JobCategory:
                                category,

                            Jobs:
                                0

                        };

                    }


                    result[category].Jobs++;

                }

            );


            return (

                Object.values(result)

                    .sort(

                        (a, b) =>

                            b.Jobs -
                            a.Jobs

                    )

                    .slice(
                        0,
                        8
                    )

            );

        },

        [
            filteredJobs
        ]

    );


    // =====================================================
    // JOBS TREND
    // =====================================================

    const trendChart = useMemo(

        () => {

            const result = {};


            filteredJobs.forEach(

                (job) => {

                    if (
                        !job.PostedDate
                    ) {

                        return;

                    }


                    const date =

                        String(
                            job.PostedDate
                        )

                            .split("T")[0];


                    if (
                        !date
                    ) {

                        return;

                    }


                    if (
                        !result[date]
                    ) {

                        result[date] = {

                            FullDate:
                                date,

                            Jobs:
                                0

                        };

                    }


                    result[date].Jobs++;

                }

            );


            return (

                Object.values(result)

                    .sort(

                        (a, b) =>

                            new Date(
                                a.FullDate
                            ) -

                            new Date(
                                b.FullDate
                            )

                    )

            );

        },

        [
            filteredJobs
        ]

    );


    // =====================================================
    // KPI
    // =====================================================

    const totalJobs =
        Number(
            filteredJobs.length
        ) || 0;


    const totalCompanies =

        new Set(

            filteredJobs

                .map(
                    (job) =>
                        job.CompanyName
                )

                .filter(

                    (value) =>

                        value &&

                        value !== "Unknown"

                )

        ).size;


    const totalPlatforms =

        new Set(

            filteredJobs

                .map(
                    (job) =>
                        job.PlatformName
                )

                .filter(

                    (value) =>

                        value &&

                        value !== "Unknown"

                )

        ).size;


    const totalLocations =

        new Set(

            filteredJobs

                .map(

                    (job) =>

                        job.Location ||

                        job.FullLocation ||

                        (

                            job.City &&
                            job.Country

                                ? `${job.City}, ${job.Country}`

                                : job.City

                        )

                )

                .filter(Boolean)

        ).size;


    // =====================================================
    // LOADING
    // =====================================================

    if (
        loading
    ) {

        return (

            <div className="
                min-h-screen
                flex
                flex-col
                items-center
                justify-center
                bg-slate-950
                gap-4
            ">

                <Loader2
                    className="
                        w-12
                        h-12
                        text-cyan-400
                        animate-spin
                    "
                />

                <h1 className="
                    text-white
                    text-lg
                    font-medium
                    tracking-widest
                    uppercase
                ">

                    Analyzing Data...

                </h1>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        error
    ) {

        return (

            <section className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-slate-950
                p-6
            ">

                <div className="
                    max-w-lg
                    w-full
                    bg-slate-900
                    border
                    border-red-500/30
                    rounded-3xl
                    p-8
                    text-center
                ">

                    <AlertCircle
                        className="
                            mx-auto
                            text-red-400
                            mb-4
                        "
                        size={48}
                    />


                    <h2 className="
                        text-xl
                        font-bold
                        text-white
                        mb-3
                    ">

                        Failed to Load Analytics

                    </h2>


                    <p className="
                        text-slate-400
                        text-sm
                        mb-6
                    ">

                        {error}

                    </p>


                    <button

                        onClick={
                            loadAnalytics
                        }

                        className="
                            inline-flex
                            items-center
                            gap-2
                            px-5
                            py-3
                            rounded-xl
                            bg-cyan-500
                            hover:bg-cyan-600
                            text-white
                            font-semibold
                            transition
                        "

                    >

                        <RefreshCw
                            size={18}
                        />

                        Try Again

                    </button>

                </div>

            </section>

        );

    }


    // =====================================================
    // MAIN
    // =====================================================

    return (

        <section className="
            min-h-screen
            py-12
            md:py-24
            bg-gradient-to-br
            from-slate-950
            via-slate-900
            to-indigo-950
        ">

            <Container>


                {/* HEADER */}

                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    items-start
                    sm:items-center
                    justify-between
                    gap-6
                ">


                    <div className="
                        flex
                        items-start
                        sm:items-center
                        gap-4
                    ">

                        <BarChart3
                            size={42}
                            className="
                                text-cyan-400
                                shrink-0
                            "
                        />


                        <div>

                            <h1 className="
                                text-3xl
                                md:text-5xl
                                font-black
                                text-white
                                tracking-tight
                            ">

                                Analytics Dashboard

                            </h1>


                            <p className="
                                text-slate-300
                                mt-1
                                md:mt-2
                                text-sm
                                md:text-base
                            ">

                                Technology Jobs Insights Across Egypt

                            </p>

                        </div>

                    </div>


                    <button

                        onClick={
                            loadAnalytics
                        }

                        className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-xl
                            bg-slate-800
                            hover:bg-slate-700
                            text-white
                            transition
                        "

                    >

                        <RefreshCw
                            size={18}
                        />

                        Refresh

                    </button>

                </div>


                {/* INFO */}

                <div className="
                    mt-6
                    text-sm
                    text-slate-400
                ">

                    Showing{" "}

                    <span className="
                        text-cyan-400
                        font-bold
                    ">

                        {totalJobs}

                    </span>

                    {" "}of{" "}

                    <span className="
                        text-white
                        font-bold
                    ">

                        {jobs.length}

                    </span>

                    {" "}jobs

                </div>


                {/* FILTERS */}

                <FilterBar

                    filters={
                        filters
                    }

                    setFilters={
                        setFilters
                    }

                    data={
                        filterData
                    }

                />


                {/* KPIs */}

                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-4
                    md:gap-6
                    mt-10
                ">


                    <StatCard

                        icon={
                            <Briefcase />
                        }

                        title="Jobs"

                        value={
                            totalJobs
                        }

                    />


                    <StatCard

                        icon={
                            <Building2 />
                        }

                        title="Companies"

                        value={
                            totalCompanies
                        }

                    />


                    <StatCard

                        icon={
                            <Layers />
                        }

                        title="Platforms"

                        value={
                            totalPlatforms
                        }

                    />


                    <StatCard

                        icon={
                            <MapPin />
                        }

                        title="Locations"

                        value={
                            totalLocations
                        }

                    />

                </div>


                {/* CHARTS */}

                <div className="
                    grid
                    grid-cols-1
                    xl:grid-cols-2
                    gap-6
                    md:gap-8
                    mt-10
                ">


                    <ChartCard

                        title="Jobs Trend"

                        icon={
                            <TrendingUp
                                size={22}
                            />
                        }

                    >

                        <JobsTrendChart
                            data={
                                trendChart
                            }
                        />

                    </ChartCard>


                    <ChartCard

                        title="Jobs By Company"

                        icon={
                            <Building2
                                size={22}
                            />
                        }

                    >

                        <JobsCompanyChart
                            data={
                                companyChart
                            }
                        />

                    </ChartCard>


                    <ChartCard

                        title="Platforms"

                        icon={
                            <Layers
                                size={22}
                            />
                        }

                    >

                        <PlatformChart
                            data={
                                platformChart
                            }
                        />

                    </ChartCard>


                    <ChartCard

                        title="Work Type"

                        icon={
                            <PieChart
                                size={22}
                            />
                        }

                    >

                        <WorkTypeChart
                            data={
                                workChart
                            }
                        />

                    </ChartCard>


                    <ChartCard

                        title="Experience Level"

                        icon={
                            <Briefcase
                                size={22}
                            />
                        }

                    >

                        <ExperienceChart
                            data={
                                experienceChart
                            }
                        />

                    </ChartCard>


                    <ChartCard

                        title="Job Categories"

                        icon={
                            <BarChart3
                                size={22}
                            />
                        }

                    >

                        <CategoryChart
                            data={
                                categoryChart
                            }
                        />

                    </ChartCard>


                </div>


            </Container>

        </section>

    );

}