import { IconCamera, IconHome, IconSearch, IconGallery, IconPerson } from "justd-icons";

export function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-neutral/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="flex items-center gap-2 text-primary">
        <IconCamera className="w-6 h-6" />
        <span className="text-xl font-grotesk font-bold tracking-wider text-white">LENSLAB</span>
      </div>
      <div className="flex items-center gap-6 text-tertiary">
        <button className="hover:text-primary transition-colors"><IconHome className="w-5 h-5" /></button>
        <button className="hover:text-primary transition-colors"><IconSearch className="w-5 h-5" /></button>
        <button className="hover:text-primary transition-colors"><IconGallery className="w-5 h-5" /></button>
        <button className="hover:text-primary transition-colors"><IconPerson className="w-5 h-5" /></button>
      </div>
    </nav>
  );
}
