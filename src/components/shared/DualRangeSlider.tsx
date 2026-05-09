import React from 'react'

interface DualRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  onCommit?: (value: [number, number]) => void
  step?: number
}

const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min, max, value, onChange, onCommit, step = 1
}) => {
  const [low, high] = value
  const range = max - min
  const lowPct = ((low - min) / range) * 100
  const highPct = ((high - min) / range) * 100

  const handleLow = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), high - step)
    onChange([val, high])
  }

  const handleHigh = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), low + step)
    onChange([low, val])
  }

  const handleRelease = () => {
    onCommit?.(value)
  }

  const thumbClass = `
    absolute w-full h-1 appearance-none bg-transparent cursor-pointer pointer-events-none
    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto
    [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px]
    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black
    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
    [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-[18px]
    [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white
  `

  return (
    <div className="relative h-5 flex items-center">
      <div className="absolute w-full h-1 bg-neutral-200 rounded-full" />
      <div
        className="absolute h-1 bg-black rounded-full"
        style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
      />
      <input
        type="range" min={min} max={max} step={step} value={low}
        onChange={handleLow}
        onMouseUp={handleRelease}
        onTouchEnd={handleRelease}
        className={thumbClass}
      />
      <input
        type="range" min={min} max={max} step={step} value={high}
        onChange={handleHigh}
        onMouseUp={handleRelease}
        onTouchEnd={handleRelease}
        className={thumbClass}
      />
    </div>
  )
}

export default DualRangeSlider
