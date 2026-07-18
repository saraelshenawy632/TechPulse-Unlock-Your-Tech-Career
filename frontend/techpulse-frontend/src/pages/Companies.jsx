import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Container from "../components/UI/Container";
import CompanyCard from "../components/UI/CompanyCard";

import { getCompanies } from "../services/companyService";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    try {
      const data = await getCompanies();
      // التأكد من أن البيانات مصفوفة قبل حفظها في الـ State
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-24">
      <Container>
        <h1 className="text-5xl font-black text-white">Companies</h1>
        <p className="mt-3 text-slate-400">
          Explore companies hiring technology professionals.
        </p>

        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
              }}
            >
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
            </motion.div>
          </div>
        ) : (
          <div className="grid gap-8 mt-14 md:grid-cols-2 xl:grid-cols-3">
            {companies.length > 0 ? (
              companies.map((company) => (
                <CompanyCard
                  key={company.CompanyKey}
                  company={company}
                />
              ))
            ) : (
              <p className="text-slate-400 mt-10">No companies found.</p>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}