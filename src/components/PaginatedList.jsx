import { useEffect, useState } from "react";

export function PaginatedList() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);

    const POSTS_PER_PAGE = 10;
    const TOTAL_POSTS = 100;
    const totalPages = Math.ceil(TOTAL_POSTS / POSTS_PER_PAGE);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${POSTS_PER_PAGE}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }

                const data = await response.json();
                setPosts(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page]);

    return (
        <div>
            <h2>Paginated List</h2>
            <p>Page {page} of {totalPages}</p>

            <div>
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                >
                    Previous
                </button>

                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                >
                    Next
                </button>
            </div>

            {loading && <p>Loading posts...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <div>
                    {posts.map((post, index) => (
                        <div key={post.id}>
                            <h3>
                                Post #{(page - 1) * POSTS_PER_PAGE + index + 1}
                            </h3>
                            <h4>{post.title}</h4>
                            <p>{post.body}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="page-jumper">
                <p>Jump to page:</p>
                {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={page === pageNum ? "active" : ""}
                            disabled={loading}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
