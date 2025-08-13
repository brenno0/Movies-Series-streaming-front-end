
export function MovieModalContent({ movieURL, movieTitle }: Readonly<{ movieURL:string; movieTitle:string }>) {
  return (
    <iframe
    title={movieTitle}
    className="w-full min-h-[90vh]"
    src={movieURL}
    allowFullScreen
    />
  )
}
