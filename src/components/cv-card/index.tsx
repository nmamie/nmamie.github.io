import React from 'react';
import { HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineBookOpen, HiOutlineBadgeCheck, HiOutlineExternalLink } from 'react-icons/hi';
import { PiMedal } from 'react-icons/pi';
import { SanitizedExperience, SanitizedEducation, SanitizedCertification } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';

interface CvCardProps {
  experiences: SanitizedExperience[];
  educations: SanitizedEducation[];
  teaching?: Array<{
    course: string;
    role: string;
    institution: string;
    year: string;
    link?: string;
  }>;
  certifications: SanitizedCertification[];
  loading: boolean;
}

const CvRow = ({
  title,
  org,
  orgLink,
  period,
  note,
  honor,
}: {
  title: string;
  org?: string;
  orgLink?: string;
  period: string;
  note?: string;
  honor?: string;
}) => (
  <div className="py-3.5 px-4 rounded-xl hover:bg-base-300/40 transition-colors flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4 border-b border-base-300/60 last:border-0 group">
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-baseline gap-1.5">
        <span className="font-bold text-sm sm:text-base text-base-content group-hover:text-primary transition-colors">
          {title}
        </span>
        {org && (
          <span className="text-xs sm:text-sm text-base-content/80 flex items-center gap-1">
            <span className="opacity-50">@</span>
            {orgLink ? (
              <a
                href={orgLink}
                target="_blank"
                rel="noreferrer"
                className="hover:underline hover:text-primary font-medium transition-colors inline-flex items-center gap-0.5"
              >
                <span>{org}</span>
                <HiOutlineExternalLink className="text-[10px] opacity-60" />
              </a>
            ) : (
              <span>{org}</span>
            )}
          </span>
        )}
      </div>

      {honor && (
        <div className="mt-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
            <PiMedal className="text-xs" />
            {honor}
          </span>
        </div>
      )}

      {note && (
        <p className="text-xs text-base-content/60 mt-0.5 font-mono">
          {note}
        </p>
      )}
    </div>

    <div className="shrink-0 text-xs font-mono font-medium text-base-content/60 sm:text-right bg-base-100 sm:bg-transparent px-2 sm:px-0 py-0.5 sm:py-0 rounded border sm:border-0 border-base-300 w-fit">
      {period}
    </div>
  </div>
);

const CvCard: React.FC<CvCardProps> = ({
  experiences,
  educations,
  teaching,
  certifications,
  loading,
}) => {
  if (loading) {
    return (
      <div className="card shadow-xl bg-base-200 border border-base-300 p-6 md:p-8 space-y-6">
        {skeleton({ widthCls: 'w-48', heightCls: 'h-8' })}
        {skeleton({ widthCls: 'w-full', heightCls: 'h-40', shape: 'rounded-xl' })}
        {skeleton({ widthCls: 'w-full', heightCls: 'h-40', shape: 'rounded-xl' })}
      </div>
    );
  }

  return (
    <div className="card shadow-xl bg-base-200 border border-base-300 overflow-hidden">
      <div className="card-body p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-base-300 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-primary shrink-0">
              <HiOutlineBriefcase className="text-2xl" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 font-mono">
                Curriculum Vitae & Experience
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-base-content tracking-tight">
                Academic & Professional Trajectory
              </h2>
            </div>
          </div>

          <a
            href="CV_Noah.pdf"
            target="_blank"
            rel="noreferrer"
            download
            className="btn btn-outline btn-sm rounded-lg font-semibold gap-1.5 hidden sm:inline-flex"
          >
            Download Full PDF
          </a>
        </div>

        {/* Work / Research Block */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/70 font-mono px-2">
            <HiOutlineBriefcase className="text-primary text-sm" />
            <span>Doctoral Appointments & Industry Roles</span>
          </div>

          <div className="bg-base-100 rounded-2xl border border-base-300 p-2 shadow-xs">
            {experiences.map((exp, idx) => (
              <CvRow
                key={idx}
                title={exp.position || ''}
                org={exp.company}
                orgLink={exp.companyLink}
                period={`${exp.from} – ${exp.to}`}
                honor={exp.position?.includes('UZH.ai Fellow') ? 'Fellowship Grant CHF 47,000' : undefined}
              />
            ))}
          </div>
        </div>

        {/* Education Block */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/70 font-mono px-2">
            <HiOutlineAcademicCap className="text-primary text-sm" />
            <span>Higher Education & Degrees</span>
          </div>

          <div className="bg-base-100 rounded-2xl border border-base-300 p-2 shadow-xs">
            {educations.map((edu, idx) => (
              <CvRow
                key={idx}
                title={edu.degree || ''}
                org={edu.institution}
                period={`${edu.from} – ${edu.to}`}
                honor={edu.degree?.includes('PhD') ? 'UZH.ai Fellow • DSI Excellence Program' : undefined}
              />
            ))}
          </div>
        </div>

        {/* Teaching Block */}
        {teaching && teaching.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/70 font-mono px-2">
              <HiOutlineBookOpen className="text-primary text-sm" />
              <span>Teaching & Academic Leadership</span>
            </div>

            <div className="bg-base-100 rounded-2xl border border-base-300 p-2 shadow-xs">
              {teaching.map((t, idx) => (
                <CvRow
                  key={idx}
                  title={t.course}
                  org={`${t.role} • ${t.institution}`}
                  orgLink={t.link}
                  period={t.year}
                />
              ))}
            </div>
          </div>
        )}

        {/* Certifications Block */}
        {certifications && certifications.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/70 font-mono px-2">
              <HiOutlineBadgeCheck className="text-primary text-sm" />
              <span>Certifications & Professional Credentials</span>
            </div>

            <div className="bg-base-100 rounded-2xl border border-base-300 p-2 shadow-xs">
              {certifications.map((cert, idx) => (
                <CvRow
                  key={idx}
                  title={cert.name || ''}
                  org={cert.body}
                  orgLink={cert.link?.startsWith('http') ? cert.link : undefined}
                  period={cert.year || ''}
                  note={!cert.link?.startsWith('http') ? cert.link : undefined}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CvCard;
