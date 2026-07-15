import { useState } from "react";
import getCompanyLogo from "../../utils/companyLogo";


export default function CompanyCard({ company }) {

    const [logoError, setLogoError] = useState(false);


    return (

        <div
            className="
                bg-slate-900
                rounded-3xl
                border
                border-slate-800
                p-6
                hover:border-indigo-500
                hover:-translate-y-2
                transition-all
                duration-300
                shadow-lg
                shadow-black/20
            "
        >


            {/* Logo */}

            <div className="flex justify-center">


                {
                    logoError || !getCompanyLogo(company.CompanyName)

                    ?

                    (

                        <div
                            className="
                                w-20
                                h-20
                                rounded-2xl
                                bg-gradient-to-br
                                from-indigo-500
                                to-sky-500
                                flex
                                items-center
                                justify-center
                                text-white
                                text-3xl
                                font-black
                            "
                        >

                            {company.CompanyName?.charAt(0)}

                        </div>

                    )

                    :

                    (

                        <img
                            src={getCompanyLogo(company.CompanyName)}
                            alt=""
                            onError={() => setLogoError(true)}
                            className="
                                w-20
                                h-20
                                object-contain
                                rounded-2xl
                                bg-white
                                p-2
                            "
                        />

                    )

                }


            </div>



            {/* Company Name */}

            <h3
                className="
                    text-white
                    text-xl
                    font-black
                    text-center
                    mt-5
                "
            >

                {company.CompanyName}

            </h3>



            {/* Platform */}

            <div className="flex justify-center mt-4">

                <span
                    className="
                        px-4
                        py-1
                        text-xs
                        rounded-full
                        bg-indigo-500/10
                        text-indigo-400
                        border
                        border-indigo-500/20
                    "
                >

                    {company.Platform}

                </span>

            </div>



            {/* Industry */}

            {
                company.Industry &&

                <p
                    className="
                        text-center
                        text-slate-400
                        text-sm
                        mt-4
                    "
                >

                    {company.Industry}

                </p>

            }


        </div>

    );

}