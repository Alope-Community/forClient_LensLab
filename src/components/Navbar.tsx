import { IconCamera } from "justd-icons";
import { useTranslation } from "react-i18next";
import { Button } from "./button/Button";

export function Navbar() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: "id" | "en") => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-neutral/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 container mx-auto">
      <div className="flex items-center gap-2 text-primary">
        <IconCamera className="w-6 h-6" />
        <span className="text-xl font-grotesk font-bold tracking-wider text-white">LENSLAB</span>
      </div>

      {/* LANG SELECTOR BUTTONS */}
      <div className="flex justify-end gap-2 p-1 bg-surface/50 border border-white/5 rounded-lg w-fit">
        <Button
          type="button"
          variant="tab"
          className="py-1 px-3 text-xs"
          isActive={i18n.language.startsWith("id")}
          onClick={() => changeLanguage("id")}
        >
          ID
        </Button>

        <Button
          type="button"
          variant="tab"
          className="py-1 px-3 text-xs"
          isActive={i18n.language.startsWith("en")}
          onClick={() => changeLanguage("en")}
        >
          EN
        </Button>
      </div>
    </nav>
  );
}