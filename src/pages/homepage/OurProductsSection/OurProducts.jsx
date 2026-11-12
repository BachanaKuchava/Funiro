import './ourProducts.scss';
import ProductCard from '../../../components/product-card/ProductCard';
import ShowMoreBtn from '../../../components/button/ShowMoreBtn';

function OurProducts() {
    return(

        <>
            <div className="ourproducts-main">

                <h1 className='ourproducts-heading'>Our Products</h1>

                <div className="ourproducts-productCard-block">
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />

                </div>

                <ShowMoreBtn />
            </div>
       

        
        
        </>
    )
}

export default OurProducts;