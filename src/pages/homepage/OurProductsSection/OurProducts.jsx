import './ourProducts.scss';
import ProductCard from '../../../components/product-card/ProductCard';
import ShowMoreBtn from '../../../components/button/ShowMoreBtn';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function OurProducts() {

    const [products, setProducts] = useState([]);
    const firstEightProducts = products.slice(0, 8);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    'https://raw.githubusercontent.com/Ommadure/Furniture-ecommerce/main/data/db.json'
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();

                setProducts(data.products);

            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();

    }, []);

    console.log(products);

    return (

        <>
            <div className="ourproducts-main">

                <h1 className='ourproducts-heading'>Our Products</h1>

                <div className="ourproducts-productCard-block">
                    {firstEightProducts.map((product) => (
                        <ProductCard
                            key={product.product_id}
                            product={product}
                        />
                    ))}

                </div>

               <Link to="/productsPage"><ShowMoreBtn /></Link>
            </div>




        </>
    )
}

export default OurProducts;