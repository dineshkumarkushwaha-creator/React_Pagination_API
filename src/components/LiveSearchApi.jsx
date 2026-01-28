import { useState, useEffect } from "react";

function LiveSearchAPI() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API call
  useEffect(() => {
    if (!debouncedSearch.trim() || debouncedSearch.length < 2) {
      setProducts([]);
      setTotalResults(0);
      return;
    }

    const abortController = new AbortController();

    const searchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`🔍 Searching for "${debouncedSearch}"`);

        const response = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(
            debouncedSearch
          )}&limit=20`,
          { signal: abortController.signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setProducts(data.products);
        setTotalResults(data.total);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    searchProducts();

    return () => abortController.abort();
  }, [debouncedSearch]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌐 Live API Search (Debounced)</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
      />

      <div
        style={{
          padding: "10px",
          background: loading ? "#fff3cd" : "#d4edda",
          border: loading
            ? "1px solid #ffc107"
            : "1px solid #28a745",
          marginBottom: "10px",
        }}
      >
        {loading && `⏳ Searching "${debouncedSearch}"...`}
        {!loading && debouncedSearch &&
          `✅ Found ${totalResults} result(s)`}
        {!debouncedSearch && "💭 Start typing to search"}
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          ❌ {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "15px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <h3>{highlightText(product.title, debouncedSearch)}</h3>
            <p>{product.description}</p>
            <strong>${product.price}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

// Highlight helper
function highlightText(text, highlight) {
  if (!highlight) return text;

  try {
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} style={{ background: "yellow" }}>
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  } catch {
    return text;
  }
}

export default LiveSearchAPI;
