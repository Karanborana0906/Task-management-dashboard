import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const Breadcrumb = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center gap-2 text-sm text-neutral-600 ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <FiChevronRight className="text-neutral-400 flex-shrink-0" />
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-primary-600 transition-colors truncate"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-900 font-medium truncate">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
