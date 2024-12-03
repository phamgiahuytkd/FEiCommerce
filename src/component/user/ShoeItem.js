import { DataShoeItem } from "./ShoeItemData";
import React from 'react';




const groupByBrandAndName = (items) => {
    const groupedItems = {};

    items.forEach(item => {
        const key = `${item.name}_${item.brand}`; // Unique key based on name and brand
        if (!groupedItems[key]) {
            groupedItems[key] = {
                name: item.name,
                brand: item.brand,
                products: [item], // Lưu toàn bộ object sản phẩm
            };
        } else {
            groupedItems[key].products.push(item);
        }
    });

    return Object.values(groupedItems); // Convert object to array
};






function ShoeItems({ products }) {
    const [selectedProduct, setSelectedProduct] = React.useState(products[0]); // Default to the first product

    const handleColorChange = (id) => {
        const newProduct = products.find(product => product.id === id);
        setSelectedProduct(newProduct);
    };

    return (
        <div className="shoe-item" data-brand={selectedProduct.brand} style={{ '--item-color': selectedProduct.colour }}>
            <div className="shoe-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>

            <div className="shoe-content">
                <h2>{selectedProduct.name}</h2>
                
                {selectedProduct.stock === 0 ? (
                    <div className="price">
                        <h2>Sản phẩm đã bán hết!</h2>
                    </div>
                ) : (
                    <div className="price">
                        <h3>Price :</h3>
                        <h2>{selectedProduct.price} <sup>đ</sup></h2>
                    </div>
                )}


                <div className="color">
                    <h3>Color :</h3>
                    {products.map(product => (
                        <label key={product.id}>
                            <input
                                type="radio"
                                name="color"
                                checked={product.id === selectedProduct.id}
                                onChange={() => handleColorChange(product.id)}
                            />
                            <span style={{ backgroundColor: product.colour }}></span>
                        </label>
                    ))}
                </div>
                <a href={`#buy-now-${selectedProduct.id}`}>Buy now</a>
            </div>
        </div>
    );
}






function ShoeItemList() {
    const groupedData = groupByBrandAndName(DataShoeItem);

    return (
        <div className="shoe-list">
            {groupedData.map(item => (
                <ShoeItems
                    key={`${item.name}_${item.brand}`}
                    products={item.products}
                />
            ))}
        </div>
    );
}

export default ShoeItemList;



