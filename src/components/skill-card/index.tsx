import React, { useState } from 'react';
import {
  SiPython,
  SiPytorch,
  SiCplusplus,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiNextdotjs,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiDocker,
  SiCss3,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { HiOutlineCode, HiOutlineSparkles } from 'react-icons/hi';
import { skeleton } from '../../utils';

interface TechItem {
  name: string;
  category: 'AI & ML' | 'Languages' | 'Fullstack' | 'Data & Infra';
  icon: React.ReactNode;
  brandColor: string;
  brandBg: string;
}

const TECH_DEFINITIONS: Record<string, TechItem> = {
  python: {
    name: 'Python',
    category: 'AI & ML',
    icon: <SiPython className="text-base" />,
    brandColor: '#3776AB',
    brandBg: 'rgba(55, 118, 171, 0.12)',
  },
  pytorch: {
    name: 'PyTorch',
    category: 'AI & ML',
    icon: <SiPytorch className="text-base" />,
    brandColor: '#EE4C2C',
    brandBg: 'rgba(238, 76, 44, 0.12)',
  },
  'c/c++': {
    name: 'C/C++',
    category: 'Languages',
    icon: <SiCplusplus className="text-base" />,
    brandColor: '#00599C',
    brandBg: 'rgba(0, 89, 156, 0.12)',
  },
  c: {
    name: 'C/C++',
    category: 'Languages',
    icon: <SiCplusplus className="text-base" />,
    brandColor: '#00599C',
    brandBg: 'rgba(0, 89, 156, 0.12)',
  },
  java: {
    name: 'Java',
    category: 'Languages',
    icon: <FaJava className="text-base" />,
    brandColor: '#ED8B00',
    brandBg: 'rgba(237, 139, 0, 0.12)',
  },
  javascript: {
    name: 'JavaScript',
    category: 'Fullstack',
    icon: <SiJavascript className="text-base" />,
    brandColor: '#F7DF1E',
    brandBg: 'rgba(247, 223, 30, 0.12)',
  },
  'react.js': {
    name: 'React.js',
    category: 'Fullstack',
    icon: <SiReact className="text-base" />,
    brandColor: '#61DAFB',
    brandBg: 'rgba(97, 218, 251, 0.12)',
  },
  react: {
    name: 'React.js',
    category: 'Fullstack',
    icon: <SiReact className="text-base" />,
    brandColor: '#61DAFB',
    brandBg: 'rgba(97, 218, 251, 0.12)',
  },
  'node.js': {
    name: 'Node.js',
    category: 'Fullstack',
    icon: <SiNodedotjs className="text-base" />,
    brandColor: '#5FA04E',
    brandBg: 'rgba(95, 160, 78, 0.12)',
  },
  'next.js': {
    name: 'Next.js',
    category: 'Fullstack',
    icon: <SiNextdotjs className="text-base" />,
    brandColor: '#000000',
    brandBg: 'rgba(0, 0, 0, 0.12)',
  },
  mysql: {
    name: 'MySQL',
    category: 'Data & Infra',
    icon: <SiMysql className="text-base" />,
    brandColor: '#4479A1',
    brandBg: 'rgba(68, 121, 161, 0.12)',
  },
  postgresql: {
    name: 'PostgreSQL',
    category: 'Data & Infra',
    icon: <SiPostgresql className="text-base" />,
    brandColor: '#4169E1',
    brandBg: 'rgba(65, 105, 225, 0.12)',
  },
  git: {
    name: 'Git',
    category: 'Data & Infra',
    icon: <SiGit className="text-base" />,
    brandColor: '#F05032',
    brandBg: 'rgba(240, 80, 50, 0.12)',
  },
  docker: {
    name: 'Docker',
    category: 'Data & Infra',
    icon: <SiDocker className="text-base" />,
    brandColor: '#2496ED',
    brandBg: 'rgba(36, 150, 237, 0.12)',
  },
  css: {
    name: 'CSS',
    category: 'Fullstack',
    icon: <SiCss3 className="text-base" />,
    brandColor: '#1572B6',
    brandBg: 'rgba(21, 114, 182, 0.12)',
  },
};

const SkillCard = ({
  loading,
  skills,
}: {
  loading: boolean;
  skills: string[];
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const categories = ['All', 'AI & ML', 'Languages', 'Fullstack', 'Data & Infra'];

  const getTechInfo = (skillName: string): TechItem => {
    const key = skillName.toLowerCase().trim();
    if (TECH_DEFINITIONS[key]) {
      return TECH_DEFINITIONS[key];
    }
    return {
      name: skillName,
      category: 'Languages',
      icon: <HiOutlineCode className="text-base" />,
      brandColor: '#6366F1',
      brandBg: 'rgba(99, 102, 241, 0.12)',
    };
  };

  const filteredSkills = skills.filter((skill) => {
    if (selectedCategory === 'All') return true;
    const info = getTechInfo(skill);
    return info.category === selectedCategory;
  });

  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 8; index++) {
      array.push(
        <div key={index}>
          {skeleton({ widthCls: 'w-full', heightCls: 'h-10', shape: 'rounded-xl' })}
        </div>,
      );
    }
    return array;
  };

  return (
    <div className="card shadow-lg bg-base-100 border border-base-300">
      <div className="card-body p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-300 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg text-primary shrink-0">
              <HiOutlineCode className="text-lg" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-base-content tracking-tight">
                Tech Stack & Tooling
              </h2>
              <p className="text-[10px] text-base-content/60 font-mono">
                Languages & Frameworks
              </p>
            </div>
          </div>

          <span className="badge badge-xs badge-ghost font-mono text-[10px] opacity-70">
            {skills.length} tools
          </span>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-content font-bold shadow-xs'
                  : 'bg-base-200 hover:bg-base-300 text-base-content/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 gap-2">
          {loading
            ? renderSkeleton()
            : filteredSkills.map((skill, index) => {
                const info = getTechInfo(skill);
                const isHovered = hoveredSkill === skill;

                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className="p-2.5 rounded-xl border border-base-300 bg-base-200/50 hover:bg-base-200 transition-all duration-200 cursor-default group flex items-center justify-between shadow-xs hover:shadow-md hover:scale-[1.02]"
                    style={{
                      borderColor: isHovered ? `${info.brandColor}80` : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-115"
                        style={{
                          backgroundColor: info.brandBg,
                          color: info.brandColor,
                        }}
                      >
                        {info.icon}
                      </div>
                      <span className="text-xs font-semibold text-base-content truncate group-hover:text-primary transition-colors">
                        {info.name}
                      </span>
                    </div>

                    {/* Small interactive indicator */}
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      style={{ backgroundColor: info.brandColor }}
                    />
                  </div>
                );
              })}
        </div>

        {/* Interactive Status Footer */}
        <div className="pt-1 text-[11px] font-mono text-base-content/50 flex items-center justify-between border-t border-base-300/60">
          <span className="inline-flex items-center gap-1">
            <HiOutlineSparkles className="text-primary text-xs" />
            <span>Tooling & Ecosystem</span>
          </span>
          <span className="text-[10px] opacity-70 uppercase tracking-wider">
            {selectedCategory === 'All' ? 'Full Stack' : selectedCategory}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
