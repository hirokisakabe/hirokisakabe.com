import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/react";

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
    <html lang="ja">
      <body className={inter.className}>
        <div className="flex flex-col px-10 lg:flex-row lg:space-x-2">
          <div className="basis-full lg:basis-1/4">
            <div className="flex flex-col items-center lg:h-screen lg:flex-row">
              <div className="">
                <Link href="/">
                  <div className="flex flex-col items-center">
                    <div className="w-28 lg:w-fit">
                      <Image
                        src="/icon.jpg"
                        alt={""}
                        width={200}
                        height={200}
                      />
                    </div>
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
          <div className="basis-full lg:basis-3/4">
            <div className="pt-6">
              <main className="flex flex-col">{children}</main>
            </div>
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
