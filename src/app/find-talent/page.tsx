'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getCurrentAddress } from '@/lib/auth';
import type { GunTalentProfile } from '@/lib/gun';

interface GunJob {
  postedBy: string;
  skills: string[];
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
}

interface TalentCard {
  wallet: string;
  displayName: string;
  category: string;
  skills: string[];
  openJobs: number;
  bio?: string;
  contactDetails?: string;
  availability?: 'open' | 'limited' | 'unavailable';
}

const TALENT_CATEGORIES = [
  'Engineering',
  'Design',
  'Marketing',
  'Writing',
  'Operations',
  'Product',
  'Finance',
  'Other',
] as const;

const QUICK_SKILLS = [
  'React',
  'TypeScript',
  'Solidity',
  'Node.js',
  'UI/UX',
  'Content Writing',
  'SEO',
  'Community',
];

export default function FindTalentPage() {
  const [jobs, setJobs] = useState<GunJob[]>([]);
  const [talents, setTalents] = useState<Record<string, GunTalentProfile>>({});

  const [displayName, setDisplayName] = useState('');
  const [category, setCategory] = useState<(typeof TALENT_CATEGORIES)[number]>('Engineering');
  const [customCategory, setCustomCategory] = useState('');
  const [skillsInput, setSkillsInput] = useState('React, TypeScript');
  const [bio, setBio] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [availability, setAvailability] = useState<'open' | 'limited' | 'unavailable'>('open');
  const [postingTalent, setPostingTalent] = useState(false);
  const [postResult, setPostResult] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    let cleanupJobs: (() => void) | undefined;
    let cleanupTalents: (() => void) | undefined;

    const load = async () => {
      const { subscribeToJobs, subscribeToTalents } = await import('@/lib/gun');
      cleanupJobs = subscribeToJobs((jobMap) => {
        const all = Object.values(jobMap).filter(Boolean) as GunJob[];
        setJobs(all);
      });

      cleanupTalents = subscribeToTalents((talentMap) => {
        setTalents(talentMap);
      });
    };

    load();

    return () => {
      cleanupJobs?.();
      cleanupTalents?.();
    };
  }, []);

  const appendSkill = (skill: string) => {
    const parsed = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parsed.includes(skill)) {
      setSkillsInput([...parsed, skill].join(', '));
    }
  };

  const handlePostTalent = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostResult(null);
    setPostingTalent(true);

    try {
      const walletAddress = await getCurrentAddress();
      if (!walletAddress) {
        setPostResult('Connect your wallet first to post your talent profile.');
        return;
      }

      const parsedSkills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const finalCategory = category === 'Other' ? customCategory.trim() : category;

      if (!displayName.trim() || !finalCategory || parsedSkills.length === 0) {
        setPostResult('Display name, category, and at least one skill are required.');
        return;
      }

      const { postTalentProfileToNetwork } = await import('@/lib/gun');

      const id = await postTalentProfileToNetwork({
        walletAddress,
        displayName: displayName.trim(),
        category: finalCategory,
        skills: parsedSkills,
        bio: bio.trim() || undefined,
        contactDetails: contactDetails.trim() || undefined,
        availability,
      });

      if (!id) {
        setPostResult('Failed to post talent profile to the mesh.');
        return;
      }

      setPostResult('Talent profile published successfully.');
      if (category === 'Other') {
        setCustomCategory('');
      }
    } finally {
      setPostingTalent(false);
    }
  };

  const talent = useMemo<TalentCard[]>(() => {
    const byWallet = new Map<string, TalentCard>();

    for (const job of jobs) {
      const wallet = job.postedBy;
      if (!byWallet.has(wallet)) {
        byWallet.set(wallet, {
          wallet,
          displayName: `${wallet.slice(0, 6)}...${wallet.slice(-4)}`,
          category: 'General',
          skills: [],
          openJobs: 0,
        });
      }

      const entry = byWallet.get(wallet)!;
      for (const skill of job.skills) {
        if (!entry.skills.includes(skill)) {
          entry.skills.push(skill);
        }
      }
      if (job.status === 'open') {
        entry.openJobs += 1;
      }
    }

    for (const posted of Object.values(talents)) {
      if (!posted?.walletAddress) {
        continue;
      }

      const existing = byWallet.get(posted.walletAddress);
      if (existing) {
        existing.displayName = posted.displayName || existing.displayName;
        existing.category = posted.category || existing.category;
        existing.bio = posted.bio;
        existing.contactDetails = posted.contactDetails;
        existing.availability = posted.availability;
        for (const skill of posted.skills || []) {
          if (!existing.skills.includes(skill)) {
            existing.skills.push(skill);
          }
        }
      } else {
        byWallet.set(posted.walletAddress, {
          wallet: posted.walletAddress,
          displayName:
            posted.displayName ||
            `${posted.walletAddress.slice(0, 6)}...${posted.walletAddress.slice(-4)}`,
          category: posted.category || 'General',
          skills: [...(posted.skills || [])],
          openJobs: 0,
          bio: posted.bio,
          contactDetails: posted.contactDetails,
          availability: posted.availability,
        });
      }
    }

    const normalizedSearch = search.trim().toLowerCase();

    return Array.from(byWallet.values()).filter((item) => {
      const categoryMatch =
        categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();

      if (!normalizedSearch) {
        return categoryMatch;
      }

      const haystack = [
        item.displayName,
        item.wallet,
        item.category,
        item.bio || '',
        ...item.skills,
      ]
        .join(' ')
        .toLowerCase();

      return categoryMatch && haystack.includes(normalizedSearch);
    });
  }, [jobs, talents, search, categoryFilter]);

  const availableCategories = useMemo(() => {
    const fromProfiles = Object.values(talents)
      .map((t) => t.category?.trim())
      .filter(Boolean) as string[];
    const merged = new Set<string>([...TALENT_CATEGORIES.filter((c) => c !== 'Other'), ...fromProfiles]);
    return Array.from(merged).sort((a, b) => a.localeCompare(b));
  }, [talents]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Find Talent</h1>
          <p className="text-gray-400">
            Post your talent with categories and skills, then search and discover professionals across the Ghost Market mesh.
          </p>
        </header>

        <section className="rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-md">
          <h2 className="text-2xl font-semibold text-white">Post Your Talent</h2>
          <p className="mt-2 text-sm text-gray-400">
            Add your skills and category so interested people can find and contact you.
          </p>

          <form onSubmit={handlePostTalent} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display name"
                className="rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as (typeof TALENT_CATEGORIES)[number])}
                className="rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
              >
                {TALENT_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {category === 'Other' && (
              <input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Add your custom category"
                className="w-full rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
              />
            )}

            <input
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="Comma-separated skills (e.g. React, Solidity, UI/UX)"
              className="w-full rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
            />

            <div className="flex flex-wrap gap-2">
              {QUICK_SKILLS.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => appendSkill(skill)}
                  className="rounded-full border border-cyan-500/40 bg-cyan-500/15 px-3 py-1 text-xs text-cyan-200"
                >
                  + {skill}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Short bio (optional)"
                className="rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
              />
              <div className="space-y-4">
                <input
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  placeholder="Contact details (optional)"
                  className="w-full rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
                />
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as 'open' | 'limited' | 'unavailable')}
                  className="w-full rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
                >
                  <option value="open">Open to work</option>
                  <option value="limited">Limited availability</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={postingTalent}
              className="rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 px-6 py-3 font-semibold text-black disabled:opacity-50"
            >
              {postingTalent ? 'Publishing...' : 'Publish Talent Profile'}
            </button>
          </form>

          {postResult && <p className="mt-4 text-sm text-cyan-300">{postResult}</p>}
        </section>

        <section className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-md">
          <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill, category, wallet, or name"
              className="rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
            >
              <option value="all">All categories</option>
              {availableCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </section>

        {talent.length === 0 ? (
          <div className="rounded-xl border border-white/15 bg-white/5 p-8 text-gray-300">
            No talent profiles found for current filters.
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {talent.map((item) => (
              <article
                key={item.wallet}
                className="rounded-xl border border-white/20 bg-white/5 p-5 backdrop-blur-md"
              >
                <h2 className="text-lg font-semibold text-white">{item.displayName}</h2>
                <p className="mt-1 font-mono text-xs text-gray-400">
                  {item.wallet.slice(0, 6)}...{item.wallet.slice(-4)}
                </p>
                <p className="mt-2 inline-block rounded-full border border-cyan-500/40 bg-cyan-500/15 px-2 py-1 text-xs text-cyan-200">
                  {item.category}
                </p>
                <p className="mt-2 text-sm text-gray-400">Open jobs: {item.openJobs}</p>
                {item.availability && (
                  <p className="mt-1 text-xs text-purple-300">Availability: {item.availability}</p>
                )}
                {item.bio && <p className="mt-3 text-sm text-gray-300">{item.bio}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.skills.slice(0, 6).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-purple-400/40 bg-purple-500/20 px-2 py-1 text-xs text-purple-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {item.contactDetails && (
                  <p className="mt-3 text-xs text-gray-300">Contact: {item.contactDetails}</p>
                )}
                <Link
                  href={`/messages?to=${item.wallet}`}
                  className="mt-4 inline-block rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black"
                >
                  Start Chat
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
