import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./productService";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import styles from "./ProductList.module.css";

import search from "../../public/search-normal.png";
import setting from "../../public/setting-3.png";
import trash from "../../public/trash.png";
import edit from "../../public/edit.png";
import user from "../../public/user.png";
import power from "../../public/power.png";
import Image from "next/image";

const ProductList = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["products", page],
    queryFn: () => getProducts({ page, limit }),
    keepPreviousData: false,
  });

  const [username, setUsername] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  if (isLoading) return <p>در حال بارگذاری...</p>;
  if (isError) return <p>خطا در دریافت محصولات</p>;

  const totalPages = Math.ceil(data.totalProducts / limit);

  const filteredProducts = data.data.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = product.name.toLowerCase().includes(searchLower);
    const idMatch = product.id.toString().includes(searchLower);

    return nameMatch || idMatch;
  });

  return (
    <>
      <div className={styles.navbar} style={{}}>
        <Image src={search} alt="search.png" />
        <input
          type="text"
          placeholder="جستجو  کالا"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className={styles.userInfo}>
          <Image src={user} alt="user.png" /> {username}
        </div>
        <div className={styles.exit}>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                window.location.href = "/login";
              }
            }}
          >
            <Image src={power} alt="power.png" />
          </button>
        </div>
      </div>

      {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} />}
      <div className={styles.subject}>
        <div>
          <Image src={setting} alt="setting.png" />
          <h1>مدیریت کالاها</h1>
        </div>
        <button onClick={() => setIsModalOpen(true)}>افزودن محصول</button>
      </div>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>نام کالا</th>
            <th>موجودی</th>
            <th>قیمت</th>
            <th>شناسه</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="5">محصولی برای نمایش وجود ندارد</td>
            </tr>
          ) : (
            filteredProducts.map((product) => (
              <tr key={product.id} className={styles.productsRow}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price.toLocaleString("fa-IR")} تومان</td>
                <td>{product.id}</td>
                <td className={styles.buttonOptions}>
                  <button onClick={() => setSelectedProduct(product)}>
                    <Image src={edit} alt="" />
                  </button>
                  <button onClick={() => setDeleteProduct(product)}>
                    <Image src={trash} alt="" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isFetching && <p>در حال دریافت اطلاعات جدید...</p>}

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setPage(idx + 1)}
            className={page === idx + 1 ? styles.buttonActive : ""}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      {deleteProduct && (
        <DeleteProductModal
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
        />
      )}
    </>
  );
};

export default ProductList;
