import Navbar from "@/components/layout/Navbar";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      {children}
    </div>
  );
}