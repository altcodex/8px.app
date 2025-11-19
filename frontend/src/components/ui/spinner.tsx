interface CircleSpinnerProps {
  className?: string
}

const arcRatio = 1 / 4

export const CircleSpinner: React.FC<CircleSpinnerProps> = ({ className }) => {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox='0 0 50 50'
      fill='none'
      aria-label='Loading'
    >
      {/* 外側のリング（全体） */}
      <circle
        cx='25'
        cy='25'
        r='22'
        stroke='currentColor'
        strokeWidth='5'
        opacity='0.3'
      />
      {/* 色付き部分 */}
      <circle
        cx='25'
        cy='25'
        r='22'
        stroke='currentColor'
        strokeWidth='5'
        strokeLinecap='round'
        strokeDasharray={`${2 * Math.PI * 22 * arcRatio} ${2 * Math.PI * 22 * (1 - arcRatio)}`}
        strokeDashoffset='0'
      />
    </svg>
  )
}
