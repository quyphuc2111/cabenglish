"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { getUserInfo } from "@/actions/userAction";

interface UserStoreProviderProps {
  userId: string;
  children: React.ReactNode;
}

export default function UserStoreProvider({
  userId,
  children
}: UserStoreProviderProps) {
  const { setUser, user, setLoading, setError } = useUserStore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) return;

      // ❌ TRÁNH FETCH LIÊN TỤC - Chỉ fetch nếu thực sự cần thiết
      if (!user || user.user_id !== userId) {
        // Debounce để tránh multiple calls
        const timeoutId = setTimeout(async () => {
          setLoading(true);
          setError(null);

          try {
            const response = await getUserInfo({ userId });

            if (response.success && response.data) {
              setUser({
                user_id: response.data.user_id,
                email: response.data.email,
                language: response.data.language,
                theme: response.data.theme,
                mode: response.data.mode,
                is_firstlogin: response.data.is_firstlogin,
                progress: {
                  units: [],
                  lessons: [],
                  sections: [],
                  classrooms: []
                },
                locked: {
                  sections: [],
                  section_contents: [],
                  lessons: []
                }
              });
            } else {
              setError(response.error || "Không thể lấy thông tin người dùng");
            }
          } catch (error) {
            setError("Có lỗi xảy ra khi lấy thông tin người dùng");
            console.error("Error fetching user info:", error);
          } finally {
            setLoading(false);
          }
        }, 100); // Debounce 100ms

        return () => clearTimeout(timeoutId);
      }
    };

    fetchUserInfo();
  }, [userId]); // ❌ LOẠI BỎ dependencies gây re-render

  return <>{children}</>;
}
