import PropTypes from 'prop-types';

/**
 * Filter daftar thread berdasarkan kategori. Filter dilakukan sepenuhnya
 * di sisi front-end melalui state Redux karena API tidak menyediakannya.
 */
function CategoryFilter({ categories, selectedCategory, onSelect }) {
  if (categories.length === 0) return null;

  return (
    <section className="category-filter" aria-label="Filter kategori">
      <h2 className="category-filter__title">Kategori populer</h2>
      <div className="category-filter__list">
        <button
          type="button"
          className={`chip ${selectedCategory === '' ? 'chip--active' : ''}`}
          onClick={() => onSelect('')}
          aria-pressed={selectedCategory === ''}
        >
          Semua
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`chip ${selectedCategory === category ? 'chip--active' : ''}`}
            onClick={() => onSelect(category)}
            aria-pressed={selectedCategory === category}
          >
            #
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CategoryFilter;
