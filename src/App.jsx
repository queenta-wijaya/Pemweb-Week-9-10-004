import { useEffect, useState } from 'react';
import ProductCard from './components/ProductCard.jsx';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadProducts() {
      setIsLoading(true);
      setLoadError('');

      try {
        const response = await fetch('/products');
        if (!response.ok) {
          throw new Error(`Permintaan produk gagal (${response.status})`);
        }

        const result = await response.json();
        if (result.status !== 'success' || !Array.isArray(result.data)) {
          throw new Error('Format data produk tidak sesuai');
        }

        if (isActive) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error('Gagal memuat daftar produk:', error);
        if (isActive) {
          setLoadError(
            'Daftar produk tidak dapat dimuat. Pastikan server API sedang berjalan.'
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase('id-ID');
  const filteredProducts = products.filter((product) =>
    product.name.toLocaleLowerCase('id-ID').includes(normalizedSearch)
  );

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Katalog</p>
        <h1>Manajemen Produk</h1>
        <p className="page-description">
          Kelola daftar produk dan harga dalam satu tempat.
        </p>
      </header>

      <section className="product-section" aria-labelledby="products-heading">
        <div className="section-heading">
          <div>
            <h2 id="products-heading">Daftar Produk</h2>
            <p>Kelola daftar produk dan harga dalam satu tempat.</p>
          </div>
          {!isLoading && !loadError && (
            <span className="product-count">
              {filteredProducts.length} dari {products.length} produk
            </span>
          )}
        </div>

        <label className="visually-hidden" htmlFor="product-search">
          Cari nama produk
        </label>
        <input
          id="product-search"
          className="search-input"
          type="search"
          placeholder="Cari nama produk..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {isLoading ? (
          <p className="list-message" role="status">
            Memuat produk...
          </p>
        ) : loadError ? (
          <div className="list-message error-message" role="alert">
            <p>{loadError}</p>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Coba lagi
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="list-message">
            {products.length === 0
              ? 'Belum ada produk.'
              : 'Produk tidak ditemukan.'}
          </p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
