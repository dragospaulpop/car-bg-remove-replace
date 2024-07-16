import { motion } from "framer-motion";
import { ModeToggle } from "./mode-toggle";

export default function NavBar() {
  return (
    <motion.nav
      className="flex items-center justify-between bg-accent p-2 shadow-md"
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
      <div className="flex-none">
        <ModeToggle />
      </div>
    </motion.nav>
  );
}
