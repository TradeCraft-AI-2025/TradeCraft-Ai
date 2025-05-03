import { Skeleton } from "@/components/ui/skeleton"

export default function PricingLoading() {
  return (
    <div className="container max-w-6xl py-12 md:py-24">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-[300px] mx-auto mb-4" />
        <Skeleton className="h-6 w-[500px] mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-10 w-[120px] mt-4" />
              </div>
              <Skeleton className="h-[1px] w-full" />
              <div className="space-y-4">
                <div className="flex items-start">
                  <Skeleton className="h-5 w-5 mr-2 mt-0.5" />
                  <Skeleton className="h-5 w-[200px]" />
                </div>
                <div className="flex items-start">
                  <Skeleton className="h-5 w-5 mr-2 mt-0.5" />
                  <Skeleton className="h-5 w-[220px]" />
                </div>
                <div className="flex items-start">
                  <Skeleton className="h-5 w-5 mr-2 mt-0.5" />
                  <Skeleton className="h-5 w-[180px]" />
                </div>
              </div>
              <Skeleton className="h-10 w-full mt-6" />
            </div>
          ))}
      </div>

      <div className="mt-20">
        <Skeleton className="h-8 w-[250px] mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
