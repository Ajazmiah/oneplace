import Avatar from "@/components/Avatar/Avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginButton from "@/components/ui/LoginButton";

export function Dropdown({ loggedIn, session }) {


    const user_name = session.user.name
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
       
       <Avatar session={session}/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>{user_name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          
          </DropdownMenuItem>
        
          <DropdownMenuItem>
            Settings
           
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LoginButton display="desktop" loggedIn={loggedIn} />
         
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
