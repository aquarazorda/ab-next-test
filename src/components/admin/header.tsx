import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

const navigationList = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "CMS",
    href: "/cms",
  },
];

export default function AdminHeader() {
  return (
    <div className="flex w-full border py-0.5 px-4 justify-end">
      <NavigationMenu>
        <NavigationMenuList>
          {navigationList.map((item) => (
            <NavigationMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {item.name}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
