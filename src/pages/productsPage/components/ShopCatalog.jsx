import { useState } from 'react';
import FilterBlock from './FilterBlock';
import ProductsBlock from './ProductsBlock';

const initialFilters = {
    search: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    discounted: false,
    topRated: false,
    bestseller: false
};

function ShopCatalog() {
    const [appliedFilters, setAppliedFilters] = useState(initialFilters);
    const [sortBy, setSortBy] = useState('default');

    return (
        <>
            <FilterBlock
                onApplyFilters={setAppliedFilters}
                onSortChange={setSortBy}
            />

            <ProductsBlock
                filters={appliedFilters}
                sortBy={sortBy}
            />
        </>
    );
}

export default ShopCatalog;