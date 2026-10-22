import { ReactNode } from "react"

const Container = ({ children, className } : { children: ReactNode, className?: string }) => {
  return (
    <div className={`mx-auto flex w-full max-w-300 px-0 max-[760px]:px-5 ${className || ''}`}>{children}</div>
  )
}

export default Container