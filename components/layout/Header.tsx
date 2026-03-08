import Image from "next/image";
type HeaderProps = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  onLogout: () => void;   // 👈 เพิ่ม
};
export default function Header({
  collapsed,
  setCollapsed,
  onLogout,
}: HeaderProps) {
  return (
   <header className="flex justify-between items-center px-6 h-14 bg-white shadow">

      {/* ฝั่งซ้าย: Logo (กดได้) */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="text-xl font-bold cursor-pointer select-none"
      >
        MyLogo
      </div>

      {/* ฝั่งขวา: Logout */}
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>

    </header>
  );
}