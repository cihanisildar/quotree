import Image from "next/image"

interface FeatureSectionProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  imageOnRight?: boolean
}

export default function FeatureSection({ title, description, imageSrc, imageAlt, imageOnRight = false }: FeatureSectionProps) {
  const TextContent = () => (
    <div className="flex gap-4 flex-col items-start justify-center">
      <h2 className="text-3xl font-semibold">{title}</h2>
      <p>{description}</p>
    </div>
  )

  const ImageContent = () => (
    <div className="flex items-center justify-center">
      <Image src={imageSrc} alt={imageAlt} width={400} height={400} />
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 grid grid-cols-1 md:grid-cols-2 bg-slate-50 mt-10 px-8 rounded-[8px]">
      {imageOnRight ? (
        <>
          <TextContent />
          <ImageContent />
        </>
      ) : (
        <>
          <ImageContent />
          <TextContent />
        </>
      )}
    </div>
  )
}