import "./product.css";
import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

interface ProductAttributes {
  title: string;
  price: number;
  image: string;
  company: string;
  category: string;
}

interface ProductData {
  id: number;
  attributes: ProductAttributes;
}

function Product() {
  const [res, setRes] = useState<ProductData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<{ data: ProductData[] }>(
        `https://strapi-store-server.onrender.com/api/products`
      )
      .then((response: AxiosResponse<{ data: ProductData[] }>) => {
        if (response.status === 200) {
          const products = response.data.data;
          setRes(products);

          const uniqueCompanies: string[] = [];
          const uniqueCategories: string[] = [];

          products.forEach((product) => {
            const company = product.attributes.company;
            const category = product.attributes.category;

            if (!uniqueCompanies.includes(company)) {
              uniqueCompanies.push(company);
            }

            if (!uniqueCategories.includes(category)) {
              uniqueCategories.push(category);
            }
          });
        }
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  }, []);

  function handleClick(id: number): void {
    navigate(`/products/${id}`);
  }

  return (
    <>
      <div className="products">
        <div className="container">
          <div className="products-list">
            {res.length > 0 ? (
              res.map((value) => {
                return (
                  <div
                    onClick={() => {
                      handleClick(value.id);
                    }}
                    key={value.id}
                    className="card"
                  >
                    <div className="product-image">
                      <img
                        src={value.attributes.image}
                        alt={value.attributes.title}
                      />
                    </div>
                    <div className="product-title">
                      <h2>{value.attributes.title}</h2>
                      <p>${value.attributes.price}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;
