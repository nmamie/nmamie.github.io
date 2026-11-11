import { ReactNode } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import {
  SiBluesky,
  SiGooglescholar,
  SiMedium,
  SiSubstack,
} from 'react-icons/si';
import { HiOutlineDocumentText, HiOutlineEnvelope } from 'react-icons/hi2';
import { SanitizedConfig } from '../../interfaces/sanitized-config';
import { ExtLink } from './section';

export const socialLinks = (config: SanitizedConfig) => {
  const s = config.social;
  return [
    s.scholar && {
      href: s.scholar,
      label: 'Google Scholar',
      icon: <SiGooglescholar />,
    },
    {
      href: `https://github.com/${config.github.username}`,
      label: 'GitHub',
      icon: <FaGithub />,
    },
    s.linkedin && {
      href: `https://www.linkedin.com/in/${s.linkedin}`,
      label: 'LinkedIn',
      icon: <FaLinkedin />,
    },
    s.bluesky && {
      href: `https://bsky.app/profile/${s.bluesky}`,
      label: 'Bluesky',
      icon: <SiBluesky />,
    },
    s.medium && {
      href: `https://medium.com/@${s.medium}`,
      label: 'Medium',
      icon: <SiMedium />,
    },
    s.substack && {
      href: `https://${s.substack}.substack.com`,
      label: 'Substack',
      icon: <SiSubstack />,
    },
    s.lesswrong && {
      href: `https://www.lesswrong.com/users/${s.lesswrong}`,
      label: 'LessWrong',
      icon: <span className="font-mono font-bold leading-none">λ</span>,
    },
    s.email && {
      href: `mailto:${s.email}`,
      label: 'Email',
      icon: <HiOutlineEnvelope />,
    },
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode }[];
};

/** Icon row of socials + contact + CV, shared by the intro and the footer. */
const SocialLinks = ({
  config,
  className = '',
}: {
  config: SanitizedConfig;
  className?: string;
}) => (
  <div className={`flex flex-wrap items-center gap-x-1 gap-y-2 ${className}`}>
    {socialLinks(config).map((l) => (
      <ExtLink
        key={l.label}
        href={l.href}
        title={l.label}
        className="icon-link"
      >
        <span className="text-lg">{l.icon}</span>
        <span className="sr-only">{l.label}</span>
      </ExtLink>
    ))}
    {config.resume.fileUrl && (
      <ExtLink href={config.resume.fileUrl} className="btn-pill ml-2">
        <HiOutlineDocumentText /> CV
      </ExtLink>
    )}
  </div>
);

export default SocialLinks;
