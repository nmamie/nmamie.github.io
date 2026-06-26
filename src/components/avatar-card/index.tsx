import { FALLBACK_IMAGE } from '../../constants';
import { Profile } from '../../interfaces/profile';
import { skeleton } from '../../utils';
import LazyImage from '../lazy-image';

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
    <div className="card shadow-lg card-sm bg-base-100">
      <div className="grid place-items-center py-8">
        {loading || !profile ? (
          <div className="avatar opacity-90">
            <div className="mb-8 rounded-full w-32 h-32">
              {skeleton({
                widthCls: 'w-full',
                heightCls: 'h-full',
                shape: '',
              })}
            </div>
          </div>
        ) : (
          <div className="avatar opacity-90">
            <div
              className={`mb-8 rounded-full w-32 h-32 ${
                avatarRing
                  ? 'ring-3 ring-primary ring-offset-base-100 ring-offset-2'
                  : ''
              }`}
            >
              {
                <LazyImage
                  src={profile.avatar ? profile.avatar : FALLBACK_IMAGE}
                  alt={profile.name}
                  placeholder={skeleton({
                    widthCls: 'w-full',
                    heightCls: 'h-full',
                    shape: '',
                  })}
                />
              }
            </div>
          </div>
        )}
        <div className="text-center mx-auto px-8">
          <h1 className="font-bold text-2xl">
            {loading || !profile ? (
              skeleton({ widthCls: 'w-48', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">
                {profile.name}
              </span>
            )}
          </h1>
          <div className="mt-3 text-base-content font-mono">
            {loading || !profile
              ? skeleton({ widthCls: 'w-48', heightCls: 'h-5' })
              : profile.bio}
          </div>
          {researchInterests && researchInterests.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-4">
              {researchInterests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wide rounded bg-base-300 text-base-content/85 border border-base-content/10"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
          {/* Collaboration / Discussion open invitation */}
          <div className="mt-6 mx-4 p-5 rounded-2xl bg-primary/10 border border-primary/20 text-center flex flex-col items-center gap-3 shadow-inner hover:scale-[1.01] transition-transform duration-300">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
              🤝
            </div>
            <h4 className="font-bold text-sm text-base-content">Let's Collaborate!</h4>
            <p className="text-xs text-base-content/85 leading-relaxed">
              I'm always excited to connect with fellow researchers, developers, and creators. If you want to discuss{' '}
              <span className="font-semibold text-primary">GenAI</span>,{' '}
              <span className="font-semibold text-primary">Multi-Agent Systems</span>,{' '}
              <span className="font-semibold text-primary">personalized news recommenders</span>, or any of my other research areas, let's chat!
            </p>
            <a
              href="mailto:collaborations@mamié.ch"
              className="btn btn-primary btn-xs normal-case mt-1 text-[10px] font-semibold gap-1.5"
            >
              ✉️ Message me
            </a>
          </div>
        </div>
        {resumeFileUrl &&
          (loading ? (
            <div className="mt-6">
              {skeleton({ widthCls: 'w-40', heightCls: 'h-8' })}
            </div>
          ) : (
            <a
              href={resumeFileUrl}
              target="_blank"
              className="btn btn-outline btn-sm text-xs mt-6 opacity-50"
              download
              rel="noreferrer"
            >
              Download Resume
            </a>
          ))}
      </div>
    </div>
  );
};

export default AvatarCard;
