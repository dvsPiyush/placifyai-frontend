import React, { useEffect, useState } from 'react';
import API from '../services/api';

function ProtectedPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('api/protected')
      .then((res) => setData(res.data))
      .catch(() => alert("Access denied or token expired!"));
  }, []);

  return (
    <div>
      <h2>Protected Page</h2>
      {data ? <p>Welcome {data.name} ({data.user})</p> : <p>Loading...</p>}
    </div>
  );
}

export default ProtectedPage;
