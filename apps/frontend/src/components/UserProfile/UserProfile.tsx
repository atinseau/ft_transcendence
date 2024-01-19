'use client';

import useUserContext from "@contexts/UserContext/useUserContext";


const UserProfile = () => {
  const profile = useUserContext((state) => state.profile)

  return <pre>
    {JSON.stringify(profile, null, 2)}
  </pre>
}

export default UserProfile;