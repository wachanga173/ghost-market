'use client';

import { useEffect, useState } from 'react';
import { subscribeToJobs, GunJob } from '@/lib/gun';
import { getJobDescriptionFromIPFS } from '@/lib/ipfs';
import Link from 'next/link';

export default function MarketplaceFeed() {
  const [jobs, setJobs] = useState<GunJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<GunJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [jobDescriptions, setJobDescriptions] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<'newest' | 'budget'>('newest');

  useEffect(() => {
    setLoading(true);

    // Subscribe to Gun.js jobs network
    const unsubscribe = subscribeToJobs(async (jobsData) => {
      const jobsArray = Object.values(jobsData)
        .filter((job) => job && job.status === 'open')
        .sort((a, b) => {
          if (sortBy === 'newest') {
            return b.postedAt - a.postedAt;
          } else if (sortBy === 'budget') {
            return b.budget.amount - a.budget.amount;
          }
          return 0;
        });

      setJobs(jobsArray);
      setLoading(false);

      // Fetch descriptions from IPFS
      for (const job of jobsArray) {
        if (job.metadata.ipfsHash && !jobDescriptions[job.id]) {
          const description = await getJobDescriptionFromIPFS(job.metadata.ipfsHash);
          if (description) {
            setJobDescriptions((prev) => ({
              ...prev,
              [job.id]: description.description || '',
            }));
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [sortBy]);

  useEffect(() => {
    let filtered = jobs;

    if (selectedSkill) {
      filtered = jobs.filter((job) => job.skills.includes(selectedSkill));
    }

    setFilteredJobs(filtered);
  }, [jobs, selectedSkill]);

  // Get all unique skills for filter
  const allSkills = Array.from(new Set(jobs.flatMap((job) => job.skills)));

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-gray-950 to-black py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Live Marketplace Feed
          </h1>
          <p className="text-lg text-gray-400">
            Jobs broadcast live from the Gun.js P2P network
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Skill Filter */}
          <div className="w-full md:w-auto flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSkill(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedSkill === null
                  ? 'bg-cyan-500 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              All Skills
            </button>
            {allSkills.slice(0, 5).map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  selectedSkill === skill
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'budget')}
            className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:border-white/40 transition-all font-semibold"
          >
            <option value="newest">Newest First</option>
            <option value="budget">Highest Budget</option>
          </select>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4" />
              <p className="text-gray-400">Connecting to Gun.js network...</p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-xl text-gray-400 mb-4">No jobs available</p>
              <p className="text-sm text-gray-500">Check back soon or change your filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Link key={job.id} href={`/job/${job.id}`}>
                <div className="h-full p-6 rounded-lg backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-cyan-500/50 hover:from-white/15 hover:to-white/10 transition-all cursor-pointer group">
                  {/* Job Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {job.title}
                  </h3>

                  {/* Description Preview */}
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {jobDescriptions[job.id] || 'Loading description...'}
                  </p>

                  {/* Budget */}
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <p className="text-2xl font-bold text-cyan-300">
                      ${job.budget.amount}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {job.budget.paymentType} • {job.budget.currency}
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs rounded bg-purple-500/30 text-purple-200 border border-purple-500/50"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded bg-gray-500/30 text-gray-300">
                        +{job.skills.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{job.metadata.views ?? 0} views</span>
                    <span>{job.metadata.proposals ?? 0} proposals</span>
                  </div>

                  {/* Status indicator */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-400">Open • P2P Live</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Network Status */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Gun.js network connected • All data synchronized across P2P peers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
