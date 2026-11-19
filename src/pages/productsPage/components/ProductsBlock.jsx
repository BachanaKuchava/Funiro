import './productsBlock.scss';
import ProductCard from '../../../components/product-card/ProductCard';
import { useState, useEffect, useMemo } from 'react';

const API_URL =
    'https://raw.githubusercontent.com/Ommadure/Furniture-ecommerce/main/data/db.json';

const defaultFilters = {
    search: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    discounted: false,
    topRated: false,
    bestseller: false
};

function ProductsBlock({ filters = defaultFilters, sortBy = 'default' }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load the source JSON only once when the component mounts.
    useEffect(() => {
        const controller = new AbortController();

        const fetchProducts = async () => {
            try {
                const response = await fetch(API_URL, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(Array.isArray(data.products) ? data.products : []);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error fetching products:', err);
                    setError('Failed to load products.');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();
        return () => controller.abort();
    }, []);

    // Filter first, sort second, and limit to 40 only for rendering.
    const filteredProducts = useMemo(() => {
        let result = [...products];

        const search = filters.search?.trim().toLowerCase() ?? '';
        const brand = filters.brand?.trim().toLowerCase() ?? '';

        if (search) {
            result = result.filter(product =>
                (product.title ?? '').toLowerCase().includes(search)
            );
        }

        if (brand) {
            result = result.filter(product =>
                (product.brand ?? '').toLowerCase().includes(brand)
            );
        }

        if (filters.minPrice !== '') {
            result = result.filter(product =>
                Number(product.price) >= Number(filters.minPrice)
            );
        }

        if (filters.maxPrice !== '') {
            result = result.filter(product =>
                Number(product.price) <= Number(filters.maxPrice)
            );
        }

        if (filters.discounted) {
            result = result.filter(product =>
                Number(product.price_was) > Number(product.price) ||
                Number(product.percentage_off) > 0
            );
        }

        if (filters.topRated) {
            result = result.filter(product =>
                Number(product.rating ?? 0) >= 4
            );
        }

        if (filters.bestseller) {
            result = result.filter(product =>
                Array.isArray(product.badges) &&
                product.badges.some(badge =>
                    typeof badge === 'string' &&
                    badge.toLowerCase().includes('bestseller')
                )
            );
        }

        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => Number(a.price) - Number(b.price));
                break;
            case 'price-high':
                result.sort((a, b) => Number(b.price) - Number(a.price));
                break;
            case 'rating':
                result.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
                break;
            case 'reviews':
                result.sort((a, b) => Number(b.reviews ?? 0) - Number(a.reviews ?? 0));
                break;
            default:
                // Original order from the source JSON.
                break;
        }

        return result;
    }, [products, filters, sortBy]);

    const visibleProducts = filteredProducts.slice(0, 40);

    return (
        <div className="products-block">
            {loading && <p>Loading products...</p>}
            {error && <p role="alert">{error}</p>}

            {!loading && !error && filteredProducts.length === 0 && (
                <p>No products found.</p>
            )}

            {!loading && !error && visibleProducts.map(product => (
                <ProductCard
                    key={product.product_id}
                    product={product}
                />
            ))}
        </div>
    );
}

export default ProductsBlock;
