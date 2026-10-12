export default function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <span className="product-category">{product.category?.name || 'Produk'}</span>
        <button className="heart-button" type="button" aria-label="Favorit">♡</button>
        <img src={product.image} alt={product.name} className="product-image"
          onError={(e) => { e.currentTarget.src = '/images/Paracetamol 500mg.png'; }} />
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p className="product-unit">{product.unit || 'Produk kesehatan'}</p>
        <div className="product-meta"><strong>Rp {Number(product.price).toLocaleString('id-ID')}</strong><span>Stok {product.stock}</span></div>
        {onAdd && <button className="cart-button" onClick={() => onAdd(product)} disabled={product.stock <= 0}>
          🛒 <span>{product.stock <= 0 ? 'Habis' : 'Keranjang'}</span>
        </button>}
      </div>
    </article>
  );
}
