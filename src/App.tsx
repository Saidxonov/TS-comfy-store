import { Routes, Route } from "react-router-dom";
import Products from "./pages/Products/products";
import MainLayout from "./Layout/MainLayout";
import ProductD from "./components/ProductD/productD";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Products />
            </MainLayout>
          }
        />
        <Route
          path="/products/:id"
          element={
            <MainLayout>
              <ProductD />
            </MainLayout>
          }
        />
      </Routes>
    </>
  );
};

export default App;
