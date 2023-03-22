import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const WindowWrapper = ({ children }) => {
  const [windowReadyFlag, setWindowReadyFlag] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowReadyFlag(true);
    }
  }, [router.route]);
  if (windowReadyFlag) {
    return <>{children}</>;
  } else {
    return null;
  }
};

export default WindowWrapper;
