import { useEffect, useState } from "react";

import Container from "../components/UI/Container";
import CompanyCard from "../components/UI/CompanyCard";

import { getCompanies } from "../services/companyService";

export default function Companies() {

    const [companies,setCompanies]=useState([]);

    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        loadCompanies();

    },[]);

    async function loadCompanies(){

        try{

            const data=await getCompanies();

            setCompanies(data);

        }

        finally{

            setLoading(false);

        }

    }

    return(

        <section className="py-24">

            <Container>

                <h1 className="text-5xl font-black text-white">

                    Companies

                </h1>

                <p className="mt-3 text-slate-400">

                    Explore companies hiring technology professionals.

                </p>

                {

                    loading?

                    <h2 className="text-center text-white mt-20">

                        Loading...

                    </h2>

                    :

                    <div className="grid gap-8 mt-14 md:grid-cols-2 xl:grid-cols-3">

                        {

                            companies.map(company=>(

                                <CompanyCard

                                    key={company.CompanyKey}

                                    company={company}

                                />

                            ))

                        }

                    </div>

                }

            </Container>

        </section>

    );

}