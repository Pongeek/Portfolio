import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from './ui/theme-toggle';

export default function Navigation() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Height of the fixed navbar plus some padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const links = [
    { id: "about", label: "About" },
    { id: "skills", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="fixed w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between h-14 px-4 md:px-6 md:h-16">
        <NavigationMenu className="flex justify-center">
          <NavigationMenuList className="flex items-center gap-1 sm:gap-3 md:gap-6">
            {links.map((link) => (
              <NavigationMenuItem key={link.id}>
                <Button
                  variant="ghost"
                  className="px-2 sm:px-3 md:px-6 h-8 md:h-10 text-sm md:text-base font-medium transition-colors hover:text-primary hover:bg-accent/50"
                  onClick={() => scrollToSection(link.id)}
                >
                  {link.label}
                </Button>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center ml-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
