
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import './filterBlock.scss';
import filtericon from '../../../assets/icons/filter-icon.svg';
import chevronDown from '../../../assets/icons/chevron-down.svg';

const initialFilters = {
    search: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    discounted: false,
    topRated: false,
    bestseller: false
};

function FilterBlock({ onApplyFilters, onSortChange }) {

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [filters, setFilters] = useState({
        ...initialFilters
    });

    const [sortBy, setSortBy] = useState('default');

    const modalRef = useRef(null);

    // UPDATE FILTER INPUTS

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // RESET FILTERS

    const handleReset = () => {
        const clearedFilters = { ...initialFilters };
        setFilters(clearedFilters);
        onApplyFilters?.(clearedFilters);
    };

    // SEARCH BUTTON

    const handleSearch = (e) => {
        e.preventDefault();

        if (isPriceRangeInvalid) return;

        // Future API/filter integration
        onApplyFilters?.({ ...filters });

        setIsFilterOpen(false);
    };

    // SORT DROPDOWN

    const handleSortChange = (e) => {
        const selectedValue = e.target.value;

        setSortBy(selectedValue);

        // Future sorting integration
        onSortChange?.(selectedValue);
    };

    // PRICE VALIDATION

    const isPriceRangeInvalid =
        filters.minPrice !== '' &&
        filters.maxPrice !== '' &&
        Number(filters.minPrice) > Number(filters.maxPrice);

    // MODAL BEHAVIOR

    useEffect(() => {

        if (!isFilterOpen) return;

        const previousOverflow = document.body.style.overflow;
        const previousFocus = document.activeElement;

        document.body.style.overflow = 'hidden';

        const focusableElements = () => {
            return Array.from(
                modalRef.current?.querySelectorAll(
                    'button:not([disabled]), input:not([disabled]), select:not([disabled])'
                ) || []
            );
        };

        modalRef.current?.focus();

        const handleKeyDown = (e) => {

            if (e.key === 'Escape') {
                setIsFilterOpen(false);
                return;
            }

            if (e.key !== 'Tab') return;

            const elements = focusableElements();

            if (!elements.length) return;

            const first = elements[0];
            const last = elements[elements.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (
                !e.shiftKey &&
                document.activeElement === last
            ) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;

            document.removeEventListener(
                'keydown',
                handleKeyDown
            );

            previousFocus?.focus?.();
        };

    }, [isFilterOpen]);

    return (
        <>
            <div className="filter-block">

                {/* FILTER BUTTON */}

                <button
                    type="button"
                    className="filter"
                    onClick={() => setIsFilterOpen(true)}
                    aria-haspopup="dialog"
                    aria-expanded={isFilterOpen}
                >
                    <img src={filtericon} alt="" />
                    <span>Filter</span>
                </button>

                {/* SORT DROPDOWN */}

                <div className="sort">

                    <label htmlFor="products-sort">
                        Sort By
                    </label>

                    <div className="sort-select">

                        <select
                            id="products-sort"
                            value={sortBy}
                            onChange={handleSortChange}
                        >
                            <option value="default">
                                Default
                            </option>

                            <option value="price-low">
                                Price: Low to High
                            </option>

                            <option value="price-high">
                                Price: High to Low
                            </option>

                            <option value="rating">
                                Top Rated
                            </option>

                            <option value="reviews">
                                Most Reviewed
                            </option>
                        </select>

                        <img src={chevronDown} alt="" />

                    </div>

                </div>

            </div>

            {/* FILTER MODAL */}

            {isFilterOpen && createPortal(

                <div
                    className="filter-modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsFilterOpen(false);
                        }
                    }}
                >

                    <div
                        className="filter-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="filter-modal-title"
                        aria-describedby="filter-modal-description"
                        ref={modalRef}
                        tabIndex={-1}
                    >

                        {/* MODAL HEADER */}

                        <div className="filter-modal-header">

                            <div>
                                <h2 id="filter-modal-title">
                                    Filter Products
                                </h2>

                                <p id="filter-modal-description">
                                    Find furniture that fits your preferences
                                </p>
                            </div>

                            <button
                                type="button"
                                className="filter-modal-close"
                                onClick={() => setIsFilterOpen(false)}
                                aria-label="Close filters"
                            >
                                &times;
                            </button>

                        </div>

                        {/* MODAL FORM */}

                        <form
                            className="filter-modal-form"
                            onSubmit={handleSearch}
                        >

                            <div className="filter-modal-body">

                                {/* SEARCH BY NAME */}

                                <div className="filter-field">

                                    <label htmlFor="filter-search">
                                        Product Name
                                    </label>

                                    <input
                                        id="filter-search"
                                        type="text"
                                        placeholder="Search furniture..."
                                        value={filters.search}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                'search',
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                {/* BRAND */}

                                <div className="filter-field">

                                    <label htmlFor="filter-brand">
                                        Brand
                                    </label>

                                    <input
                                        id="filter-brand"
                                        type="text"
                                        placeholder="Enter brand name"
                                        value={filters.brand}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                'brand',
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                {/* PRICE RANGE */}

                                <fieldset className="filter-fieldset">

                                    <legend>
                                        Price Range
                                    </legend>

                                    <div className="filter-price-range">

                                        <div className="filter-field">

                                            <label htmlFor="filter-min-price">
                                                Min Price ($)
                                            </label>

                                            <input
                                                id="filter-min-price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="Min price"
                                                value={filters.minPrice}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        'minPrice',
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                        <div className="filter-field">

                                            <label htmlFor="filter-max-price">
                                                Max Price ($)
                                            </label>

                                            <input
                                                id="filter-max-price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="Max price"
                                                value={filters.maxPrice}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        'maxPrice',
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>

                                    {isPriceRangeInvalid && (
                                        <p className="filter-error" role="alert">
                                            Min price cannot exceed max price.
                                        </p>
                                    )}

                                </fieldset>

                                {/* ADDITIONAL FILTERS */}

                                <fieldset className="filter-fieldset">

                                    <legend>
                                        More Filters
                                    </legend>

                                    <div className="filter-checkbox-group">

                                        <label className="filter-checkbox">

                                            <input
                                                type="checkbox"
                                                checked={filters.discounted}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        'discounted',
                                                        e.target.checked
                                                    )
                                                }
                                            />

                                            <span>
                                                Discounted Products
                                            </span>

                                        </label>

                                        <label className="filter-checkbox">

                                            <input
                                                type="checkbox"
                                                checked={filters.topRated}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        'topRated',
                                                        e.target.checked
                                                    )
                                                }
                                            />

                                            <span>
                                                4+ Star Rating
                                            </span>

                                        </label>

                                        <label className="filter-checkbox">

                                            <input
                                                type="checkbox"
                                                checked={filters.bestseller}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        'bestseller',
                                                        e.target.checked
                                                    )
                                                }
                                            />

                                            <span>
                                                Bestseller
                                            </span>

                                        </label>

                                    </div>

                                </fieldset>

                            </div>

                            {/* MODAL FOOTER */}

                            <div className="filter-modal-footer">

                                <button
                                    type="button"
                                    className="filter-reset-btn"
                                    onClick={handleReset}
                                >
                                    Reset All
                                </button>

                                <button
                                    type="submit"
                                    className="filter-search-btn"
                                    disabled={isPriceRangeInvalid}
                                >
                                    Search Products
                                </button>

                            </div>

                        </form>

                    </div>

                </div>,

                document.body
            )}

        </>
    );
}

export default FilterBlock;
