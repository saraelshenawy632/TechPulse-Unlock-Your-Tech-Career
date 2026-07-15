import {
    Building2,
    Layers,
    Briefcase,
    GraduationCap,
    RotateCcw
} from "lucide-react";

export default function FilterBar({
    filters,
    setFilters,
    data
}) {

    const selectStyle = `
        w-full
        bg-slate-900/90
        text-white
        border
        border-slate-700
        rounded-2xl
        px-4
        py-3
        focus:border-cyan-400
        focus:ring-2
        focus:ring-cyan-500/30
        outline-none
        transition-all
        duration-300
        hover:border-cyan-400
    `;

    const clean = (arr) =>
        [...new Set(arr)]
            .filter(
                x =>
                    x &&
                    x !== "Unknown" &&
                    x !== "unknown" &&
                    x !== "Not Specified"
            )
            .sort();

    return (

        <div
            className="
            mt-10
            p-6
            rounded-3xl
            border
            border-slate-700
            bg-slate-900/60
            backdrop-blur-xl
            shadow-xl
            "
        >

            <div
                className="
                grid
                lg:grid-cols-5
                md:grid-cols-2
                gap-5
                "
            >

                {/* Company */}

                <div>

                    <label
                        className="
                        flex
                        items-center
                        gap-2
                        text-cyan-400
                        mb-2
                        text-sm
                        font-semibold
                        "
                    >
                        <Building2 size={16} />
                        Company
                    </label>

                    <select
                        className={selectStyle}
                        value={filters.company}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                company: e.target.value
                            })
                        }
                    >
                        <option value="">
                            All Companies
                        </option>

                        {clean(data.companies).map(company => (

                            <option
                                key={company}
                                value={company}
                            >
                                {company}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Platform */}

                <div>

                    <label
                        className="
                        flex
                        items-center
                        gap-2
                        text-cyan-400
                        mb-2
                        text-sm
                        font-semibold
                        "
                    >
                        <Layers size={16} />
                        Platform
                    </label>

                    <select
                        className={selectStyle}
                        value={filters.platform}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                platform: e.target.value
                            })
                        }
                    >

                        <option value="">
                            All Platforms
                        </option>

                        {clean(data.platforms).map(platform => (

                            <option
                                key={platform}
                                value={platform}
                            >
                                {platform}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Work Type */}

                <div>

                    <label
                        className="
                        flex
                        items-center
                        gap-2
                        text-cyan-400
                        mb-2
                        text-sm
                        font-semibold
                        "
                    >
                        <Briefcase size={16} />
                        Work Type
                    </label>

                    <select
                        className={selectStyle}
                        value={filters.workType}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                workType: e.target.value
                            })
                        }
                    >

                        <option value="">
                            All Work Types
                        </option>

                        {clean(data.workTypes).map(work => (

                            <option
                                key={work}
                                value={work}
                            >
                                {work}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Experience */}

                <div>

                    <label
                        className="
                        flex
                        items-center
                        gap-2
                        text-cyan-400
                        mb-2
                        text-sm
                        font-semibold
                        "
                    >
                        <GraduationCap size={16} />
                        Experience
                    </label>

                    <select
                        className={selectStyle}
                        value={filters.experience}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                experience: e.target.value
                            })
                        }
                    >

                        <option value="">
                            All Experience
                        </option>

                        {clean(data.experiences).map(level => (

                            <option
                                key={level}
                                value={level}
                            >
                                {level}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Reset */}

                <div
                    className="
                    flex
                    items-end
                    "
                >

                    <button

                        onClick={() =>
                            setFilters({

                                company: "",

                                platform: "",

                                workType: "",

                                experience: ""

                            })
                        }

                        className="
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-gradient-to-r
                        from-cyan-500
                        to-blue-600
                        hover:from-cyan-400
                        hover:to-blue-500
                        text-white
                        rounded-2xl
                        py-3
                        font-semibold
                        transition
                        duration-300
                        shadow-lg
                        "
                    >

                        <RotateCcw size={18} />

                        Reset Filters

                    </button>

                </div>

            </div>

        </div>

    );

}