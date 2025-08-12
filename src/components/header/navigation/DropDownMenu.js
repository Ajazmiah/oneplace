import Avatar from "@/components/Avatar/Avatar";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginButton from "@/components/ui/LoginButton";

export function Dropdown({ loggedIn, session }) {
  const user_name = session.user.name;
  return (
    <div className="cursor-pointer">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar session={session} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>{user_name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>

          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
       
          <LoginButton display="desktop" loggedIn={loggedIn} />
       
      </DropdownMenuContent>
    </DropdownMenu>

    </div>
  );
}
