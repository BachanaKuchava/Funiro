import './productsBlock.scss';
import ProductCard from '../../../components/product-card/ProductCard';
import {useState, useEffect} from 'react';


function ProductsBlock() {

        const [products, setProducts] = useState([]);
        const firstEightProducts = products.slice(0, 40);
    
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
    
    return (

<div className="products-block">
         {firstEightProducts.map((product) => (
                        <ProductCard
                            key={product.product_id}
                            product={product}
                        />
                    ))}
</div>
        
    )
}

export default ProductsBlock;