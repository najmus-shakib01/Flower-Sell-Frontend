/* eslint-disable react/prop-types */
const FlowerFilter = ({
  filters,
  selectedFilter,
  handleFilterClick,
  totalFlowers,
}) => {
  return (
    <div className="container mt-6">
      <div className="bg-gray-200 text-black rounded-2xl shadow-xl p-6">
        <h3 className="text-center text-2xl font-bold text-gray-700 mb-4">
          Flower Filter
        </h3>
        <ul className="flex flex-wrap justify-center gap-3 px-4 py-4">
          {filters.map((filter) => (
            <li
              key={filter}
              className={`px-5 py-2 rounded-full cursor-pointer transition-all duration-300 text-sm md:text-base font-[var(--e-global-typography-accent-font-family)] text-[var(--e-global-typography-accent-font-size)] uppercase leading-[var(--e-global-typography-accent-line-height)] tracking-[var(--e-global-typography-accent-letter-spacing)] border border-[var(--e-global-color-d49ac81)] ${
                selectedFilter === filter.toLowerCase()
                  ? "bg-gradient-to-r from-[#b47cfd] to-[#ff7fc2] text-white shadow-[inset_-25px_0px_20px_-10px_#FFB07B] scale-105"
                  : "bg-gray-300 text-gray-800 hover:bg-gray-400 hover:text-white"
              }`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </li>
          ))}
        </ul>
        <div className="text-center mt-3">
          <b className="text-gray-800 text-lg">Total Flowers : {totalFlowers}!</b>
        </div>
      </div>
    </div>
  );
};

export default FlowerFilter;
