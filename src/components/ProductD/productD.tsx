import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./productD.css";

interface ProductAttributes {
  image: string;
  title: string;
  company: string;
  price: number;
  description: string;
}

interface Product {
  id: string;
  attributes: ProductAttributes;
}

interface ProductResponse {
  data: Product;
}

function ProductD() {
  const [product, setProduct] = useState<Product | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<ProductResponse>(
        `https://strapi-store-server.onrender.com/api/products/${id}`
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setProduct(response.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  function handleRedirectProducts() {
    navigate("/");
  }

  return (
    <div>
      <div className="product-page">
        <div className="container">
          <div className="link-home">
            <p>
              <span>Home</span> {">"}{" "}
              <span
                className="product-page-redirector"
                onClick={handleRedirectProducts}
              >
                Products
              </span>
            </p>
          </div>
          {product && product.id && (
            <>
              <div className="product-wrapper">
                <div className="products-img">
                  <img
                    src={product.attributes.image}
                    alt={product.attributes.title}
                  />
                </div>
                <div className="product-info">
                  <div className="product-page-name">
                    <h2>{product.attributes.title}</h2>
                  </div>
                  <div className="product-company">
                    <p>{product.attributes.company}</p>
                  </div>
                  <div className="product-page-price">
                    <p>${product.attributes.price}</p>
                  </div>
                  <div className="product-description">
                    <p>{product.attributes.description}</p>
                  </div>
                  <div className="colors">
                    <p>colors</p>
                    <div className="count-color">
                      <p className="first-color"></p>
                      <p className="second-color"></p>
                    </div>
                  </div>
                  <div className="amount">
                    <p>Amount</p>
                    <select id="amount-select">
                      {Array.from({ length: 20 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="add">
                    <button>ADD TO BAG</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductD;
