function DeleteProductModal({
  product,
  isDeleting,
  deleteError,
  onClose,
  onConfirm
}) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <section
        className="product-modal delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
      >
        <div className="delete-icon" aria-hidden="true">
          !
        </div>
        <h2 id="delete-product-title">Hapus Produk?</h2>
        <p className="delete-description">
          Produk yang dihapus tidak dapat dikembalikan.
        </p>

        <div className="delete-product-summary">
          <strong>{product.name}</strong>
          <span>
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0
            }).format(product.price)}
          </span>
        </div>

        {deleteError && (
          <p className="form-error" role="alert">
            {deleteError}
          </p>
        )}

        <div className="modal-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onClose}
            disabled={isDeleting}
          >
            Batal
          </button>
          <button
            className="delete-button"
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Menghapus...' : 'Hapus Produk'}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteProductModal;
