import Hero from "../home/Hero";
import Stats from "../home/Stats";
import TrendingSkills from "../home/TrendingSkills";
import TopCompanies from "../home/TopCompanies";
import LatestJobs from "../home/LatestJobs";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <TrendingSkills />
      <TopCompanies />
      <LatestJobs />
    </>
  );
}