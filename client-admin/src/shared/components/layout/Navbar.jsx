import { Typography } from "@material-tailwind/react";
import { AvatarUser } from "../ui/AvatarUser";
import imgLogo from "../../../assets/img/kinal_sports.png";

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={imgLogo}
            alt="Kinal Sports Logo"
            className="h-8 md:h-10 w-auto object-contain"
          />
          <Typography variant="h5" className="font-bold text-main-blue">
            Kinal Sports Admin
          </Typography>
        </div>
        <AvatarUser />
      </div>
    </nav>
  );
};
