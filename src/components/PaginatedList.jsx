import { useEffect, useState } from "react";
import { getUsersPaginated } from "../api/userService";

export function PaginatedList() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const POSTS_PER_PAGE = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getUsersPaginated(page, POSTS_PER_PAGE);

                setUsers(response.data.data);
                setTotalPages(response.data.total_pages); // from API
            } catch (err) {
                const errorMessage =
                    err.response?.message ||
                    err.message ||
                    "Failed to fetch the users";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page]);

    const handleNext = () => {
        setPage(prev => Math.min(totalPages, prev + 1));
    };

    const handlePrevious = () => {
        setPage(prev => Math.max(1, prev - 1));
    };

    const goToPage = (pageNumber) => {
        if (pageNumber !== page && !loading) {
            setPage(pageNumber);
        }
    };

    return (
        <div>
            <h2>Paginated List</h2>
            <strong>useEffect runs whenever 'page' changes</strong>

            <p>
                Page {page} of {totalPages}
            </p>

            <div>
                <button onClick={handlePrevious} disabled={page === 1 || loading}>
                    Previous
                </button>

                <button onClick={handleNext} disabled={page === totalPages || loading}>
                    Next
                </button>
            </div>

            {loading && <p>Loading users for page {page}...</p>}
            {error && <p>Error: {error}</p>}

            {!loading && !error && (
                <div>
                    {users.map((user, index) => (
                        <div key={user.id} style={{ marginBottom: "16px" }}>
                            <h3>
                                User #{(page - 1) * POSTS_PER_PAGE + index + 1}
                            </h3>

                            <img
  src={user.avatar}
  alt={`${user.first_name} ${user.last_name}`}
  style={{
    width: "60px",
    height: "60px",
    borderRadius: "50%",
  }}
/>


                            <div>
                                <h3>
                                    {user.first_name} {user.last_name}
                                </h3>
                                <p style={{ color: "#666" }}>{user.email}</p>
                                <p style={{ fontSize: "0.9em", color: "#888" }}>
                                    User ID: {user.id}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="page-jumper">
                <p>Jump to page:</p>
                <div className="page-buttons">
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={page === pageNum ? "active" : ""}
                                disabled={loading}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}