const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

function ProductCard({ product, onEdit, onDelete }) {
  return (
    <article className="product-card">
      <span className="product-id">ID: {product.id}</span>
      <h3>{product.name}</h3>
      <p className="product-price">{rupiahFormatter.format(product.price)}</p>
      <div className="product-actions">
        <button
          className="outline-button"
          type="button"
          onClick={() => onEdit(product)}
        >
          Edit
        </button>
        <button
          className="delete-button"
          type="button"
          onClick={() => onDelete(product)}
        >
          Hapus
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
