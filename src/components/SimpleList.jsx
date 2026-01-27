import { useEffect, useState } from "react";

export function SimpleList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect (() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                const response = await fetch('https://jsonplaceholder.typicode.com/users');
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data = await response.json();
                setUsers(data);

                setError(null);
            } catch(err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div>
                <h2>Simple List</h2>
                <p>Loading Users....</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h2>Simple List</h2>
                <p>Error: {error}</p>
            </div>
        );
    }


    return (
        <div>
            <h2>Simple List</h2>
            <p>
                This Component Fetches all users at once when it first loads
            </p>

            <div>
                {users.map((user) => (
                    <div key={user.id}>
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                        <p>{user.company.name}</p>
                    </div>
                ))}
            </div>

            <p>Total Users : {users.length}</p>
        </div>
    );
};