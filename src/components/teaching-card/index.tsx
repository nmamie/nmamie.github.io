import React, { Fragment } from 'react';
import { skeleton } from '../../utils';
import { PiPresentation } from 'react-icons/pi';

interface TeachingItem {
  course: string;
  role: string;
  institution: string;
  year: string;
  link?: string;
}

const ListItem = ({
  year,
  course,
  role,
  institution,
  link,
}: {
  year: React.ReactNode;
  course: React.ReactNode;
  role: React.ReactNode;
  institution: React.ReactNode;
  link?: string;
}) => (
  <li className="mb-5 ml-4">
    <div
      className="absolute w-2 h-2 bg-base-300 rounded-full border border-base-300 mt-1.5"
      style={{ left: '-4.5px' }}
    ></div>
    <div className="my-0.5 text-xs opacity-60">{year}</div>
    <h3 className="font-semibold text-sm">
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
          {course}
        </a>
      ) : (
        course
      )}
    </h3>
    <div className="text-xs font-mono opacity-80 mt-0.5">
      {role} • {institution}
    </div>
  </li>
);

const TeachingCard = ({
  teaching,
  loading,
}: {
  teaching: TeachingItem[];
  loading: boolean;
}) => {
  if (!loading && (!teaching || teaching.length === 0)) {
    return null;
  }

  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 2; index++) {
      array.push(
        <ListItem
          key={index}
          year={skeleton({ widthCls: 'w-1/4', heightCls: 'h-3' })}
          course={skeleton({ widthCls: 'w-3/4', heightCls: 'h-4', className: 'my-1' })}
          role={skeleton({ widthCls: 'w-1/2', heightCls: 'h-3' })}
          institution={skeleton({ widthCls: 'w-1/3', heightCls: 'h-3' })}
        />,
      );
    }
    return array;
  };

  return (
    <div className="card shadow-lg card-sm bg-base-100">
      <div className="card-body">
        <div className="mx-3 flex items-center space-x-2">
          {loading ? (
            skeleton({ widthCls: 'w-8', heightCls: 'h-8', className: 'rounded-xl' })
          ) : (
            <div className="text-primary text-xl">
              <PiPresentation />
            </div>
          )}
          <h2 className="card-title text-base-content opacity-70">
            {loading ? (
              skeleton({ widthCls: 'w-24', heightCls: 'h-6' })
            ) : (
              'Teaching & Assisting'
            )}
          </h2>
        </div>
        <div className="text-base-content mt-3">
          <ol className="relative border-l border-base-300 border-opacity-30 my-2 mx-4">
            {loading ? (
              renderSkeleton()
            ) : (
              <Fragment>
                {teaching.map((item, index) => (
                  <ListItem
                    key={index}
                    year={item.year}
                    course={item.course}
                    role={item.role}
                    institution={item.institution}
                    link={item.link}
                  />
                ))}
              </Fragment>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TeachingCard;
