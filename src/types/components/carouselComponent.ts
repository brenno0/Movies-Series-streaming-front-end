export interface CarouselProps<T> {
  items: T[]
  type?: 'full' | 'six-per-row'
  delayInMilliseconds?: number
  hasArrows?: boolean
  autoplay?: boolean
  children?:
    | React.ReactNode
    | ((args: {
        item: T
        itemIndex: number
        hovered: number | null
        setHovered: React.Dispatch<React.SetStateAction<number | null>>
      }) => React.ReactNode)
}
