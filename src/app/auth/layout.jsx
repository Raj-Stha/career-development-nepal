import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className=" min-h-screen bg-primary/2">
      <div className="container max-w-7xl mx-auto px-2 md:px-4">
        <Link
          href="/"
          className="fixed flex items-center group bg-pwhite p-2 sm:p-3 rounded-b-xl z-[100]"
        >
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wide hover:scale-105 transition-all duration-300 cursor-pointer">
            <span
              className="relative inline-block"
              style={{
                color: "#2c2c2c",
                textShadow: `
                      1px 1px 0px #d4d4d4,
                      2px 2px 0px #c8c8c8,
                      3px 3px 0px #bcbcbc,
                      4px 4px 0px #b0b0b0,
                      5px 5px 0px #a4a4a4,
                      6px 6px 0px #989898,
                      7px 7px 0px #8c8c8c,
                      8px 8px 15px rgba(0,0,0,0.3),
                      10px 10px 20px rgba(0,0,0,0.2),
                      12px 12px 25px rgba(0,0,0,0.1)
                    `,
              }}
            >
              Rajib Khatry
            </span>
          </h1>
        </Link>
        <main className="">{children}</main>
      </div>
    </div>
  );
}
