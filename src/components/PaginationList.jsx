import { useEffect, useState } from "react";

export default function PaginationList(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const POSTS_PER_PAGE = 6; // reqres max per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
                'https://reqres.in/api/users?page=${page}&per_page=${POSTS_PER_PAGE}',
                  { headers: { 'x-api-key': 'reqres_5c31da4b3fa049f99937b84f8caef3ad' } }
                
          
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }

        const data = await response.json();
        setUsers(data.data);
        setTotalPages(data.total_pages);
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
      <h2>Paginated Users</h2>
      <p>Page {page} of {totalPages}</p>

      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>
        Previous
      </button>

      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading}>
        Next
      </button>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <div>
          {users.map((user) => (
            <div key={user.id}>
              <h4>{user.first_name} {user.last_name}</h4>
              <p>{user.email}</p>
              <img src={user.avatar} alt="" width={60} />
            </div>
          ))}
        </div>
      )}

      <div>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            disabled={page === i + 1 || loading}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}