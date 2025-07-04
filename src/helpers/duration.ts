import chalk from 'chalk'

const timeUnits = [
  { unit: 's', threshold: 1e9, decimalPlaces: 2 },
  { unit: 'ms', threshold: 1e6, decimalPlaces: 0 },
  { unit: 'µs', threshold: 1e3, decimalPlaces: 0 },
  { unit: 'ns', threshold: 1, decimalPlaces: 0 }
]

export default function durationString(
  beforeTime: bigint | number,
  useColors: boolean
): string {
  // --- DEBUGGING ---
  console.log(`[durationString] beforeTime: ${beforeTime}, typeof: ${typeof beforeTime}`);
  // --- END DEBUGGING ---

  // Defensive: ensure beforeTime is a BigInt
  let before: bigint
  if (typeof beforeTime === 'bigint') {
    before = beforeTime
  } else if (typeof beforeTime === 'number' && Number.isFinite(beforeTime)) {
    before = BigInt(Math.floor(beforeTime))
  } else {
    // fallback: invalid input, treat as 0 duration
    const zero = useColors
      ? chalk.gray('0ns'.padStart(8).padEnd(16))
      : '0ns'.padStart(8).padEnd(16)
    return zero
  }

  const nanoseconds = Number(process.hrtime.bigint() - before)

  // --- DEBUGGING ---
  console.log(`[durationString] calculated nanoseconds: ${nanoseconds}`);
  // --- END DEBUGGING ---

  for (const { unit, threshold, decimalPlaces } of timeUnits) {
    if (nanoseconds >= threshold) {
      const value = (nanoseconds / threshold).toFixed(decimalPlaces)
      const timeStr = `${value}${unit}`.padStart(8).padEnd(16)
      return useColors ? chalk.gray(timeStr) : timeStr
    }
  }

  return useColors
    ? chalk.gray('0ns'.padStart(8).padEnd(16))
    : '0ns'.padStart(8).padEnd(16)
}
