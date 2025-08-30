import { useState, useEffect } from "react";

export const useUserData = () => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const syncData = () => {
      if (typeof window !== "undefined") {
        const storedName = localStorage.getItem("firstName");
        let storedId = localStorage.getItem("userId");

        if (!storedId) {
          storedId =
            localStorage.getItem("user_id") || localStorage.getItem("id");
        }

        if (storedName) setUserName(storedName);
        if (storedId) setUserId(storedId);
      }
    };

    syncData();

    window.addEventListener("storage", syncData);

    return () => {
      window.removeEventListener("storage", syncData);
    };
  }, []);

  return { userName, userId };
};