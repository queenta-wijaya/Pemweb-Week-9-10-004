const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <span className="product-id">ID: {product.id}</span>
      <h3>{product.name}</h3>
      <p className="product-price">{rupiahFormatter.format(product.price)}</p>
    </article>
  );
}

export default ProductCard;
