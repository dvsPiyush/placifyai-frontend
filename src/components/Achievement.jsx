import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Badges = ({ username }) => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (!username) return;
    axios.post(`${process.env.REACT_APP_API_URL}/api/get-user`, { username })
      .then(res => setBadges(res.data.badges || []))
      .catch(() => setBadges([]));
  }, [username]);

  return (
    <div className="badges">
      <h3>🏅 Achievements</h3>
      {badges.length === 0 && <p>No badges yet.</p>}
      <ul>
        {badges.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
};

export default Badges;