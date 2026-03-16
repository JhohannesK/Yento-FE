import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Newsletter = () => {
  return (
    <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
            Subscribe to Our Newsletter
          </h2>
          <p className="mx-auto max-w-[700px] text-sm text-muted-foreground sm:text-base md:text-xl px-2">
            Stay updated with our latest products and exclusive offers.
          </p>
          <div className="w-full max-w-md space-y-2 px-2">
            <form className="flex flex-col sm:flex-row gap-2 sm:space-x-0">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0"
              />
              <Button type="submit" className="sm:shrink-0">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter