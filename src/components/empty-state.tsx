import Image from 'next/image'

interface EmptyStateProps {
  title: string
  description: string
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/empty.svg" alt="Empty state" height={240} width={240} />
      <div className="mx-auto flex max-w-md flex-col gap-y-2 text-center">
        <h6 className="text-lg font-medium">{title}</h6>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  )
}
