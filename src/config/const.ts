// W<Comment>---------={ Const are declared here  }=----------</Comment>
export const BASE_URL =
  process.env.NEXT_PUBLIC_Backend_API_URL ||
  process.env.Backend_API_URL ||
  "http://localhost:8080";
