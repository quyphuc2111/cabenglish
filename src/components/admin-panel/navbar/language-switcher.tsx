import { Switch } from '@/components/ui/switch';
import {motion} from 'framer-motion'

interface LanguageSwitcherProps {
  isChecked: boolean;
  onContainerClick: (e: React.MouseEvent) => void;
  onCheckedChange: () => void;
}

export const LanguageSwitcher = ({
  isChecked,
  onContainerClick,
  onCheckedChange
}: LanguageSwitcherProps) => {
  return (
    <motion.div
      className="border-[#61685B] border rounded-md flex items-center bg-white px-2 gap-2 h-12"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onContainerClick}
    >
      {/* Flag images */}
      <Switch
        id="change_language"
        className="switch-component"
        checked={isChecked}
        onCheckedChange={onCheckedChange}
      />
    </motion.div>
  )
} 