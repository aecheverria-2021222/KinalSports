import { Typography } from "@material-tailwind/react"
import { AvatarUser } from "../ui/AvatarUser.jsx"
import imgLogo from '../../../assets/img/kinal_sports.png'
import { Avatar } from "@material-tailwind/react"

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
          src={imgLogo} 
          alt="Kinal Sports Logo" 
          className="h-8 md:h w-auto object-contain" 
          />
          <Typography variant="h5" className="font-bold text-main-blue">
            Kinal Sports Admin
          </Typography>
        </div>
        <AvatarUser />
      </div>
    </nav>
  )
}