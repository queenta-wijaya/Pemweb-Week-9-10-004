function App() {
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
            <p>Produk akan ditampilkan di bagian ini.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
