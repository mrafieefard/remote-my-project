"use client"
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation';

export default function AnimatedLayout({children}: { children: React.ReactNode }) {
  

  const path = usePathname();
  return (
    <motion.div
    key={path}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {children}
  </motion.div>
  )
}