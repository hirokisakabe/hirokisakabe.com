import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hiroki SAKABE",
  description: "hiroki sakabe's blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-row px-10">
          <div className="basis-1/4">
            <div className="flex h-screen items-center">
              <div className="">
                <Link href="/">
                  <div className="flex flex-col items-center">
                    <Image src="/icon.jpg" alt={""} width={200} height={200} />
                    <div className="text-center">
                      <div className="text-2xl">Hiroki SAKABE</div>
                    </div>
                    <div className="py-3 text-center">
                      <div className="text-base">
                        プログラミングと旅行が好きなミニマリスト
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="basis-3/4">
            <div className="pt-6">
              <main className="flex flex-col">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
