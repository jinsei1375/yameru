import React from 'react';

type PageTitleProps = {
  children: React.ReactNode;
};

export function PageTitle({ children }: PageTitleProps) {
  return (
    <div className="flex justify-center mb-6">
      <h1 className="text-2xl font-bold">{children}</h1>
    </div>
  );
}
