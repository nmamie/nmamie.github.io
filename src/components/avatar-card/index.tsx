import React from 'react';
import { FALLBACK_IMAGE } from '../../constants';
import { Profile } from '../../interfaces/profile';
import { skeleton } from '../../utils';
import LazyImage from '../lazy-image';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { FiMail, FiDownload } from 'react-icons/fi';

interface AvatarCardProps {
  profile: Profile | null;
  loading: boolean;
  avatarRing: boolean;
  resumeFileUrl?: string;
  researchInterests?: string[];
}

/**
 * Renders an AvatarCard component.
 * @param profile - The profile object.
 * @param loading - A boolean indicating if the profile is loading.
 * @param avatarRing - A boolean indicating if the avatar should have a ring.
 * @param resumeFileUrl - The URL of the resume file.
 * @returns JSX element representing the AvatarCard.
 */
const AvatarCard: React.FC<AvatarCardProps> = ({
  profile,
  loading,
  avatarRing,
  resumeFileUrl,
  researchInterests,
}): React.JSX.Element => {
  return (
    <div className="card shadow-lg card-sm bg-base-100 border border-base-300 overflow-hidden">
      <div className="grid place-items-center py-7 px-4">
        {loading || !profile ? (
          <div className="avatar opacity-90">
            <div className="mb-6 rounded-full w-32 h-32">
              {skeleton({
                widthCls: 'w-full',
                heightCls: 'h-full',
                shape: '',
              })}
            </div>
          </div>
        ) : (
          <div className="avatar opacity-95">
            <div
              className={`mb-6 rounded-full w-32 h-32 ${
                avatarRing
                  ? 'ring-4 ring-primary/80 ring-offset-base-100 ring-offset-2'
                  : ''
              }`}
            >
              <LazyImage
                src={profile.avatar ? profile.avatar : FALLBACK_IMAGE}
                alt={profile.name}
                placeholder={skeleton({
                  widthCls: 'w-full',
                  heightCls: 'h-full',
                  shape: '',
                })}
              />
            </div>
          </div>
        )}

        <div className="text-center w-full px-2">
          <h1 className="font-extrabold text-2xl text-base-content tracking-tight">
            {loading || !profile ? (
              skeleton({ widthCls: 'w-48', heightCls: 'h-8' })
            ) : (
              profile.name
            )}
          </h1>

          {/* Affiliation Pill */}
          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.75 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
            <HiOutlineAcademicCap className="w-3.5 h-3.5 shrink-0" />
            UZH.ai Fellow • DSI Scholar
          </div>

          <div className="mt-2.5 text-xs text-base-content/80 font-mono leading-relaxed max-w-xs mx-auto">
            {loading || !profile
              ? skeleton({ widthCls: 'w-48', heightCls: 'h-5' })
              : profile.bio}
          </div>

          {researchInterests && researchInterests.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-3.5">
              {researchInterests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wide rounded bg-base-200 text-base-content/80 border border-base-300"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}

          {/* Collaboration / Discussion open invitation */}
          <div className="mt-5 p-4 rounded-xl bg-base-200/70 border border-base-300 text-center flex flex-col items-center gap-2.5 shadow-xs hover:border-primary/30 transition-all">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🤝</span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-base-content">
                Let's Connect
              </h4>
            </div>

            <p className="text-[11px] text-base-content/75 leading-relaxed text-left space-y-1">
              <span>Always open to discussing:</span>
              <span className="block font-medium text-base-content/90">
                • GenAI & News Recommenders<br />
                • Swarm & Collective Intelligence<br />
                • GNNs & Empirical Field Studies
              </span>
            </p>

            <a
              href="mailto:collaborations@mamié.ch?subject=Research%20Collaboration%20/%20Inquiry"
              className="btn btn-primary btn-xs normal-case w-full font-semibold gap-1.5 shadow-xs"
            >
              <FiMail className="text-xs" />
              Get in Touch
            </a>
          </div>
        </div>

        {resumeFileUrl &&
          (loading ? (
            <div className="mt-4">
              {skeleton({ widthCls: 'w-40', heightCls: 'h-8' })}
            </div>
          ) : (
            <a
              href={resumeFileUrl}
              target="_blank"
              className="btn btn-outline btn-sm text-xs mt-4 w-full normal-case gap-1.5 border-base-300 hover:bg-base-200 text-base-content/75"
              download
              rel="noreferrer"
            >
              <FiDownload className="text-xs" />
              Download Resume / CV
            </a>
          ))}
      </div>
    </div>
  );
};

export default AvatarCard;
