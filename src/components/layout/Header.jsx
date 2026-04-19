import React from 'react';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-center border-b border-[#E6E8EA] bg-white lg:hidden">
      <h1 className="text-xl font-bold">
        <span className="text-[#F0B90B]">IDX</span>
        <span className="text-[#1E2026]">Journal</span>
      </h1>
    </header>
  );
};

export default Header;
