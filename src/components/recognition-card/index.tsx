import React from 'react';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { PiMedal, PiTrophy } from 'react-icons/pi';
import { skeleton } from '../../utils';

interface RecognitionItem {
  title: string;
  award: string;
  organization: string;
  year: string;
  description: string;
  link?: string;
  highlightColor?: string;
}

const recognitions: RecognitionItem[] = [
  {
    title: 'UZH.ai Fellowship (DSI Excellence Program)',
    award: 'Prestigious Fellowship',
    organization: 'UZH.ai & Digital Society Initiative (DSI)',
    year: '2026',
    description: 'Awarded a competitive doctoral fellowship with CHF 50,000 research & salary grant in the interdisciplinary Digital Society Initiative at the University of Zurich.',
    link: 'https://www.ai.uzh.ch/en/research/UZH.ai-Fellowship-Program-2026.html',
    highlightColor: 'badge-primary',
  },
  {
    title: 'Best Poster Award 🏆',
    award: '1st Place / Best Poster',
    organization: '8th SwissText Analytics Conference (ACL Anthology)',
    year: '2023',
    description: 'Awarded Best Poster for "Voting Booklet Bias: Stance Detection in Swiss Federal Communication" analyzing linguistic balance in Swiss direct democratic voting booklets.',
    link: 'https://arxiv.org/pdf/2306.08999',
    highlightColor: 'badge-secondary',
  },
  {
    title: 'ICSI 2025 Conference Presentation & Paper',
    award: 'Peer-Reviewed Selection',
    organization: '16th Int. Conf. on Swarm Intelligence (Springer Nature)',
    year: '2025',
    description: 'Oral presentation in Yokohama, Japan for "The Society of HiveMind: Multi-Agent Optimization of Foundation Model Swarms to Unlock the Potential of Collective Intelligence".',
    link: 'https://link.springer.com/chapter/10.1007/978-981-95-0982-9_20',
    highlightColor: 'badge-accent',
  },
  {
    title: 'Harvard CS50 Distinction',
    award: 'Course Credential',
    organization: 'Harvard University / edX',
    year: '2020',
    description: 'Introduction to the Intellectual Enterprises of Computer Science and the Art of Programming.',
    link: 'https://certificates.cs50.io/d585320d-bb6f-48e6-86f6-93ac9602c8d2.pdf?size=letter',
    highlightColor: 'badge-ghost',
  },
];

const RecognitionCard: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (loading) {
    return (
      <div className="card shadow-xl bg-base-200 border border-base-300 p-6 md:p-8 space-y-4">
        {skeleton({ widthCls: 'w-48', heightCls: 'h-8' })}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skeleton({ widthCls: 'w-full', heightCls: 'h-32', shape: 'rounded-xl' })}
          {skeleton({ widthCls: 'w-full', heightCls: 'h-32', shape: 'rounded-xl' })}
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-xl bg-base-200 border border-base-300 overflow-hidden">
      <div className="card-body p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 mb-6 border-b border-base-300 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-primary shrink-0">
              <PiTrophy className="text-2xl" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 font-mono">
                Academic Distinctions & Awards
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-base-content tracking-tight">
                Honors, Grants & Distinctions
              </h2>
            </div>
          </div>
          <span className="badge badge-outline text-xs font-mono hidden sm:inline-flex">
            Selected Honors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recognitions.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-base-100 border border-base-300 hover:border-primary/40 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                    <PiMedal className="text-xs" />
                    {item.award}
                  </span>
                  <span className="text-xs font-mono font-bold text-base-content/50">
                    {item.year}
                  </span>
                </div>

                <h3 className="font-bold text-base text-base-content group-hover:text-primary transition-colors leading-snug">
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                      <span>{item.title}</span>
                      <HiOutlineExternalLink className="text-xs opacity-60 group-hover:opacity-100" />
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>

                <p className="text-xs font-medium text-primary/80">
                  {item.organization}
                </p>

                <p className="text-xs text-base-content/75 leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecognitionCard;
