import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <section className="text-center">
        <h1 className="text-5xl font-bold text-indigo-700 mb-4">CampHub</h1>
        <p className="text-lg text-gray-600 mb-6">
          A platform to rent and manage camping gear with ease.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="#"
            className="rounded-2xl bg-indigo-600 px-6 py-3 text-white font-medium shadow hover:bg-indigo-700 transition"
          >
            Get Started
          </a>
          <a
            href="#"
            className="rounded-2xl border border-indigo-600 px-6 py-3 text-indigo-600 font-medium shadow hover:bg-indigo-50 transition"
          >
            Learn More
          </a>
        </div>
      </section>
    </main>
  );
}
