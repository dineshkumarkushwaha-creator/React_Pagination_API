import { useEffect, useState } from "react";

export function SearchWithDebounce() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter users
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredUsers(users);
      return;
    }

    const searchLower = debouncedSearch.toLowerCase();

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    );

    setFilteredUsers(filtered);
  }, [debouncedSearch, users]);

  const handleChangeSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Realtime Search with Debounce</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={handleChangeSearch}
      />

      {searchTerm && <button onClick={handleClearSearch}>❌ Clear</button>}

      <p>
        {debouncedSearch
          ? `Searching for "${debouncedSearch}"`
          : "Start typing to search"}
      </p>

      <p>
        Showing {filteredUsers.length} out of {users.length}
      </p>

      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <div key={user.id} className="user-card">
            <h3>{highlightText(user.name, debouncedSearch)}</h3>
            <p>📧 {highlightText(user.email, debouncedSearch)}</p>
            <p>🏢 {user.company.name}</p>
            <p>🌐 {user.website}</p>
          </div>
        ))
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}

function highlightText(text, highlight) {
  if (!highlight) return text;

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <strong key={index}>{part}</strong>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}
