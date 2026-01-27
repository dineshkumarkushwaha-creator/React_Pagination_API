import { useEffect, useState } from "react";

export default function PaginationList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://reqres.in/api/users?page=${page}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const result = await response.json();

        setUsers(result.data);
        setTotalPages(result.total_pages);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  return (
    <div>
      <h2>Pagination List</h2>

      <p>
        Page {page} of {totalPages}
      </p>

      <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
        Previous
      </button>

      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
        Next
      </button>

      {users.map((u) => (
        <div key={u.id}>
          <img src={u.avatar} width="40" />
          <p>{u.first_name} {u.last_name}</p>
        </div>
      ))}
    </div>
  );
}
