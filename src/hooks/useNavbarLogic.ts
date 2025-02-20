import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export const useNavbarLogic = () => {
  const [lastSlug, setLastSlug] = useState<string>("");
  const [isChecked, setIsChecked] = useState(false);
//   const router = useRouter();

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split("/");
    const slug = parts.pop() || parts.pop();
    setLastSlug(slug);
  }, []);

  const handleBack = () => {
    // router.push("/main/khoa-hoc");
  };

  const handleClick = () => {
    setIsChecked((prev) => !prev);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.switch-component')) {
      handleClick();
    }
  };

  return {
    lastSlug,
    isChecked, 
    handleBack,
    handleClick,
    handleContainerClick
  };
}; 