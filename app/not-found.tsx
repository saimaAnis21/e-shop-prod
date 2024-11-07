import Link from "next/link";
import { headers } from "next/headers";

export default async function NotFound() {
  const headersList = await headers();
  const domain = headersList.get("host");
  return (
    <div className="mt-5 text-center">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <p>
        View <Link href="/">Go to homepage</Link>
      </p>
    </div>
  );
}
