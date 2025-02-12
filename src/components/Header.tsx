function Header() {
  return (
    <div className="w-full border-b flex flex-none flex-col justify-center h-[var(--header-height)]">
      <div className="container">
        <div className="flex w-full gap-6 items-center">
          {/* logo  */}
          <div className="p-2 bg-green-700 flex-none">
            <div className="p-1 bg-red-950"></div>
          </div>
          {/* app name  */}
          <div className="flex-grow">
            <span className="text-sm text-gray-400">App name</span>
            <h3 className="text-md font-semibold">Employee List</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
