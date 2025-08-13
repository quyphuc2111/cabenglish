
import { redirect } from "next/navigation";

async function Auth() {
  // Chặn truy cập vào trang /signin và chuyển hướng tới /signin-v2
  redirect("/signin-v2");
}

export default Auth;
