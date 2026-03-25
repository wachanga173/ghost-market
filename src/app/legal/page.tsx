'use client';

import Link from 'next/link';

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 mb-6 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">
            Master Decentralized Service Agreement
          </h1>
          <p className="text-lg text-gray-400">
            Version 1.0 — Effective Date: March 2026
          </p>
        </div>

        {/* Notice */}
        <div className="p-6 rounded-lg backdrop-blur-md bg-red-950/20 border border-red-500/30 mb-12">
          <p className="text-red-200 font-semibold">
            ⚠️ CRITICAL NOTICE: This agreement and Ghost Market contain no centralized data storage or control mechanisms. 
            The Platform is a decentralized, peer-to-peer network. Users assume full liability for all disputes, transactions, 
            and interactions. Text is indicative only and not legal counsel.
          </p>
        </div>

        {/* Content */}
        <article className="prose prose-invert max-w-none space-y-8">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              1. Platform Definition &amp; Data Sovereignty
            </h2>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4 text-gray-300">
              <p>
                Ghost Market ("The Platform") is a decentralized, peer-to-peer freelance marketplace application. 
                The Platform operates solely on distributed technology layers:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Gun.js</strong> — A decentralized, real-time, graph database protocol. All job postings, user profiles, and messages are synchronized across a distributed peer mesh.</li>
                <li><strong>IPFS (InterPlanetary File System)</strong> — Content-addressable storage for immutable job descriptions, portfolios, and metadata.</li>
                <li><strong>Ethereum Blockchain</strong> — For decentralized identity (SIWE), smart contract escrow, and transaction verification.</li>
                <li><strong>Supabase Static Storage</strong> — Limited to non-critical media files only (images). No application logic or user data databases.</li>
              </ul>
              <p className="font-bold text-cyan-300">
                THE PLATFORM HOLDS NO DATA. All user-generated content is controlled exclusively by the user's wallet and Gun.js peer anonymity model.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              2. User Sovereignty &amp; Identity
            </h2>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4 text-gray-300">
              <p>
                Users authenticate exclusively via SIWE (Sign-In With Ethereum). There are no centralized passwords, emails, or identity verification systems:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Your Ethereum wallet address is your singular, cryptographically-verified identity.</li>
                <li>All messages are encrypted end-to-end using Gun.js SEA (Security, Encryption, and Authorization).</li>
                <li>You retain absolute ownership of your private keys and all associated data.</li>
                <li>The Platform cannot deactivate, lock, or modify your account. Only you control your wallet.</li>
                <li>Your profile metadata is published to IPFS and Gun.js. This is public and permanent.</li>
              </ul>
              <p className="text-sm text-yellow-400">
                ⚠️ If your wallet is compromised, your Ghost Market identity becomes compromised. Secure your private keys.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              3. P2P Liability Waivers
            </h2>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4 text-gray-300">
              <p className="font-bold text-red-400">
                BY USING GHOST MARKET, YOU ACKNOWLEDGE AND AGREE:
              </p>
              <ul className="list-disc list-inside space-y-3">
                <li>
                  <strong>No Central Authority.</strong> Ghost Market does not operate a central server, database, or support team. 
                  There is no &quot;Ghost Market Inc.&quot; We are a distributed application protocol.
                </li>
                <li>
                  <strong>No Escrow Management.</strong> Smart contract escrow transactions are executed on-chain. 
                  The Platform does not hold, custodize, or release funds.
                </li>
                <li>
                  <strong>No Dispute Resolution.</strong> Disagreements between users are not arbitrated by Ghost Market. 
                  Users must resolve disputes via mutual agreement or on-chain smart contract mechanisms.
                </li>
                <li>
                  <strong>No Takedown Ability.</strong> Once content is published to IPFS or Gun.js, it becomes permanent and immutable. 
                  Ghost Market cannot delete, modify, or censor any user-generated content.
                </li>
                <li>
                  <strong>Network Availability.</strong> The Platform's availability depends on the health of Gun.js peers and IPFS nodes. 
                  Ghost Market is not responsible for network downtime, delays, or data loss.
                </li>
                <li>
                  <strong>Smart Contract Risk.</strong> Escrow smart contracts may contain bugs. Users assume full risk of smart contract failure, 
                  including loss of funds.
                </li>
                <li>
                  <strong>Fraud &amp; Scams.</strong> Ghost Market does not verify user identity, credentials, or work quality. 
                  Users interact at their own risk. Report fraud to law enforcement, not Ghost Market.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              4. No Service Guarantees
            </h2>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4 text-gray-300">
              <p>
                Ghost Market is provided &quot;AS-IS&quot; and &quot;AS-AVAILABLE&quot;:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>No uptime SLA. The application is a distributed network with no guaranteed availability.</li>
                <li>No performance guarantees. Data synchronization across Gun.js peers may be slow or inconsistent.</li>
                <li>No customer support. There is no support team, documentation team, or community manager employed by Ghost Market.</li>
                <li>No refunds. All Ethereum transactions are final and irreversible.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              5. User Conduct &amp; Prohibited Activities
            </h2>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4 text-gray-300">
              <p>
                Users shall not:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Post content that violates applicable law in their jurisdiction.</li>
                <li>Engage in money laundering, sanctions evasion, or terrorist financing.</li>
                <li>Attempt to attack, compromise, or perform denial-of-service on Gun.js peers.</li>
                <li>Spam, scam, or defraud other users.</li>
                <li>Publish private information about other users.</li>
                <li>Engage in intellectual property infringement.</li>
              </ul>
              <p className="text-sm text-gray-500">
                Users are solely responsible for compliance with local laws. Ghost Market is law-enforcement neutral and will not 
                censor or remove content except where technically impossible to do so.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              6. Intellectual Property
            </h2>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4 text-gray-300">
              <ul className="list-disc list-inside space-y-2">
                <li>The Ghost Market front-end source code is open-source and available under [GPL/MIT/Apache license].</li>
                <li>Users retain ownership of all work samples, portfolios, and job descriptions they publish.</li>
                <li>Users grant an implicit license to other users to view their public profiles and job postings.</li>
                <li>All work-for-hire and rights transfers must be documented within the job contract itself. Ghost Market does not manage IP escrow.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              7. Limitation of Liability
            </h2>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4 text-gray-300">
              <p className="font-bold text-red-400">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <p>
                Ghost Market, its operators, and its open-source contributors shall not be liable for:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Loss of funds, including smart contract failures.</li>
                <li>Data loss or corruption.</li>
                <li>Disputes between users or work quality issues.</li>
                <li>Lost profits or business interruption.</li>
                <li>Indirect, incidental, or consequential damages.</li>
                <li>Fraud, scams, or identity theft by other users.</li>
              </ul>
              <p className="text-sm text-gray-500">
                IN NO EVENT SHALL GHOST MARKET'S LIABILITY EXCEED THE TOTAL FEES PAID IN THE LAST 12 MONTHS, 
                OR $0.00 IF NO FEES WERE PAID.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              8. Dispute Resolution
            </h2>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4 text-gray-300">
              <p>
                User-to-user disputes are resolved via:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Direct negotiation.</strong> Users may attempt direct settlement via encrypted messages.</li>
                <li><strong>Multi-signature escrow.</strong> Users may agree to release escrow funds via joint signatures.</li>
                <li><strong>Arbitration.</strong> Users may elect a third-party arbitrator mutually agreed upon.</li>
                <li><strong>Litigation.</strong> Users may pursue legal remedies in courts of competent jurisdiction.</li>
              </ul>
              <p className="text-sm text-gray-500">
                Ghost Market does not participate in dispute resolution. Disputes involving Ghost Market itself 
                (e.g., claims of trademark infringement) must be directed to the open-source community maintainers.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              9. Governing Law
            </h2>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4 text-gray-300">
              <p>
                This agreement is governed by the laws applicable to the user's jurisdiction as of the date of acceptance. 
                Users from jurisdictions where decentralized applications are prohibited must exit Ghost Market immediately.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              10. Severability &amp; Modifications
            </h2>
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4 text-gray-300">
              <ul className="list-disc list-inside space-y-2">
                <li>If any provision is deemed unenforceable, remaining provisions remain in effect.</li>
                <li>This agreement may be updated by community consensus and published to IPFS. Continued use constitutes acceptance of updates.</li>
              </ul>
            </div>
          </section>

          {/* Acceptance */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Acknowledgment
            </h2>
            <div className="bg-purple-950/20 border border-purple-500/30 p-6 rounded-lg space-y-4 text-gray-300">
              <p>
                By connecting your wallet to Ghost Market, you:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Accept this Master Decentralized Service Agreement.</li>
                <li>Acknowledge that Ghost Market holds no data about you.</li>
                <li>Understand that your identity is your Ethereum wallet.</li>
                <li>Accept full liability for your transactions and interactions.</li>
                <li>Release Ghost Market and its contributors from all claims.</li>
              </ul>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-12 border-t border-white/10 text-center text-sm text-gray-500">
            <p>
              This agreement is a living document. For the latest version, visit the Ghost Market GitHub repository.
            </p>
            <p className="mt-4">
              Last Updated: March 25, 2026
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
