import { ReactNode, useEffect, useRef, useState } from 'react';

/** Page section with a small-caps label, anchor id and a gentle fade-in on scroll. */
const Section = ({
  id,
  title,
  action,
  children,
}: {
  id: string;
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      data-section
      className={`scroll-mt-24 py-12 sm:py-14 border-t border-base-300 first:border-t-0 reveal ${
        visible ? 'is-visible' : ''
      }`}
    >
      {title && (
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <h2 className="section-label">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
};

export default Section;

/** Small text button used for "show all" toggles. */
export const TextButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="text-sm text-base-content/60 hover:text-primary transition-colors"
  >
    {children}
  </button>
);

/** External link that opens in a new tab. */
export const ExtLink = ({
  href,
  className = '',
  children,
  title,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  title?: string;
}) => (
  <a href={href} target="_blank" rel="noreferrer" className={className} title={title}>
    {children}
  </a>
);
