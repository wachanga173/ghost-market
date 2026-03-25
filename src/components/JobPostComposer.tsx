'use client';

import { FormEvent, useState } from 'react';
import { uploadJobDescription } from '@/lib/ipfs';
import { postJobToNetwork } from '@/lib/gun';
import { getCurrentAddress } from '@/lib/auth';

const DEFAULT_SKILLS = ['React', 'TypeScript', 'Node.js', 'Solidity', 'UI/UX', 'DevOps'];

export default function JobPostComposer() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('500');
  const [skillsInput, setSkillsInput] = useState('React, TypeScript');
  const [paymentType, setPaymentType] = useState<'escrow' | 'milestone' | 'hourly'>('escrow');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const appendSkill = (skill: string) => {
    const current = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!current.includes(skill)) {
      setSkillsInput([...current, skill].join(', '));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResult(null);
    setSubmitting(true);

    try {
      const walletAddress = await getCurrentAddress();
      if (!walletAddress) {
        setResult('Connect your wallet first to post a job.');
        return;
      }

      const skills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (!title.trim() || !description.trim() || !skills.length) {
        setResult('Title, description, and at least one skill are required.');
        return;
      }

      const cid = await uploadJobDescription({
        title: title.trim(),
        description: description.trim(),
        requirements: skills,
        skills,
        budget: Number(budget) || 0,
      });

      if (!cid) {
        setResult('Failed to upload description to IPFS.');
        return;
      }

      const jobId = await postJobToNetwork({
        title: title.trim(),
        description: cid,
        budget: {
          amount: Number(budget) || 0,
          currency: 'ETH',
          paymentType,
        },
        skills,
        postedBy: walletAddress,
        metadata: {
          ipfsHash: cid,
          views: 0,
          proposals: 0,
        },
      });

      if (!jobId) {
        setResult('Failed to broadcast job on Gun.js mesh.');
        return;
      }

      setTitle('');
      setDescription('');
      setBudget('500');
      setSkillsInput('React, TypeScript');
      setResult(`Job posted successfully. Job ID: ${jobId}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-md">
      <h2 className="text-2xl font-semibold text-white">Post A Job (P2P)</h2>
      <p className="mt-2 text-sm text-gray-400">
        Step 1 uploads content to IPFS. Step 2 broadcasts CID to Gun.js.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Job title"
          className="w-full rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the role and scope..."
          rows={5}
          className="w-full rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="number"
            min={0}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
            className="rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
          />
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value as 'escrow' | 'milestone' | 'hourly')}
            className="rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
          >
            <option value="escrow">Escrow</option>
            <option value="milestone">Milestone</option>
            <option value="hourly">Hourly</option>
          </select>
          <input
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="Comma-separated skills"
            className="rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-white outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {DEFAULT_SKILLS.map((skill) => (
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

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 px-6 py-3 font-semibold text-black disabled:opacity-50"
        >
          {submitting ? 'Publishing...' : 'Publish To Mesh'}
        </button>
      </form>

      {result && <p className="mt-4 text-sm text-cyan-300">{result}</p>}
    </section>
  );
}
