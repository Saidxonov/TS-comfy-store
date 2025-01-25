import "./product.css";
import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

interface ProductAttributes {
  company: string;
  category: string;
  title: string;
  price: number;
  image: string;
}

interface ProductData {
  id: string;
  attributes: ProductAttributes;
}

function Product() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [res, setRes] = useState<ProductData[]>([]);
  const [filteredRes, setFilteredRes] = useState<ProductData[]>([]);
  const [search, setSearch] = useState<string>("");
  const [companies, setCompanies] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false); // Dark/Light rejimni boshqarish

  const navigate = useNavigate();

  // Material-UI mavzusi
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  useEffect(() => {
    axios
      .get(
        `https://strapi-store-server.onrender.com/api/products?page=${currentPage}`
      )
      .then((response) => {
        if (response.status === 200) {
          const products: ProductData[] = response.data.data;
          setRes(products);
          setFilteredRes(products);

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

          setCompanies(uniqueCompanies);
          setCategories(uniqueCategories);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentPage]);

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    filterProducts(query, selectedCompany, selectedCategory);
  }

  function handleCompanyChange(e: ChangeEvent<HTMLSelectElement>) {
    const company = e.target.value;
    setSelectedCompany(company);
    filterProducts(search, company, selectedCategory);
  }

  function handleCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;
    setSelectedCategory(category);
    filterProducts(search, selectedCompany, category);
  }

  function filterProducts(
    searchQuery: string,
    company: string,
    category: string
  ) {
    let filtered = res;

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.attributes.title.toLowerCase().includes(searchQuery)
      );
    }

    if (company) {
      filtered = filtered.filter(
        (product) => product.attributes.company === company
      );
    }

    if (category) {
      filtered = filtered.filter(
        (product) => product.attributes.category === category
      );
    }

    setFilteredRes(filtered);
  }

  function handleClick(id: string) {
    navigate(`/products/${id}`);
  }

  function handleChangePagination(
    event: React.ChangeEvent<unknown>,
    page: number
  ) {
    setCurrentPage(page);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="form">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" color="text.primary">
              Product List
            </Typography>
            {/* Dark/Light Mode Switch */}
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </div>
          <form>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearch}
              className="search-input"
            />

            <select
              value={selectedCompany}
              onChange={handleCompanyChange}
              className="filter-select"
            >
              <option value="">All Companies</option>
              {companies.map((company, index) => (
                <option key={index} value={company}>
                  {company}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </form>
        </div>
      </div>

      <div className="products">
        <div className="container">
          <div className="products-list">
            {filteredRes.length > 0 ? (
              filteredRes.map((value) => {
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
      <div className="container">
        <Pagination
          count={3}
          onChange={handleChangePagination}
          sx={{ marginTop: "50px", marginBottom: "50px" }}
          color="primary"
          page={currentPage}
        />
      </div>
    </ThemeProvider>
  );
}

export default Product;
