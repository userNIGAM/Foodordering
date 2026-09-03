import { useEffect, useState } from "react";

const useKitchens = ({ onLoaded }) => {
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchKitchens = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/kitchen`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        const kitchenList = data.data || [];

        setKitchens(kitchenList);

        if (onLoaded) {
          onLoaded(kitchenList);
        }
      } catch (error) {
        console.error("Error fetching kitchens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKitchens();
  }, [apiUrl, token]);

  return {
    kitchens,
    loading,
  };
};

export default useKitchens;
