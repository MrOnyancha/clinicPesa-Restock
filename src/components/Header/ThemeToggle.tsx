import { MdOutlineWbSunny } from 'react-icons/md';
import { BsMoonStarsFill } from 'react-icons/bs';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/theme-provider';

const ThemeToggle: React.FC = () => {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="mx-2 bg-transparent border-none">
        <div>
          {theme === 'light' ? (
            <MdOutlineWbSunny className="h-[1.2rem] w-[1.2rem] block cursor-pointer" />
          ) : (
            <BsMoonStarsFill className="h-[1.2rem] w-[1.2rem] block cursor-pointer" />
          )}
          <span className="sr-only">Toggle theme</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
