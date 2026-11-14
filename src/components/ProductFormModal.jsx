import { useState } from 'react';

function ProductFormModal({
  product,
  isSubmitting,
  submitError,
  onClose,
  onSubmit
}) {
  const [name, setName] = useState(product ? product.name : '');
  const [price, setPrice] = useState(product ? String(product.price) : '');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ name: name.trim(), price: Number(price) });
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
      >
        <header className="modal-header">
          <div>
            <h2 id="product-form-title">
              {product ? 'Edit Produk' : 'Tambah Produk'}
            </h2>
            <p>
              {product
                ? 'Perbarui informasi produk yang dipilih.'
                : 'Masukkan informasi produk baru.'}
            </p>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Tutup"
            disabled={isSubmitting}
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="new-product-name">Nama Produk</label>
            <input
              id="new-product-name"
              type="text"
              placeholder="Contoh: Pulpen"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-field">
            <label htmlFor="new-product-price">Harga (Rp)</label>
            <input
              id="new-product-price"
              type="number"
              placeholder="Contoh: 5000"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              min="0.01"
              step="any"
              required
            />
            <small>Harga harus lebih dari 0.</small>
          </div>

          {submitError && (
            <p className="form-error" role="alert">
              {submitError}
            </p>
          )}

          <div className="modal-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Menyimpan...'
                : product
                  ? 'Simpan Perubahan'
                  : 'Simpan Produk'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProductFormModal;
